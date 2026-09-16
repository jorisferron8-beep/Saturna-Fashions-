import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Settings2,
    RefreshCw,
    ShieldCheck,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Database,
    KeyRound,
    Terminal,
    FileSpreadsheet,
    Globe2,
} from 'lucide-react';
import { MARKETS, MarketSelector } from '@/context/CurrencyContext';
import { SATURNA_LOGO } from '@/lib/brand';
import LaceDivider from '@/components/LaceDivider';
import apiServerClient from '@/lib/apiServerClient';

/**
 * SATURNA — Panel de sincronización de catálogo con WooCommerce.
 *
 * Este panel NO ejecuta la sincronización desde el navegador (las claves API
 * nunca se exponen al cliente). Muestra el estado de configuración de la
 * integración (vía la ruta Express /woocommerce/status, que lee las variables
 * de entorno sin revelarlas), documenta el flujo de trabajo seguro
 * (dry-run primero, --apply con confirmación) y detalla el mapeo de mercados
 * y las columnas del catálogo Excel.
 *
 * Estado de repliegue: si la API no responde o WooCommerce no está
 * configurado, se muestra un mensaje claro y la boutique sigue operativa.
 */
const WooSyncAdminPage = () => {
    const [status, setStatus] = useState(null); // { configured, storeUrl, apiVersion }
    const [loading, setLoading] = useState(true);
    const [unavailable, setUnavailable] = useState(false);

    const fetchStatus = async () => {
        setLoading(true);
        setUnavailable(false);
        try {
            const res = await apiServerClient.fetch('/woocommerce/status');
            if (res.status === 503) {
                // No configurado — estado de repliegue válido, no un error.
                const data = await res.json().catch(() => ({}));
                setStatus({ configured: false, storeUrl: null, apiVersion: data.apiVersion || 'wc/v3' });
            } else if (res.ok) {
                setStatus(await res.json());
            } else {
                setStatus(null);
                setUnavailable(true);
            }
        } catch {
            setStatus(null);
            setUnavailable(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const configured = status?.configured === true;

    return (
        <div className="min-h-screen bg-ink text-paper">
            <Helmet>
                <title>SATURNA · Sync WooCommerce — Administración</title>
                <meta
                    name="description"
                    content="Panel de sincronización de catálogo SATURNA con WooCommerce: estado, guía de uso y mapeo de mercados."
                />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* header */}
            <header className="border-b border-border bg-charcoal/60 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
                    <Link to="/" className="flex items-center gap-3 text-silver transition-colors hover:text-paper">
                        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                        <span className="text-[10px] font-medium uppercase tracking-[0.3em]">Volver al sitio</span>
                    </Link>
                    <img src={SATURNA_LOGO} alt="SATURNA" className="h-7 md:h-9" />
                    <MarketSelector />
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
                {/* title */}
                <div className="mb-12">
                    <p className="mb-3 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.4em] text-violet-bright">
                        <Settings2 className="h-4 w-4" strokeWidth={1.5} />
                        Sincronización de catálogo
                    </p>
                    <h1 className="font-display text-4xl font-bold uppercase leading-[0.9] tracking-tight text-paper md:text-6xl">
                        Sync <span className="text-violet-bright">WooCommerce</span>
                    </h1>
                    <p className="mt-5 max-w-2xl text-sm font-light leading-relaxed text-smoke">
                        Herramienta de sincronización del catálogo SATURNA con una tienda WooCommerce vía
                        REST API, usando el SKU como identificador único. La sincronización se ejecuta
                        desde tu máquina o servidor — nunca desde el navegador — para mantener las claves
                        API fuera del cliente. Este panel muestra el estado de configuración y la guía de
                        uso; la boutique permanece operativa en todo momento.
                    </p>
                </div>

                {/* status strip */}
                <div className="mb-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatusCard
                        icon={configured ? CheckCircle2 : XCircle}
                        label="Estado de la integración"
                        value={loading ? 'Comprobando…' : configured ? 'Configurada' : unavailable ? 'No disponible' : 'No configurada'}
                        tone={configured ? 'ok' : unavailable ? 'warn' : 'idle'}
                    />
                    <StatusCard
                        icon={Globe2}
                        label="Tienda WooCommerce"
                        value={status?.storeUrl || (unavailable ? '—' : 'Pendiente')}
                        tone={configured ? 'ok' : 'idle'}
                    />
                    <StatusCard
                        icon={Database}
                        label="Versión API"
                        value={status?.apiVersion || 'wc/v3'}
                        tone="idle"
                    />
                    <StatusCard
                        icon={KeyRound}
                        label="Claves API"
                        value={configured ? 'Presentes (ocultas)' : 'Pendientes'}
                        tone={configured ? 'ok' : 'idle'}
                    />
                </div>

                {/* configuration state */}
                <section className="mb-14">
                    {loading ? (
                        <StatePanel
                            icon={RefreshCw}
                            tone="idle"
                            title="Comprobando configuración…"
                            body="Consultando el estado de la integración con WooCommerce."
                        />
                    ) : configured ? (
                        <StatePanel
                            icon={ShieldCheck}
                            tone="ok"
                            title="WooCommerce está configurado"
                            body={`La integración apunta a ${status?.storeUrl}. Las claves API se leen desde el servidor (apps/api/.env) y nunca se exponen en el navegador. Ejecuta la sincronización desde tu máquina con el script tools/saturna_woocommerce_sync.py — empieza siempre con un dry-run.`}
                            action={
                                <button
                                    onClick={fetchStatus}
                                    className="inline-flex items-center gap-2 border border-border px-4 py-2 text-[10px] font-medium uppercase tracking-[0.25em] text-silver transition-colors hover:border-violet-bright hover:text-paper"
                                >
                                    <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.5} /> Actualizar estado
                                </button>
                            }
                        />
                    ) : unavailable ? (
                        <StatePanel
                            icon={AlertTriangle}
                            tone="warn"
                            title="Estado no disponible"
                            body="No se pudo contactar con el servicio de estado. La boutique sigue operativa. Reintenta más tarde o verifica que el servidor API esté activo. No se ha realizado ninguna sincronización."
                            action={
                                <button
                                    onClick={fetchStatus}
                                    className="inline-flex items-center gap-2 border border-border px-4 py-2 text-[10px] font-medium uppercase tracking-[0.25em] text-silver transition-colors hover:border-violet-bright hover:text-paper"
                                >
                                    <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.5} /> Reintentar
                                </button>
                            }
                        />
                    ) : (
                        <StatePanel
                            icon={KeyRound}
                            tone="idle"
                            title="WooCommerce aún no está configurado"
                            body="Añade las claves WC_STORE_URL, WC_CONSUMER_KEY y WC_CONSUMER_SECRET en apps/api/.env (servidor) y, en tu máquina, expórtalas como variables de entorno para ejecutar el script. Mientras tanto, la boutique sigue funcionando con normalidad — este estado es un repliegue seguro, no un error."
                            action={
                                <button
                                    onClick={fetchStatus}
                                    className="inline-flex items-center gap-2 border border-border px-4 py-2 text-[10px] font-medium uppercase tracking-[0.25em] text-silver transition-colors hover:border-violet-bright hover:text-paper"
                                >
                                    <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.5} /> Reintentar
                                </button>
                            }
                        />
                    )}
                </section>

                <LaceDivider />

                {/* workflow */}
                <section className="mt-14">
                    <SectionTitle
                        icon={ShieldCheck}
                        title="Flujo de trabajo seguro"
                        subtitle="Dry-run por defecto · escritura solo con --apply y confirmación"
                    />
                    <div className="mt-6 grid gap-5 md:grid-cols-3">
                        <StepCard
                            n="01"
                            title="Simula primero"
                            body="Ejecuta el script sin --apply. No crea ni modifica productos; solo muestra el plan (GET de SKU y categorías si hay credenciales)."
                        />
                        <StepCard
                            n="02"
                            title="Revisa el plan"
                            body="Confirma los productos a crear y actualizar. Filtra por mercado con --market (usa, colombia, china, hongkong)."
                        />
                        <StepCard
                            n="03"
                            title="Aplica con confirmación"
                            body="Añade --apply. El script pide 'SI, APLICAR' antes de escribir. Usa --yes solo en CI, siempre junto a --apply."
                        />
                    </div>
                </section>

                {/* market mapping */}
                <section className="mt-14">
                    <SectionTitle
                        icon={Globe2}
                        title="Mapeo de mercados SATURNA"
                        subtitle="Coincide con el motor Geo-Market del sitio"
                    />
                    <div className="mt-6 overflow-x-auto border border-border">
                        <table className="w-full min-w-[640px] text-left text-sm">
                            <thead className="bg-charcoal text-[10px] font-medium uppercase tracking-[0.2em] text-smoke">
                                <tr>
                                    <th className="px-4 py-3">Mercado</th>
                                    <th className="px-4 py-3">Moneda</th>
                                    <th className="px-4 py-3">Columna Excel</th>
                                    <th className="px-4 py-3">Meta key WooCommerce</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {MARKET_MAPPING.map((m) => (
                                    <tr key={m.id} className="transition-colors hover:bg-charcoal/50">
                                        <td className="px-4 py-3">
                                            <span className="font-display font-semibold uppercase tracking-tight text-paper">
                                                {m.flag} {m.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-silver">{m.currency}</td>
                                        <td className="px-4 py-3 text-silver">{m.excelCol}</td>
                                        <td className="px-4 py-3 font-mono text-[12px] text-violet-bright">{m.metaKey}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-3 text-[10px] font-light italic leading-relaxed text-smoke/80">
                        Precios regionales (metadatos): saturna_price_usd, saturna_price_cop,
                        saturna_price_cny, saturna_price_hkd.
                    </p>
                </section>

                {/* excel columns */}
                <section className="mt-14 grid gap-5 lg:grid-cols-2">
                    <div className="border border-border bg-charcoal p-7">
                        <SectionTitle icon={FileSpreadsheet} title="Columnas del catálogo" subtitle="Hoja 01-Catalogo" />
                        <ul className="mt-5 space-y-2 text-sm font-light leading-relaxed text-silver">
                            <li><span className="text-violet-bright">SKU</span> — obligatoria, clave única de upsert.</li>
                            <li>Nombre ES / Nombre EN, Precio USD, Stock, Categoría, Color, Talla, Material.</li>
                            <li>Descripción larga (ES), Descripción corta (FR), URL Imagen 1.</li>
                            <li>Estado (publicado → publish), Destacado (TRUE).</li>
                            <li>USA, Colombia, China, Hong Kong (TRUE si activo en ese mercado).</li>
                            <li>Precio COP, Precio CNY, Precio HKD (precios regionales).</li>
                        </ul>
                        <p className="mt-4 text-[10px] font-light italic leading-relaxed text-smoke/80">
                            Si faltan columnas recomendadas, el script avisa y usa valores por defecto
                            (repliegue seguro). Si falta SKU, se aborta.
                        </p>
                    </div>

                    <div className="border border-border bg-charcoal p-7">
                        <SectionTitle icon={Terminal} title="Comandos de uso" subtitle="Desde tu máquina o servidor" />
                        <div className="mt-5 space-y-4 font-mono text-[12px] leading-relaxed text-silver">
                            <CodeBlock
                                label="Instalar dependencias"
                                lines={['pip install -r requirements.txt']}
                            />
                            <CodeBlock
                                label="Variables de entorno"
                                lines={[
                                    'export WC_STORE_URL="https://tu-tienda.com"',
                                    'export WC_CONSUMER_KEY="ck_..."',
                                    'export WC_CONSUMER_SECRET="cs_..."',
                                ]}
                            />
                            <CodeBlock
                                label="Dry-run (por defecto)"
                                lines={['python saturna_woocommerce_sync.py SATURNA_PRODUCTS.xlsx']}
                            />
                            <CodeBlock
                                label="Escritura real (con confirmación)"
                                lines={['python saturna_woocommerce_sync.py SATURNA_PRODUCTS.xlsx --apply']}
                            />
                        </div>
                    </div>
                </section>

                {/* security */}
                <section className="mt-14">
                    <SectionTitle icon={KeyRound} title="Seguridad" subtitle="Las claves nunca llegan al navegador" />
                    <ul className="mt-6 grid gap-4 md:grid-cols-2">
                        <SecurityItem text="Las claves API se leen de variables de entorno en el servidor (apps/api/.env), nunca del código ni del navegador." />
                        <SecurityItem text="El panel solo consulta el estado (configurado / no configurado); no expone ningún secreto." />
                        <SecurityItem text="Dry-run por defecto: sin --apply no se crea ni modifica ningún producto." />
                        <SecurityItem text="Escritura real solo con --apply y confirmación interactiva 'SI, APLICAR' (o --yes en CI)." />
                        <SecurityItem text="Upsert por SKU: si el SKU existe se actualiza, si no se crea." />
                        <SecurityItem text="Errores por fila: una fila que falla no detiene el resto; se reporta al final." />
                    </ul>
                </section>

                <LaceDivider />

                <p className="mt-10 text-center text-[10px] uppercase tracking-[0.3em] text-smoke">
                    SATURNA Sync WooCommerce · © 2026 Swu-vision CORPORATION
                </p>
            </main>
        </div>
    );
};

/* ------------------------------- data ------------------------------- */

const MARKET_MAPPING = [
    { id: 'US', flag: '🇺🇸', label: 'USA', currency: 'USD', excelCol: 'USA', metaKey: 'saturna_market_us' },
    { id: 'CO', flag: '🇨🇴', label: 'Colombia', currency: 'COP', excelCol: 'Colombia', metaKey: 'saturna_market_co' },
    { id: 'CN', flag: '🇨🇳', label: 'China', currency: 'CNY', excelCol: 'China', metaKey: 'saturna_market_cn' },
    { id: 'HK', flag: '🇭🇰', label: 'Hong Kong', currency: 'HKD', excelCol: 'Hong Kong', metaKey: 'saturna_market_hk' },
];

/* ------------------------------- helpers ------------------------------- */

function StatusCard({ icon: Icon, label, value, tone = 'idle' }) {
    const toneClass =
        tone === 'ok'
            ? 'text-violet-bright'
            : tone === 'warn'
                ? 'text-amber-400'
                : 'text-smoke';
    return (
        <div className="border border-border bg-charcoal p-5">
            <div className="mb-3 flex items-center gap-2">
                <Icon className={`h-4 w-4 ${toneClass}`} strokeWidth={1.5} />
                <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-smoke">{label}</span>
            </div>
            <p className="font-display text-lg font-semibold uppercase tracking-tight text-paper">{value}</p>
        </div>
    );
}

function StatePanel({ icon: Icon, tone, title, body, action }) {
    const border =
        tone === 'ok'
            ? 'border-violet-bright/50'
            : tone === 'warn'
                ? 'border-amber-500/40'
                : 'border-border';
    const iconColor =
        tone === 'ok'
            ? 'text-violet-bright'
            : tone === 'warn'
                ? 'text-amber-400'
                : 'text-smoke';
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`flex flex-col gap-5 border ${border} bg-charcoal p-7 md:flex-row md:items-start md:justify-between`}
        >
            <div className="flex items-start gap-4">
                <Icon className={`mt-0.5 h-6 w-6 shrink-0 ${iconColor}`} strokeWidth={1.5} />
                <div className="max-w-2xl">
                    <h3 className="font-display text-xl font-bold uppercase tracking-tight text-paper">{title}</h3>
                    <p className="mt-2 text-sm font-light leading-relaxed text-silver">{body}</p>
                </div>
            </div>
            {action ? <div className="shrink-0">{action}</div> : null}
        </motion.div>
    );
}

function SectionTitle({ icon: Icon, title, subtitle }) {
    return (
        <div>
            <div className="flex items-center gap-2 text-violet-bright">
                <Icon className="h-4 w-4" strokeWidth={1.5} />
                <h2 className="font-display text-xl font-bold uppercase tracking-tight text-paper">{title}</h2>
            </div>
            {subtitle && <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.25em] text-smoke">{subtitle}</p>}
        </div>
    );
}

function StepCard({ n, title, body }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="border border-border bg-charcoal p-6"
        >
            <span className="font-display text-3xl font-bold text-violet-bright/40">{n}</span>
            <h3 className="mt-3 font-display text-lg font-semibold uppercase tracking-tight text-paper">{title}</h3>
            <p className="mt-2 text-sm font-light leading-relaxed text-silver">{body}</p>
        </motion.div>
    );
}

function CodeBlock({ label, lines }) {
    return (
        <div>
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.25em] text-smoke">{label}</p>
            <pre className="overflow-x-auto border border-border bg-ink p-3 text-[12px] text-silver">
                {lines.join('\n')}
            </pre>
        </div>
    );
}

function SecurityItem({ text }) {
    return (
        <li className="flex gap-3 border border-border bg-charcoal p-4">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-violet-bright" strokeWidth={1.5} />
            <span className="text-sm font-light leading-relaxed text-silver">{text}</span>
        </li>
    );
}

export default WooSyncAdminPage;
