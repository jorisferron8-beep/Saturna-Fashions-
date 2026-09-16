import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Globe2, ShieldCheck, Truck, CreditCard, Coins, MapPin, ArrowLeft, Settings2 } from 'lucide-react';
import { MARKETS, useGeoMarket, MarketSelector } from '@/context/CurrencyContext';
import { SATURNA_LOGO } from '@/lib/brand';
import LaceDivider from '@/components/LaceDivider';

/**
 * SATURNA Geo-Market Engine — administration screen.
 * Mirrors the WooCommerce plugin's admin panel: market configuration, regional
 * pricing modifiers, payment & shipping rules, legal jurisdictions, product
 * availability rules and geo-detection status. Configuration is read from the
 * live engine; the active market can be switched here to preview behaviour.
 */
const GeoMarketAdminPage = () => {
    const { market, marketId, setMarket, isAvailableInMarket, regionalUsdCents, formatFromUsdCents } = useGeoMarket();

    const detectedTz = useMemo(() => {
        try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone || '—';
        } catch {
            return '—';
        }
    }, []);

    const detectedLang = useMemo(() => {
        try {
            return (typeof navigator !== 'undefined' && navigator.language) || '—';
        } catch {
            return '—';
        }
    }, []);

    // Demo: how a $120.00 USD catalogue price renders across markets.
    const sampleUsdCents = 12000;

    return (
        <div className="min-h-screen bg-ink text-paper">
            <Helmet>
                <title>SATURNA · Geo-Market Engine — Administración</title>
                <meta name="description" content="Panel de administración del motor multi-mercados SATURNA: USA, Colombia, China y Hong Kong." />
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
                        Motor multi-mercados
                    </p>
                    <h1 className="font-display text-4xl font-bold uppercase leading-[0.9] tracking-tight text-paper md:text-6xl">
                        Geo-Market <span className="text-violet-bright">Engine</span>
                    </h1>
                    <p className="mt-5 max-w-2xl text-sm font-light leading-relaxed text-smoke">
                        Configuración centralizada de los mercados SATURNA — Estados Unidos, Colombia, China y
                        Hong Kong. Detección geográfica automática, selección manual, precios regionales,
                        disponibilidad por mercado, medios de pago, reglas de envío y jurisdicción legal.
                        Los impuestos, las pasarelas de pago y las tarifas de envío se rigen por la
                        configuración de la tienda (WooCommerce); este motor no inventa tasas legales.
                    </p>
                </div>

                {/* status strip */}
                <div className="mb-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatusCard icon={MapPin} label="Mercado activo" value={`${market.flag} ${market.label}`} />
                    <StatusCard icon={Coins} label="Moneda" value={`${market.currency.code} · ${market.currency.label}`} />
                    <StatusCard icon={Globe2} label="Zona horaria detectada" value={detectedTz} />
                    <StatusCard icon={Globe2} label="Idioma del navegador" value={detectedLang} />
                </div>

                <LaceDivider />

                {/* markets table */}
                <section className="mt-14">
                    <SectionTitle icon={Globe2} title="Mercados configurados" subtitle="4 territorios · selección manual o por detección geo" />
                    <div className="overflow-x-auto border border-border">
                        <table className="w-full min-w-[720px] text-left text-sm">
                            <thead className="bg-charcoal text-[10px] font-medium uppercase tracking-[0.2em] text-smoke">
                                <tr>
                                    <th className="px-4 py-3">Mercado</th>
                                    <th className="px-4 py-3">Moneda</th>
                                    <th className="px-4 py-3">Tasa USD</th>
                                    <th className="px-4 py-3">Modificador</th>
                                    <th className="px-4 py-3">Muestra $120</th>
                                    <th className="px-4 py-3">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {MARKETS.map((m) => (
                                    <tr
                                        key={m.id}
                                        className={`transition-colors ${m.id === marketId ? 'bg-violet/10' : 'hover:bg-charcoal/50'}`}
                                    >
                                        <td className="px-4 py-3">
                                            <span className="font-display font-semibold uppercase tracking-tight text-paper">
                                                {m.flag} {m.label}
                                            </span>
                                            <span className="block text-[10px] uppercase tracking-[0.2em] text-smoke">{m.region}</span>
                                        </td>
                                        <td className="px-4 py-3 text-silver">{m.currency.code}</td>
                                        <td className="px-4 py-3 text-silver">{m.currency.rateFromUsd}</td>
                                        <td className="px-4 py-3 text-silver">×{m.priceModifier.toFixed(2)}</td>
                                        <td className="px-4 py-3 font-display font-semibold text-violet-bright">
                                            {formatSample(m, sampleUsdCents)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => setMarket(m.id)}
                                                disabled={m.id === marketId}
                                                className="border border-border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-silver transition-colors hover:border-violet-bright hover:text-paper disabled:opacity-40"
                                            >
                                                {m.id === marketId ? 'Activo' : 'Activar'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-3 text-[10px] font-light italic leading-relaxed text-smoke/80">
                        Modificador regional por defecto ×1.00 (paridad con el precio base USD). Los precios
                        regionales se calculan como base × modificador, convertidos a la moneda del mercado.
                        No se inventan recargos hasta que se configuren explícitamente.
                    </p>
                </section>

                {/* payment + shipping + legal per market */}
                <section className="mt-14 grid gap-5 lg:grid-cols-3">
                    <RuleCard
                        icon={CreditCard}
                        title="Medios de pago"
                        rows={MARKETS.map((m) => ({
                            label: `${m.flag} ${m.label}`,
                            value: m.paymentMethods.join(' · '),
                        }))}
                    />
                    <RuleCard
                        icon={Truck}
                        title="Reglas de envío"
                        rows={MARKETS.map((m) => ({
                            label: `${m.flag} ${m.label}`,
                            value: m.shipping,
                        }))}
                    />
                    <RuleCard
                        icon={ShieldCheck}
                        title="Jurisdicción legal"
                        rows={MARKETS.map((m) => ({
                            label: `${m.flag} ${m.label}`,
                            value: m.jurisdiction,
                        }))}
                    />
                </section>

                {/* availability + fallback */}
                <section className="mt-14 grid gap-5 lg:grid-cols-2">
                    <div className="border border-border bg-charcoal p-7">
                        <SectionTitle icon={MapPin} title="Disponibilidad por mercado" subtitle="Reglas de filtrado del catálogo" />
                        <p className="mt-4 text-sm font-light leading-relaxed text-silver">
                            Por defecto, todas las piezas del catálogo están disponibles en los cuatro mercados.
                            Un producto puede restringirse asignándole un campo <code className="text-violet-bright">markets</code>{' '}
                            (array de ids de mercado: US, CO, HK, CN). Los productos sin este campo permanecen
                            visibles en todos los mercados — estado de repli seguro.
                        </p>
                        <div className="mt-5 flex flex-wrap gap-2">
                            {MARKETS.map((m) => (
                                <span
                                    key={m.id}
                                    className="border border-border bg-ink px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-silver"
                                >
                                    {m.flag} {m.id} · {isAvailableInMarket({ markets: [m.id] }) ? 'disponible' : '—'}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="border border-border bg-charcoal p-7">
                        <SectionTitle icon={ShieldCheck} title="Estados de repli seguros" subtitle="Cuando WooCommerce no está disponible" />
                        <ul className="mt-4 space-y-3 text-sm font-light leading-relaxed text-silver">
                            <li className="flex gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-violet-bright" />
                                Si la API de la tienda no responde, el catálogo muestra un estado vacío elegante y el carrito permanece operativo.
                            </li>
                            <li className="flex gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-violet-bright" />
                                Si la detección geográfica falla, el mercado por defecto es Estados Unidos (USD).
                            </li>
                            <li className="flex gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-violet-bright" />
                                Los impuestos, pasarelas y tarifas de envío se delegan a la configuración de la tienda; el motor no los inventa.
                            </li>
                            <li className="flex gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-violet-bright" />
                                La preferencia de mercado se conserva en el navegador; el usuario puede cambiarla en cualquier momento.
                            </li>
                        </ul>
                    </div>
                </section>

                <LaceDivider />

                <p className="mt-10 text-center text-[10px] uppercase tracking-[0.3em] text-smoke">
                    SATURNA Geo-Market Engine · © 2026 Swu-vision CORPORATION
                </p>
            </main>
        </div>
    );
};

/* -------------------------------- helpers -------------------------------- */

function formatSample(market, usdCents) {
    const regional = usdCents * (market.priceModifier || 1);
    const converted = (regional / 100) * market.currency.rateFromUsd;
    const maxFrac = market.currency.code === 'COP' ? 0 : 2;
    const formatted = converted.toLocaleString(market.currency.locale, {
        minimumFractionDigits: maxFrac,
        maximumFractionDigits: maxFrac,
    });
    if (market.currency.code === 'USD') return `$${formatted}`;
    if (market.currency.code === 'COP') return `COP $${formatted}`;
    if (market.currency.code === 'HKD') return `HK$${formatted}`;
    if (market.currency.code === 'CNY') return `¥${formatted}`;
    return `${market.currency.symbol}${formatted}`;
}

function StatusCard({ icon: Icon, label, value }) {
    return (
        <div className="border border-border bg-charcoal p-5">
            <div className="mb-3 flex items-center gap-2 text-violet-bright">
                <Icon className="h-4 w-4" strokeWidth={1.5} />
                <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-smoke">{label}</span>
            </div>
            <p className="font-display text-lg font-semibold uppercase tracking-tight text-paper">{value}</p>
        </div>
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

function RuleCard({ icon: Icon, title, rows }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="border border-border bg-charcoal p-6"
        >
            <SectionTitle icon={Icon} title={title} />
            <ul className="mt-5 space-y-4">
                {rows.map((r) => (
                    <li key={r.label} className="border-l-2 border-violet/40 pl-4">
                        <p className="font-display text-sm font-semibold uppercase tracking-tight text-paper">{r.label}</p>
                        <p className="mt-1 text-[12px] font-light leading-relaxed text-silver">{r.value}</p>
                    </li>
                ))}
            </ul>
        </motion.div>
    );
}

export default GeoMarketAdminPage;
