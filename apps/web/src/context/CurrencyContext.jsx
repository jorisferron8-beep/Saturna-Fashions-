import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * SATURNA Geo-Market Engine
 * -------------------------
 * Multi-market engine for the SATURNA boutique. Each market binds together a
 * territory, its currency, regional pricing modifier, accepted payment methods,
 * shipping rules and the legal jurisdiction that governs the sale.
 *
 * Catalogue prices coming from the Hostinger Online Store API are treated as
 * USD cents (the store base currency). Regional prices are derived by applying
 * the market's `priceModifier` (defaults to 1.0 — parity — so no regional
 * surcharge is invented) and then converting to the market currency.
 *
 * Taxes, payment-gateway availability and shipping rates remain governed by
 * the store / WooCommerce configuration; this engine only exposes the
 * market-scoped rules to the UI and provides safe fallbacks when a market is
 * not fully configured.
 */

export const MARKETS = [
    {
        id: 'US',
        label: 'Estados Unidos',
        region: 'United States',
        flag: '🇺🇸',
        currency: {
            code: 'USD',
            label: 'USD',
            symbol: '$',
            locale: 'en-US',
            rateFromUsd: 1,
        },
        priceModifier: 1.0,
        paymentMethods: ['Tarjeta de crédito', 'PayPal', 'Apple Pay'],
        shipping: 'Envíos a todo Estados Unidos — 3 a 5 días hábiles.',
        shippingFreeOverUsd: 250,
        jurisdiction: 'Estados Unidos — CCPA, UCC',
        legalNote: 'Las ventas se rigen por la CCPA y el Código Comercial Uniforme (UCC).',
    },
    {
        id: 'CO',
        label: 'Colombia',
        region: 'Colombia',
        flag: '🇨🇴',
        currency: {
            code: 'COP',
            label: 'COP',
            symbol: '$',
            locale: 'es-CO',
            rateFromUsd: 4100,
        },
        priceModifier: 1.0,
        paymentMethods: ['Tarjeta de crédito', 'PSE', 'Contraentrega'],
        shipping: 'Envíos nacionales en Colombia — 2 a 4 días hábiles.',
        shippingFreeOverUsd: 150,
        jurisdiction: 'Colombia — Ley 1581 de 2012, Ley 1480 de 2011',
        legalNote: 'Datos personales conforme a la Ley 1581 de 2012 y garantías bajo la Ley 1480 de 2011.',
    },
    {
        id: 'HK',
        label: 'Hong Kong',
        region: 'Hong Kong / China',
        flag: '🇭🇰',
        currency: {
            code: 'HKD',
            label: 'HKD',
            symbol: 'HK$',
            locale: 'zh-HK',
            rateFromUsd: 7.8,
        },
        priceModifier: 1.0,
        paymentMethods: ['信用卡', 'PayPal', 'Apple Pay'],
        shipping: '香港本地配送 — 1 至 3 個工作日。',
        shippingFreeOverUsd: 200,
        jurisdiction: 'Hong Kong SAR',
        legalNote: 'Sales governed by the laws of the Hong Kong Special Administrative Region.',
    },
    {
        id: 'CN',
        label: '中国',
        region: 'China',
        flag: '🇨🇳',
        currency: {
            code: 'CNY',
            label: 'CNY',
            symbol: '¥',
            locale: 'zh-CN',
            rateFromUsd: 7.2,
        },
        priceModifier: 1.0,
        paymentMethods: ['支付宝', '微信支付', '信用卡'],
        shipping: '中国内地配送 — 3 至 7 个工作日。',
        shippingFreeOverUsd: 200,
        jurisdiction: 'China mainland',
        legalNote: '销售受中国大陆适用法律法规约束。',
    },
];

/** Backward-compatible currency list derived from the markets. */
export const CURRENCIES = MARKETS.map((m) => ({
    code: m.currency.code,
    label: m.currency.label,
    symbol: m.currency.symbol,
    locale: m.currency.locale,
    region: m.region,
    rateFromUsd: m.currency.rateFromUsd,
    flag: m.flag,
}));

const STORAGE_KEY = 'saturna-market';
// Tracks whether the stored market was chosen manually by the visitor.
// When set to 'manual', automatic (re)detection never overrides it.
const SOURCE_KEY = 'saturna-market-source';

const GeoMarketContext = createContext(null);

/**
 * Map a 2-letter ISO country code to a SATURNA market id.
 * Returns null when the country is not one of the four configured markets.
 */
