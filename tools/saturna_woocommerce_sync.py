#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SATURNA — Sincronización de catálogo con WooCommerce
=====================================================

Lee SATURNA_PRODUCTS.xlsx (hoja "01-Catalogo") y crea o actualiza los
productos correspondientes en una tienda WooCommerce vía REST API,
usando el SKU como identificador único (upsert).

REQUISITOS
----------
1. Un sitio WordPress con WooCommerce activo y accesible por HTTPS.
2. Claves API REST de WooCommerce:
   WooCommerce → Ajustes → Avanzado → REST API → Agregar clave
   (permisos: Lectura/Escritura).
3. Dependencias de Python:
       pip install -r requirements.txt

SEGURIDAD
---------
- Las claves NUNCA se escriben en el código: se leen de variables de
  entorno (WC_STORE_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET).
- No subas WC_CONSUMER_KEY / WC_CONSUMER_SECRET a un repositorio público.
  En producción usa un gestor de secretos o un archivo .env no versionado.

MODO SEGURO POR DEFECTO
-----------------------
- Por defecto el script se ejecuta en MODO DRY-RUN (simulación): no crea
  ni modifica ningún producto. Para ejecutar escrituras reales hay que
  pasar --apply Y confirmar interactivamente.
- Primero ejecuta siempre:
       python saturna_woocommerce_sync.py SATURNA_PRODUCTS.xlsx
  revisa el plan, y solo entonces:
       python saturna_woocommerce_sync.py SATURNA_PRODUCTS.xlsx --apply

USO
---
    python saturna_woocommerce_sync.py SATURNA_PRODUCTS.xlsx
    python saturna_woocommerce_sync.py SATURNA_PRODUCTS.xlsx --apply
    python saturna_woocommerce_sync.py SATURNA_PRODUCTS.xlsx --market colombia
    python saturna_woocommerce_sync.py SATURNA_PRODUCTS.xlsx --sheet "01-Catalogo"

IMPORTANTE
----------
- Este script NO se ejecuta automáticamente: debe correrse desde una
  máquina/servidor con acceso a internet y a la tienda real.
- Prueba siempre primero en modo dry-run y, si es posible, contra un
  entorno de staging antes de tocar la tienda en producción.
