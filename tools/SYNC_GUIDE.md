# SATURNA — Guía de sincronización de catálogo con WooCommerce

Esta herramienta lee el catálogo `SATURNA_PRODUCTS.xlsx` (hoja
`01-Catalogo`) y crea o actualiza los productos en una tienda
WooCommerce vía REST API, usando el **SKU** como identificador único.

> El script **no se ejecuta desde el sitio web ni desde el navegador**.
> Corre desde tu máquina o servidor, con acceso a internet y a la tienda
> real. El panel `/admin/sync` del sitio solo muestra el **estado de
> configuración** y las instrucciones — nunca expone las claves API.

---

## 1. Requisitos

1. Python 3.9 o superior.
2. Un sitio WordPress con WooCommerce activo y accesible por HTTPS.
3. Claves API REST de WooCommerce con permisos de **Lectura/Escritura**:
   `WooCommerce → Ajustes → Avanzado → REST API → Agregar clave`.
4. Dependencias de Python:

   ```bash
   pip install -r requirements.txt
   ```

---

## 2. Configurar las claves (variables de entorno)

**Nunca escribas las claves en el código ni las subas a un repositorio.**
Usa variables de entorno:

```bash
export WC_STORE_URL="https://tu-tienda-saturna.com"
export WC_CONSUMER_KEY="ck_xxxxxxxx"
export WC_CONSUMER_SECRET="cs_xxxxxxxx"
# Opcional — versión de la API (por defecto wc/v3):
export WC_API_VERSION="wc/v3"
```

En el servidor del sitio, las mismas claves se definen en
`apps/api/.env` para que el panel de administración pueda informar si la
integración está configurada (sin exponer los secretos al navegador):

```env
WC_STORE_URL=https://tu-tienda-saturna.com
WC_CONSUMER_KEY=ck_xxxxxxxx
WC_CONSUMER_SECRET=cs_xxxxxxxx
WC_API_VERSION=wc/v3
```

---

## 3. Formato del catálogo Excel

Hoja: **`01-Catalogo`** (puedes indicar otra con `--sheet`).

| Columna                   | Obligatoria | Descripción                                              |
| ------------------------- | ----------- | -------------------------------------------------------- |
| `SKU`                     | Sí          | Identificador único del producto (clave de upsert).      |
| `Nombre ES` / `Nombre EN` | Recomendada | Nombre del producto (ES tiene prioridad).                |
| `Precio USD`              | Recomendada | Precio base en USD (precio regular de WooCommerce).      |
| `Stock`                   | Recomendada | Cantidad en stock (entero).                              |
| `Descripción larga (ES)`  | Recomendada | Descripción larga.                                       |
| `Descripción corta (FR)`  | Recomendada | Descripción corta.                                       |
| `Categoría`               | Recomendada | Categoría (se crea si no existe).                        |
| `Color` / `Talla` / `Material` | Recomendada | Atributos del producto.                             |
| `URL Imagen 1`            | Recomendada | URL de la imagen principal.                              |
| `Estado`                  | Recomendada | `publicado` → `publish`; cualquier otro valor → `draft`. |
| `Destacado`               | Recomendada | `TRUE` para producto destacado.                          |
| `USA` / `Colombia` / `China` / `Hong Kong` | Recomendada | `TRUE` si la pieza está activa en ese mercado. |
| `Precio COP` / `Precio CNY` / `Precio HKD` | Recomendada | Precio regional por mercado (metadatos).      |

Si faltan columnas recomendadas, el script avisa y usa valores por
defecto (repliegue seguro). Si falta `SKU`, se aborta.

---

## 4. Mapeo de mercados SATURNA

El mapeo coincide con el motor Geo-Market del sitio
(`CurrencyContext`):

| Mercado     | Columna Excel | Moneda | Meta key WooCommerce     |
| ----------- | ------------- | ------ | ------------------------ |
| USA         | `USA`         | USD    | `saturna_market_us`      |
| Colombia    | `Colombia`    | COP    | `saturna_market_co`      |
| China       | `China`       | CNY    | `saturna_market_cn`      |
| Hong Kong   | `Hong Kong`   | HKD    | `saturna_market_hk`      |

Precios regionales (metadatos): `saturna_price_usd`, `saturna_price_cop`,
`saturna_price_cny`, `saturna_price_hkd`.

---

## 5. Uso

### 5.1 Simulación (dry-run) — por defecto

```bash
python saturna_woocommerce_sync.py SATURNA_PRODUCTS.xlsx
```

No crea ni modifica nada. Los `GET` (búsqueda de SKU y categorías
existentes) sí se ejecutan si hay credenciales, para mostrar un plan
realista. Sin credenciales, funciona como simulación pura.

### 5.2 Solo un mercado

```bash
python saturna_woocommerce_sync.py SATURNA_PRODUCTS.xlsx --market colombia
```

Sincroniza únicamente las piezas con `Colombia = TRUE`.

### 5.3 Escrituras reales (apply)

```bash
python saturna_woocommerce_sync.py SATURNA_PRODUCTS.xlsx --apply
```

Pide confirmación interactiva (`SI, APLICAR`) antes de escribir. Para
entornos no interactivos (CI), usa `--yes` **junto con** `--apply`:

```bash
python saturna_woocommerce_sync.py SATURNA_PRODUCTS.xlsx --apply --yes
```

### 5.4 Otra hoja del Excel

```bash
python saturna_woocommerce_sync.py SATURNA_PRODUCTS.xlsx --sheet "02-Otra"
```

---

## 6. Reglas de seguridad

- **Dry-run por defecto**: sin `--apply` no hay escrituras.
- **Confirmación obligatoria**: con `--apply` se exige `SI, APLICAR`
  (salvo `--yes` para CI).
- **Credenciales por entorno**: nunca en el código ni en el navegador.
- **Upsert por SKU**: si el SKU existe, se actualiza; si no, se crea.
- **Errores por fila**: una fila que falla no detiene el resto; al final
  se reporta el conteo y el script termina con código `2` si hubo
  errores.

---

## 7. Códigos de salida

- `0` — terminado sin errores (o cancelado por el usuario).
- `1` — error de configuración o de entrada (sin credenciales, archivo
  o columnas inválidas).
- `2` — la sincronización terminó pero alguna fila falló.