function countryToMarketId(country) {
    if (!country) return null;
    const c = String(country).toUpperCase().trim();
    if (c === 'US') return 'US';
    if (c === 'CO') return 'CO';
    if (c === 'HK') return 'HK';
    if (c === 'CN') return 'CN';
    return null;
}

/**
 * Synchronous fallback detection from timezone / browser locale.
 * Used so the UI can render with a sensible market immediately, before the
 * async IP geolocation resolves. Falls back to US.
 */
function detectMarketIdFromLocale() {
    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        const lang = (typeof navigator !== 'undefined' && navigator.language) || 'en-US';
        if (/Bogota|Colombia/i.test(tz) || /^es-CO/i.test(lang)) return 'CO';
        if (/Hong_Kong|Macau/i.test(tz) || /^zh-(HK|MO|TW)/i.test(lang)) return 'HK';
        if (/Shanghai|Beijing|Chongqing|Harbin|Urumqi|China/i.test(tz) || /^zh-CN/i.test(lang)) return 'CN';
        if (/America\//i.test(tz) || /^en-US/i.test(lang)) return 'US';
    } catch {
        /* ignore */
    }
    return 'US';
}

/**
 * Async IP-based geolocation. Tries a free, key-less endpoint and resolves to
 * a market id, or null on any failure (network blocked, rate-limited, parse
 * error, timeout). The caller falls back to locale detection when null.
 */
function detectMarketIdFromIp() {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeout = controller
        ? setTimeout(() => controller.abort(), 4000)
        : null;

    return fetch('https://get.geojs.io/v1/ip/country.json', {
        signal: controller ? controller.signal : undefined,
        headers: { Accept: 'application/json' },
    })
        .then((res) => (res && res.ok ? res.json() : null))
        .then((data) => {
            const id = countryToMarketId(data && data.country);
            return id;
        })
        .catch(() => null)
        .finally(() => {
            if (timeout) clearTimeout(timeout);
        });
}