"""

import argparse
import os
import sys
import time
import logging
import requests
import pandas as pd

# ------------------------------------------------------------------
# CONFIGURACIÓN — solo se leen variables de entorno, nunca valores
# literales en el código:
#   export WC_STORE_URL="https://tu-tienda-saturna.com"
#   export WC_CONSUMER_KEY="ck_xxxxxxxx"
#   export WC_CONSUMER_SECRET="cs_xxxxxxxx"
#   export WC_API_VERSION="wc/v3"   # opcional, por defecto "wc/v3"
# ------------------------------------------------------------------
WC_STORE_URL = os.environ.get("WC_STORE_URL", "").strip()
WC_CONSUMER_KEY = os.environ.get("WC_CONSUMER_KEY", "").strip()
WC_CONSUMER_SECRET = os.environ.get("WC_CONSUMER_SECRET", "").strip()
WC_API_VERSION = os.environ.get("WC_API_VERSION", "wc/v3").strip() or "wc/v3"

REQUEST_TIMEOUT = 20
RATE_LIMIT_SLEEP = 0.4  # segundos entre llamadas, para no saturar la API

DEFAULT_SHEET = "01-Catalogo"

# ------------------------------------------------------------------
# Mapeo de mercados SATURNA.
# Debe coincidir con el motor Geo-Market del sitio (CurrencyContext):
#   USA       -> USD  (market id "US")
#   Colombia  -> COP  (market id "CO")
#   China     -> CNY  (market id "CN")
#   Hong Kong -> HKD  (market id "HK")
# La columna del Excel indica si la pieza está activa para ese mercado.
# ------------------------------------------------------------------
MARKET_COLUMN_MAP = {
    "usa": {"excel_col": "USA", "meta_key": "saturna_market_us", "currency": "USD"},
    "colombia": {"excel_col": "Colombia", "meta_key": "saturna_market_co", "currency": "COP"},
    "china": {"excel_col": "China", "meta_key": "saturna_market_cn", "currency": "CNY"},
    "hongkong": {"excel_col": "Hong Kong", "meta_key": "saturna_market_hk", "currency": "HKD"},
}

# Precio regional por mercado -> clave meta en WooCommerce.
MARKET_PRICE_META = {
    "usa": {"excel_col": "Precio USD", "meta_key": "saturna_price_usd"},
    "colombia": {"excel_col": "Precio COP", "meta_key": "saturna_price_cop"},
    "china": {"excel_col": "Precio CNY", "meta_key": "saturna_price_cny"},
    "hongkong": {"excel_col": "Precio HKD", "meta_key": "saturna_price_hkd"},
}

# Columna obligatoria del catálogo.
REQUIRED_COLUMNS = ["SKU"]

# Columnas recomendadas. Si faltan, se avisa pero no se aborta (repliegue seguro).
RECOMMENDED_COLUMNS = [
    "Nombre ES",
    "Nombre EN",
    "Precio USD",
    "Stock",
    "Descripción larga (ES)",
    "Descripción corta (FR)",
    "Categoría",
    "Color",
    "Talla",
    "Material",
    "URL Imagen 1",
    "Estado",
    "Destacado",
    "USA",
    "Colombia",
    "China",
    "Hong Kong",
    "Precio COP",
    "Precio CNY",
    "Precio HKD",
]

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-7s  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("saturna-sync")


# ------------------------------------------------------------------
# Utilidades
# ------------------------------------------------------------------
def api_url(path):
    return f"{WC_STORE_URL.rstrip('/')}/wp-json/{WC_API_VERSION}/{path.lstrip('/')}"


def credentials_configured():
    return bool(
        WC_STORE_URL
        and WC_CONSUMER_KEY
        and WC_CONSUMER_SECRET
        and not WC_STORE_URL.lower().startswith("https://tu-tienda")
        and not WC_CONSUMER_KEY.startswith("ck_REEMPLAZAR")
    )


def wc_request(method, path, apply_mode, **kwargs):
    """Ejecuta una llamada a la API WooCommerce.

    En modo dry-run (apply_mode=False) no se realiza ninguna escritura:
    las peticiones GET sí se ejecutan (para buscar SKU existentes y
    categorías) pero POST/PUT se simulan. Esto permite mostrar un plan
    realista sin tocar la tienda.
    """
    is_write = method.upper() in ("POST", "PUT", "PATCH", "DELETE")

    if apply_mode is False and is_write:
        log.info("[DRY-RUN] %s %s  payload=%s", method, path, kwargs.get("json"))
        return {"id": -1, "_dry_run": True}

    resp = requests.request(
        method,
        api_url(path),
        auth=(WC_CONSUMER_KEY, WC_CONSUMER_SECRET),
        timeout=REQUEST_TIMEOUT,
        **kwargs,
    )
    if resp.status_code >= 400:
        # Lanza con status + status + reason para facilitar el diagnóstico.
        raise requests.HTTPError(
            f"WooCommerce API {resp.status_code} {resp.reason} en {method} {path}: "
            f"{resp.text[:500]}",
            response=resp,
        )
    time.sleep(RATE_LIMIT_SLEEP)
    if resp.status_code == 204 or not resp.content:
        return {}
    return resp.json()


def find_product_by_sku(sku, apply_mode):
    """Busca un producto existente por SKU. Los GET se ejecutan siempre."""
    results = wc_request(
        "GET", "products", apply_mode, params={"sku": sku, "per_page": 100}
    )
    if isinstance(results, list) and results:
        # WooCommerce filtra por SKU exacto; devolvemos el primero.
        return results[0]
    return None


_category_cache = {}


def get_or_create_category(name, apply_mode):
    """Resuelve el id de categoría por nombre, creándola si hace falta."""
    if not name:
        return None
    name = name.strip()
    if name in _category_cache:
        return _category_cache[name]

    existing = wc_request(
        "GET", "products/categories", apply_mode, params={"search": name, "per_page": 100}
    )
    if isinstance(existing, list):
        for c in existing:
            if str(c.get("name", "")).strip().lower() == name.lower():
                _category_cache[name] = c["id"]
                return c["id"]

    created = wc_request(
        "POST", "products/categories", apply_mode, json={"name": name}
    )
    cat_id = created.get("id") if isinstance(created, dict) else None
    _category_cache[name] = cat_id
    return cat_id


# ------------------------------------------------------------------
# Construcción del payload
# ------------------------------------------------------------------
def _cell(row, key, default=""):
    val = row.get(key, default)
    if val is None or (isinstance(val, float) and pd.isna(val)):
        return default
    return val


def _bool_cell(row, key):
    return str(_cell(row, key, "")).strip().upper() in ("TRUE", "1", "SI", "SÍ", "YES", "X")


def build_payload(row, market_filter=None):
    """Traduce una fila del catálogo SATURNA a un payload de producto WooCommerce."""
    sku = str(_cell(row, "SKU")).strip()
    if not sku or sku.lower() == "nan":
        return None

    name = str(_cell(row, "Nombre ES") or _cell(row, "Nombre EN") or sku).strip()
    price_usd = _cell(row, "Precio USD", "")
    stock = _cell(row, "Stock", "")
    desc_long = str(_cell(row, "Descripción larga (ES)", ""))
    desc_short = str(_cell(row, "Descripción corta (FR)", ""))
    category = str(_cell(row, "Categoría", "")).strip() or "Sin categoría"
    color = str(_cell(row, "Color", "")).strip()
    talla = str(_cell(row, "Talla", "")).strip()
    material = str(_cell(row, "Material", "")).strip()
    image_url = str(_cell(row, "URL Imagen 1", "")).strip()
    status = "publish" if str(_cell(row, "Estado", "")).strip().lower() == "publicado" else "draft"
    featured = _bool_cell(row, "Destacado")

    # Flags de mercado por columna del Excel.
    market_flags = {
        mk: _bool_cell(row, cfg["excel_col"]) for mk, cfg in MARKET_COLUMN_MAP.items()
    }
    if market_filter and not market_flags.get(market_filter, False):
        return None

    attributes = []
    if color:
        attributes.append({"name": "Color", "options": [color], "visible": True})
    if talla:
        attributes.append(
            {"name": "Talla", "options": [t.strip() for t in talla.split(",") if t.strip()], "visible": True}
        )
    if material:
        attributes.append({"name": "Material", "options": [material], "visible": True})

    meta_data = [
        {"key": cfg["meta_key"], "value": market_flags[mk]}
        for mk, cfg in MARKET_COLUMN_MAP.items()
    ]
    # Precios regionales por mercado (si la columna existe y trae valor).
    for mk, cfg in MARKET_PRICE_META.items():
        price_val = _cell(row, cfg["excel_col"], "")
        if price_val != "":
            meta_data.append({"key": cfg["meta_key"], "value": price_val})

    payload = {
        "name": name,
        "sku": sku,
        "type": "simple",
        "regular_price": str(price_usd) if price_usd != "" else "0",
        "description": desc_long,
        "short_description": desc_short,
        "manage_stock": True,
        "stock_quantity": int(float(stock)) if str(stock).strip() not in ("", "nan") else 0,
        "status": status,
        "featured": featured,
        "categories": [{"name": category}],
        "attributes": attributes,
        "images": [{"src": image_url}] if image_url else [],
        "meta_data": meta_data,
    }
    return payload


# ------------------------------------------------------------------
# Sincronización por fila
# ------------------------------------------------------------------
def sync_row(row, apply_mode, market_filter):
    sku = str(_cell(row, "SKU")).strip()
    payload = build_payload(row, market_filter)
    if payload is None:
        log.info("SKIP  %-16s (no destinado al mercado '%s')", sku, market_filter or "todos")
        return "skipped"

    cat_name = payload["categories"][0]["name"]
    cat_id = get_or_create_category(cat_name, apply_mode)
    if cat_id:
        payload["categories"] = [{"id": cat_id}]

    existing = find_product_by_sku(sku, apply_mode)
    if existing:
        pid = existing.get("id")
        wc_request("PUT", f"products/{pid}", apply_mode, json=payload)
        log.info("UPDATE %-16s -> product_id=%s", sku, pid)
        return "updated"
    else:
        created = wc_request("POST", "products", apply_mode, json=payload)
        pid = created.get("id", "?") if isinstance(created, dict) else "?"
        log.info("CREATE %-16s -> product_id=%s", sku, pid)
        return "created"


# ------------------------------------------------------------------
# Validación del catálogo
# ------------------------------------------------------------------
def validate_columns(df):
    """Valida que el catálogo tenga las columnas obligatorias y avisa de las
    recomendadas que falten. Devuelve True si puede continuar."""
    columns = set(df.columns.astype(str))
    missing_required = [c for c in REQUIRED_COLUMNS if c not in columns]
    if missing_required:
        log.error("Faltan columnas obligatorias: %s", ", ".join(missing_required))
        return False

    missing_recommended = [c for c in RECOMMENDED_COLUMNS if c not in columns]
    if missing_recommended:
        log.warning(
            "Columnas recomendadas ausentes (se usarán valores por defecto): %s",
            ", ".join(missing_recommended),
        )
    return True


def confirm_apply(xlsx_path, market_filter, row_count):
    """Confirmación interactiva explícita antes de cualquier escritura real."""
    log.warning(
        "MODO APLICACIÓN ACTIVADO — se crearán/actualizarán productos reales en:"
    )
    log.warning("  tienda: %s", WC_STORE_URL)
    log.warning("  archivo: %s", xlsx_path)
    log.warning("  mercado: %s", market_filter or "todos")
    log.warning("  filas a procesar: %d", row_count)
    prompt = "¿Ejecutar escrituras reales? Escribe 'SI, APLICAR' para continuar: "
    try:
        answer = input(prompt)
    except EOFError:
        answer = ""
    if answer.strip().upper() != "SI, APLICAR":
        log.info("Operación cancelada por el usuario. Ningún cambio realizado.")
        return False
    return True


# ------------------------------------------------------------------
# Entrada principal
# ------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(
        description="Sincroniza SATURNA_PRODUCTS.xlsx con WooCommerce (SKU como clave única)."
    )
    parser.add_argument("xlsx_path", help="Ruta al archivo SATURNA_PRODUCTS.xlsx")
    parser.add_argument(
        "--sheet",
        default=DEFAULT_SHEET,
        help=f'Nombre de la hoja del catálogo (por defecto "{DEFAULT_SHEET}").',
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help=(
            "Ejecuta escrituras reales (crea/actualiza productos). "
            "Sin esta bandera el script se ejecuta en modo dry-run (simulación)."
        ),
    )
    parser.add_argument(
        "--market",
        choices=list(MARKET_COLUMN_MAP.keys()),
        default=None,
        help="Sincronizar solo los productos activos para este mercado.",
    )
    parser.add_argument(
        "--yes",
        action="store_true",
        help="Omite la confirmación interactiva (uso en CI; solo con --apply).",
    )
    args = parser.parse_args()

    # En modo apply se exigen credenciales reales.
    if args.apply and not credentials_configured():
        log.error(
            "Para --apply configura WC_STORE_URL, WC_CONSUMER_KEY y "
            "WC_CONSUMER_SECRET (variables de entorno). Sin credenciales reales "
            "no se puede escribir en la tienda."
        )
        sys.exit(1)

    # En modo dry-run las GET también necesitan credenciales para buscar SKU
    # existentes; si faltan, avisamos pero permitimos continuar en simulación
    # pura (repliegue seguro: no toca la tienda).
    if not args.apply and not credentials_configured():
        log.warning(
            "Credenciales WooCommerce no configuradas — dry-run sin acceso a la "
            "tienda (no se comprobarán SKU existentes ni categorías reales)."
        )

    if not os.path.exists(args.xlsx_path):
        log.error("No se encuentra el archivo: %s", args.xlsx_path)
        sys.exit(1)

    try:
        df = pd.read_excel(args.xlsx_path, sheet_name=args.sheet)
    except ValueError as exc:
        log.error("No se pudo leer la hoja '%s': %s", args.sheet, exc)
        sys.exit(1)
    except Exception as exc:
        log.error("Error al leer el Excel: %s", exc)
        sys.exit(1)

    df = df.dropna(subset=["SKU"])
    if df.empty:
        log.error("El catálogo no contiene filas con SKU válido.")
        sys.exit(1)

    if not validate_columns(df):
        sys.exit(1)

    mode_label = "APPLY (escrituras reales)" if args.apply else "DRY-RUN (simulación)"
    log.info(
        "Cargadas %d filas de '%s' (mercado=%s, modo=%s)",
        len(df),
        args.sheet,
        args.market or "todos",
        mode_label,
    )

    if args.apply and not args.yes:
        if not confirm_apply(args.xlsx_path, args.market, len(df)):
            sys.exit(0)

    summary = {"created": 0, "updated": 0, "skipped": 0, "errors": 0}
    for _, row in df.iterrows():
        sku = str(_cell(row, "SKU")).strip()
        try:
            result = sync_row(row, args.apply, args.market)
            summary[result] = summary.get(result, 0) + 1
        except requests.HTTPError as exc:
            log.error("Fallo HTTP en SKU %s: %s", sku, exc)
            summary["errors"] += 1
        except Exception as exc:
            log.error("Error inesperado en SKU %s: %s", sku, exc)
            summary["errors"] += 1

    log.info(
        "Sincronización terminada — creados=%d, actualizados=%d, omitidos=%d, errores=%d",
        summary["created"],
        summary["updated"],
        summary["skipped"],
        summary["errors"],
    )

    if summary["errors"] > 0:
        sys.exit(2)


if __name__ == "__main__":
    main()