export function GeoMarketProvider({ children }) {
    // `autoDetecting` is true while the async IP lookup is in flight on a first
    // visit (no stored preference yet). Lets consumers show a subtle indicator
    // without blocking render — prices already render with the locale fallback.
    const [autoDetecting, setAutoDetecting] = useState(false);

    const [marketId, setMarketId] = useState(() => {
        if (typeof window === 'undefined') return 'US';
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved && MARKETS.some((m) => m.id === saved)) return saved;
        // No stored preference yet: start from the synchronous locale fallback
        // so the UI renders correct-ish prices immediately, then refine via IP.
        return detectMarketIdFromLocale();
    });

    // Persist the active market whenever it changes.
    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, marketId);
        } catch {
            /* ignore */
        }
    }, [marketId]);

    /**
     * First-visit automatic detection. Only runs when there is no stored
     * preference (genuine first load) — a returning visitor, or one who has
     * manually chosen a market, is never re-detected or overridden.
     */
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const saved = window.localStorage.getItem(STORAGE_KEY);
        const source = window.localStorage.getItem(SOURCE_KEY);
        if (saved && source === 'manual') return; // respect explicit choice
        if (saved) return; // already detected on a prior visit

        let cancelled = false;
        setAutoDetecting(true);
        detectMarketIdFromIp().then((id) => {
            if (cancelled) return;
            setAutoDetecting(false);
            if (id && MARKETS.some((m) => m.id === id)) {
                // Refine to the IP-detected market; mark source as auto.
                try {
                    window.localStorage.setItem(SOURCE_KEY, 'auto');
                } catch {
                    /* ignore */
                }
                setMarketId(id);
            } else {
                // IP lookup failed or returned an unmapped country: keep the
                // locale fallback already in state, and record it as auto so
                // we don't retry every visit.
                try {
                    window.localStorage.setItem(SOURCE_KEY, 'auto');
                } catch {
                    /* ignore */
                }
            }
        });

        return () => {
            cancelled = true;
        };
    }, []);

    /** Manual market switch — flagged so automatic detection never overrides it. */
    const selectMarket = useCallback((id) => {
        if (!id || !MARKETS.some((m) => m.id === id)) return;
        try {
            window.localStorage.setItem(SOURCE_KEY, 'manual');
        } catch {
            /* ignore */
        }
        setMarketId(id);
    }, []);

    const market = useMemo(() => MARKETS.find((m) => m.id === marketId) || MARKETS[0], [marketId]);
    const currency = market.currency;

    /** Regional price in USD cents after the market modifier. */
    const regionalUsdCents = useCallback(
        (usdCents) => {
            const n = Number(usdCents);
            if (n == null || Number.isNaN(n)) return 0;
            return Math.round(n * (market.priceModifier || 1));
        },
        [market],
    );

    const formatFromUsdCents = useCallback(
        (usdCents) => {
            const n = Number(usdCents);
            if (n == null || Number.isNaN(n)) return '—';
            const regional = n * (market.priceModifier || 1);
            const converted = (regional / 100) * currency.rateFromUsd;
            const maxFrac = currency.code === 'COP' ? 0 : 2;
            const formatted = converted.toLocaleString(currency.locale, {
                minimumFractionDigits: maxFrac,
                maximumFractionDigits: maxFrac,
            });
            if (currency.code === 'USD') return `$${formatted}`;
            if (currency.code === 'COP') return `COP $${formatted}`;
            if (currency.code === 'HKD') return `HK$${formatted}`;
            if (currency.code === 'CNY') return `¥${formatted}`;
            return `${currency.symbol}${formatted}`;
        },
        [currency, market],
    );

    /**
     * Product availability per market. The Hostinger catalogue does not carry
     * market tags, so by default every product is available in every market.
     * Restrict by `product.markets` (array of market ids) when present.
     */
    const isAvailableInMarket = useCallback(
        (product) => {
            if (!product) return true;
            const allowed = product.markets || product.available_markets;
            if (!allowed || !Array.isArray(allowed) || allowed.length === 0) return true;
            return allowed.includes(market.id);
        },
        [market],
    );

    /** Shipping cost in USD cents for a given subtotal (USD cents). */
    const shippingForSubtotalUsdCents = useCallback(
        (subtotalUsdCents) => {
            const free = market.shippingFreeOverUsd;
            if (free && subtotalUsdCents >= free * 100) return 0;
            // No invented carrier rate — default flat fallback shown in market config.
            return market.shippingFlatUsdCents ?? 0;
        },
        [market],
    );

    const value = useMemo(
        () => ({
            // market-scoped
            market,
            marketId,
            markets: MARKETS,
            setMarket: selectMarket,
            selectMarket,
            autoDetecting,
            isAvailableInMarket,
            shippingForSubtotalUsdCents,
            regionalUsdCents,
            // currency-scoped (backward compatible with useCurrency consumers)
            currency,
            code: currency.code,
            setCurrency: (code) => {
                const next = MARKETS.find((m) => m.currency.code === code);
                if (next) selectMarket(next.id);
            },
            currencies: CURRENCIES,
            formatFromUsdCents,
        }),
        [market, marketId, currency, formatFromUsdCents, isAvailableInMarket, shippingForSubtotalUsdCents, regionalUsdCents, selectMarket, autoDetecting],
    );

    return <GeoMarketContext.Provider value={value}>{children}</GeoMarketContext.Provider>;
}

/** Primary hook for the Geo-Market Engine. */
export function useGeoMarket() {
    const ctx = useContext(GeoMarketContext);
    if (!ctx) throw new Error('useGeoMarket must be used within GeoMarketProvider');
    return ctx;
}

/** Backward-compatible alias — existing components import useCurrency. */
export function useCurrency() {
    return useGeoMarket();
}

/** Backward-compatible provider alias. */
export const CurrencyProvider = GeoMarketProvider;

/**
 * Market selector — replaces the legacy currency dropdown. Selecting a market
 * switches currency, regional pricing, payment methods, shipping rules and
 * legal jurisdiction together. Renders compact to fit existing header slots.
 */
export function MarketSelector({ className = '' }) {
    const { marketId, selectMarket, markets, autoDetecting } = useGeoMarket();
    return (
        <label className={`inline-flex items-center gap-2 ${className}`}>
            <span className="sr-only">Mercado</span>
            <select
                value={marketId}
                onChange={(e) => selectMarket(e.target.value)}
                className="cursor-pointer border border-border bg-ink/80 px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-silver outline-none transition-colors hover:border-violet-bright hover:text-paper focus:border-violet-bright"
                aria-label="Seleccionar mercado"
            >
                {markets.map((m) => (
                    <option key={m.id} value={m.id}>
                        {m.flag} {m.label} · {m.currency.code}
                    </option>
                ))}
            </select>
            {autoDetecting ? (
                <span
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-bright"
                    aria-hidden="true"
                    title="Detectando mercado…"
                />
            ) : null}
        </label>
    );
}

/** Backward-compatible currency selector — now delegates to the market selector. */
export function CurrencySelector({ className = '' }) {
    return <MarketSelector className={className} />;
}
