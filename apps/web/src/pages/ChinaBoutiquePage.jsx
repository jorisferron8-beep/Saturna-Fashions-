import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Menu, X, Loader2, Plus } from 'lucide-react';
import { getProducts, getCategories } from '@/api/EcommerceApi';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { useGeoMarket } from '@/context/CurrencyContext';
import Seo from '@/components/Seo';
import RegionSwitcher from '@/components/RegionSwitcher';

/* User editorial photography — SATURNA dark modern luxury */
const IMG = {
    hero: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/d8453996d7144c2a1c519cbca22e4c1d.jpg',
    street: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/cd09225766c3f80e8956b48d62a49cf5.jpg',
    coat: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/c9b17f74d53469c549bbd59261ac73c1.jpg',
    blouse: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/e635ab1e92dfdf4870ea35beec6b3ff7.jpg',
    dress: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/092ef53d59ace73ada499eb3a8d18a29.jpg',
    cargo: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/904e3a98c180a0957d95b969ab9b58c2.jpg',
    laceDress: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/986a6ea2df7c6be52ac939df0da1bf93.jpg',
    satin: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/6463e4a6ae2196508e930e0c6697b1fd.jpg',
    laceTop: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/2185b74a310095d60467538427bb28df.jpg',
    body: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/6463e4a6ae2196508e930e0c6697b1fd.jpg',
};

const placeholderImage =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUzMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjdGNUYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzVBMTgyNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlNBVFVSTkE8L3RleHQ+PC9zdmc+';

const COLLECTIONS = [
    {
        en: 'CORSETS',
        zh: '紧身胸衣',
        tag: 'STRUCTURE / FEMININITY / ATTITUDE',
        cta: 'SHOP CORSETS',
        img: IMG.satin,
        href: '#new',
    },
    {
        en: 'BODYSUITS',
        zh: '连体衣',
        tag: 'SECOND SKIN / CONFIDENCE',
        cta: 'SHOP BODYSUITS',
        img: IMG.body,
        href: '#new',
    },
    {
        en: 'TOPS',
        zh: '上衣',
        tag: 'EVERYDAY DARK ELEGANCE',
        cta: 'SHOP TOPS',
        img: IMG.laceTop,
        href: '#new',
    },
    {
        en: 'JACKETS',
        zh: '外套',
        tag: 'THE STATEMENT PIECE',
        cta: 'SHOP JACKETS',
        img: IMG.street,
        href: '#new',
    },
    {
        en: 'DRESSES',
        zh: '连衣裙',
        tag: 'AFTER DARK',
        cta: 'SHOP DRESSES',
        img: IMG.dress,
        href: '#new',
    },
];

const NAV = [
    { en: 'NEW IN', zh: '新品', href: '#new' },
    { en: 'COLLECTIONS', zh: '系列', href: '#collections' },
    { en: 'CLOTHING', zh: '女装', href: '#collections' },
    { en: 'LIMITED EDITION', zh: '限量系列', href: '#limited' },
    { en: 'WORLD OF SATURNA', zh: 'SATURNA世界', href: '#woman' },
];

function useProducts() {
    const [products, setProducts] = useState([]);
    const [categoryMap, setCategoryMap] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        Promise.all([
            getProducts({ limit: 100, order: 'DESC', sort_by: 'created_at' }),
            getCategories().catch(() => ({ categories: [] })),
        ])
            .then(([res, catRes]) => {
                if (cancelled) return;
                setProducts(res.products || []);
                const map = {};
                (catRes.categories || []).forEach((c) => { map[c.id] = c.title; });
                if (Object.keys(map).length) setCategoryMap(map);
            })
            .catch(() => {
                if (!cancelled) setProducts([]);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return { products, loading, categoryMap };
}

function Header({ onOpenCart, cartCount }) {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <div className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-[#F7F5F0]">
                <div className="flex items-center justify-center gap-4 border-b border-black/5 px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                    <span>CHINA / HONG KONG</span>
                    <span className="text-neutral-300">·</span>
                    <RegionSwitcher light />
                </div>
                <header
                    className={`mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-3.5 transition-shadow md:px-8 ${
                        scrolled ? 'shadow-[0_1px_0_rgba(0,0,0,0.06)]' : ''
                    }`}
                >
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            type="button"
                            className="text-black md:hidden"
                            onClick={() => setOpen(true)}
                            aria-label="Menu"
                        >
                            <Menu className="h-5 w-5" strokeWidth={1.25} />
                        </button>
                        <Link
                            to="/cn"
                            className="font-display text-lg font-semibold uppercase tracking-[0.28em] text-black md:text-xl"
                        >
                            SATURNA<sup className="ml-0.5 text-[0.45em]">™</sup>
                        </Link>
                    </div>

                    <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
                        {NAV.map((n) => (
                            <a
                                key={n.en}
                                href={n.href}
                                className="text-[11px] font-medium uppercase tracking-[0.2em] text-black/70 transition-colors hover:text-black"
                            >
                                {n.en}
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.18em] text-black/70 md:gap-4">
                        <button type="button" className="hidden transition-colors hover:text-black sm:inline">
                            SEARCH
                        </button>
                        <button type="button" className="hidden transition-colors hover:text-black md:inline">
                            ACCOUNT
                        </button>
                        <button type="button" className="hidden transition-colors hover:text-black md:inline">
                            WISHLIST
                        </button>
                        <button
                            type="button"
                            onClick={onOpenCart}
                            className="relative transition-colors hover:text-black"
                            aria-label="Bag"
                        >
                            BAG{cartCount > 0 ? ` (${cartCount})` : ''}
                        </button>
                    </div>
                </header>
            </div>

            {open ? (
                <div className="fixed inset-0 z-[60] bg-[#F7F5F0] md:hidden">
                    <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
                        <span className="font-display text-lg font-semibold uppercase tracking-[0.28em] text-black">
                            SATURNA™
                        </span>
                        <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                            <X className="h-5 w-5 text-black" strokeWidth={1.25} />
                        </button>
                    </div>
                    <nav className="flex flex-col px-5 pt-4">
                        {NAV.map((n) => (
                            <a
                                key={n.en}
                                href={n.href}
                                onClick={() => setOpen(false)}
                                className="flex items-baseline justify-between border-b border-black/10 py-5"
                            >
                                <span className="font-display text-2xl font-medium uppercase tracking-[0.08em] text-black">
                                    {n.en}
                                </span>
                                <span className="text-sm text-neutral-500">{n.zh}</span>
                            </a>
                        ))}
                    </nav>
                    <div className="mt-8 space-y-3 px-5 text-[11px] uppercase tracking-[0.2em] text-neutral-600">
                        <p>搜索 · 账户 · 收藏 · 购物袋</p>
                        <RegionSwitcher light />
                    </div>
                </div>
            ) : null}
        </>
    );
}

function Hero() {
    const reduce = useReducedMotion();
    return (
        <section className="relative mt-[88px] min-h-[min(92dvh,900px)] w-full overflow-hidden bg-[#F7F5F0]">
            <motion.img
                src={IMG.hero}
                alt="SATURNA — Dark Femininity"
                className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
                initial={reduce ? {} : { scale: 1.04 }}
                animate={reduce ? {} : { scale: 1 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/10" />
            <div className="relative z-10 mx-auto flex min-h-[min(92dvh,900px)] max-w-[1440px] flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-24">
                <p className="mb-3 font-display text-sm font-medium uppercase tracking-[0.4em] text-white/90 md:text-base">
                    SATURNA™
                </p>
                <h1 className="max-w-3xl font-display text-5xl font-semibold uppercase leading-[0.92] tracking-[0.04em] text-white md:text-7xl lg:text-8xl">
                    Dark Femininity
                </h1>
                <p className="mt-4 text-sm tracking-[0.28em] text-white/80 md:text-base">现代女性 · 黑暗美学</p>
                <div className="mt-10 flex flex-wrap gap-3">
                    <a
                        href="#new"
                        className="inline-flex items-center bg-white px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-black transition-colors hover:bg-[#F7F5F0]"
                    >
                        Shop Women
                    </a>
                    <a
                        href="#collections"
                        className="inline-flex items-center border border-white/70 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-white hover:text-black"
                    >
                        探索女装
                    </a>
                </div>
            </div>
        </section>
    );
}

function ProductCard({ product, formatFromUsdCents, onAdd, index }) {
    const [hover, setHover] = useState(false);
    const price =
        product.priceUsdCents != null
            ? formatFromUsdCents(product.priceUsdCents)
            : product.priceLabel || '';

    return (
        <article
            className="group"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-200">
                <img
                    src={hover && product.hover ? product.hover : product.image}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                    onError={(e) => { const t = e.currentTarget; if (t.dataset.fallback) return; t.dataset.fallback = '1'; t.src = placeholderImage; }}
                />
                <button
                    type="button"
                    onClick={() => onAdd(product)}
                    className="absolute bottom-0 left-0 right-0 translate-y-full bg-black py-3 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-white transition-transform duration-300 group-hover:translate-y-0"
                >
                    Add to Bag +
                </button>
                <span className="absolute left-3 top-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white/90 drop-shadow">
                    Quick View
                </span>
            </div>
            <div className="mt-4 space-y-1.5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                    {product.num || String(index + 1).padStart(2, '0')} — {product.category || 'SATURNA'}
                </p>
                <h3 className="font-display text-base font-medium uppercase tracking-[0.06em] text-black md:text-lg">
                    {product.title}
                </h3>
                <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">{product.subtitle}</p>
                {product.colors?.length ? (
                    <p className="pt-1 text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                        {product.colors.join(' · ')}
                        {product.sizes ? ` · ${product.sizes.join(' ')}` : ''}
                    </p>
                ) : null}
                <p className="pt-1 text-sm font-medium tracking-wide text-black">{price}</p>
            </div>
        </article>
    );
}

function JustIn({ items, loading, formatFromUsdCents, onAdd }) {
    return (
        <section id="new" className="scroll-mt-28 bg-[#F7F5F0] px-5 py-20 md:px-8 md:py-28">
            <div className="mx-auto max-w-[1440px]">
                <div className="mb-12 flex flex-col gap-2 md:mb-16 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="font-display text-4xl font-semibold uppercase tracking-[0.06em] text-black md:text-5xl">
                            Just In
                        </h2>
                        <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-neutral-500">
                            New Season · 2026
                        </p>
                    </div>
                    <p className="max-w-sm text-sm leading-relaxed text-neutral-500">
                        Structured silhouettes. Dark femininity. Pieces designed for the modern SATURNA woman.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" strokeWidth={1.5} />
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <p className="font-display text-xl font-semibold uppercase tracking-[0.08em] text-black">Catalogue empty</p>
                        <p className="mt-3 max-w-sm text-sm font-light leading-relaxed text-neutral-500">The boutique catalogue is not returning products at this time. Please check back later.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-6 md:gap-y-16">
                        {items.map((p, i) => (
                            <ProductCard
                                key={p.id}
                                product={p}
                                index={i}
                                formatFromUsdCents={formatFromUsdCents}
                                onAdd={onAdd}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

function Collections() {
    return (
        <section id="collections" className="scroll-mt-28 border-t border-black/5 bg-white px-5 py-20 md:px-8 md:py-28">
            <div className="mx-auto max-w-[1440px]">
                <h2 className="mb-3 font-display text-3xl font-semibold uppercase tracking-[0.08em] text-black md:text-4xl">
                    Collections
                </h2>
                <p className="mb-14 text-[11px] uppercase tracking-[0.28em] text-neutral-500">SATURNA / 系列</p>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {COLLECTIONS.map((c) => (
                        <a key={c.en} href={c.href} className="group block">
                            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                                <img
                                    src={c.img}
                                    alt={c.en}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/70">{c.zh}</p>
                                    <h3 className="mt-1 font-display text-2xl font-semibold uppercase tracking-[0.08em]">
                                        {c.en}
                                    </h3>
                                    <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/75">{c.tag}</p>
                                    <span className="mt-5 inline-block border-b border-white/80 pb-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors group-hover:border-white">
                                        {c.cta}
                                    </span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

function LimitedEdition({ onDiscover }) {
    return (
        <section id="limited" className="scroll-mt-28 bg-[#0A0A0A] px-5 py-24 md:px-8 md:py-32">
            <div className="mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-2 lg:gap-16">
                <div className="relative aspect-[4/5] overflow-hidden md:aspect-[3/4]">
                    <img src={IMG.coat} alt="SATURNA Limited Edition" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
                </div>
                <div className="text-white">
                    <p className="text-[11px] uppercase tracking-[0.35em] text-[#5A1825]">SATURNA</p>
                    <h2 className="mt-4 font-display text-5xl font-semibold uppercase leading-none tracking-[0.04em] md:text-6xl lg:text-7xl">
                        Limited
                        <br />
                        Edition
                    </h2>
                    <p className="mt-4 text-sm tracking-[0.2em] text-white/50">少量限定系列</p>
                    <p className="mt-8 max-w-md text-sm leading-relaxed text-white/70">
                        Few pieces. One identity. A selection of creations produced in limited quantity —
                        sculptural coats, lace, and evening silhouettes.
                    </p>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-white/45">
                        少量制作。唯一身份。精选限量剪裁。
                    </p>
                    <button
                        type="button"
                        onClick={onDiscover}
                        className="mt-10 inline-flex items-center bg-[#5A1825] px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#6e1e2e]"
                    >
                        Discover
                    </button>
                </div>
            </div>
        </section>
    );
}

function SaturnaWoman() {
    return (
        <section id="woman" className="scroll-mt-28 bg-[#F7F5F0]">
            <div className="relative min-h-[70vh] w-full overflow-hidden md:min-h-[85vh]">
                <img
                    src={IMG.blouse}
                    alt="The SATURNA Woman"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/35" />
                <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-[900px] flex-col items-center justify-center px-6 py-24 text-center text-white md:min-h-[85vh]">
                    <h2 className="font-display text-4xl font-semibold uppercase tracking-[0.1em] md:text-6xl">
                        The SATURNA Woman
                    </h2>
                    <p className="mt-5 text-sm tracking-[0.35em] text-white/80">自信 · 神秘 · 独立</p>
                    <p className="mt-10 max-w-lg font-display text-xl font-light italic leading-snug tracking-wide text-white/90 md:text-2xl">
                        She doesn&apos;t follow the silhouette.
                        <br />
                        She defines it.
                    </p>
                </div>
            </div>
        </section>
    );
}

function TrustBar() {
    const items = [
        { en: 'Secure Payment', zh: '安全支付' },
        { en: 'Tracked Shipping', zh: '物流追踪' },
        { en: 'Customer Care', zh: '客户服务' },
        { en: 'Authentic SATURNA™', zh: '正品保障' },
    ];
    return (
        <div className="border-y border-black/8 bg-white">
            <div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-black/5 md:grid-cols-4">
                {items.map((t) => (
                    <div key={t.en} className="px-4 py-8 text-center">
                        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-black">{t.en}</p>
                        <p className="mt-1 text-[11px] text-neutral-400">{t.zh}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Footer() {
    return (
        <footer className="border-t border-black/8 bg-[#F7F5F0] px-5 py-16 md:px-8 md:py-20">
            <div className="mx-auto grid max-w-[1440px] gap-12 md:grid-cols-4">
                <div className="md:col-span-1">
                    <p className="font-display text-xl font-semibold uppercase tracking-[0.28em] text-black">
                        SATURNA™
                    </p>
                    <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-500">
                        Dark modern luxury. International house aesthetic for China & Hong Kong.
                    </p>
                    <p className="mt-3 text-xs text-neutral-400">女装品牌 · 香港运营 · 全球配送</p>
                </div>
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black">Shop</p>
                    <ul className="mt-4 space-y-2 text-sm text-neutral-500">
                        <li>
                            <a href="#new" className="hover:text-black">
                                New In
                            </a>
                        </li>
                        <li>
                            <a href="#collections" className="hover:text-black">
                                Collections
                            </a>
                        </li>
                        <li>
                            <a href="#limited" className="hover:text-black">
                                Limited Edition
                            </a>
                        </li>
                        <li>
                            <Link to="/store" className="hover:text-black">
                                Full Store
                            </Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black">Legal</p>
                    <ul className="mt-4 space-y-2 text-sm text-neutral-500">
                        <li>
                            <Link to="/legal" className="hover:text-black">
                                法律声明 · Legal Centre
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className="hover:text-black">
                                About SATURNA
                            </Link>
                        </li>
                        <li>
                            <Link to="/" className="hover:text-black">
                                Main Site
                            </Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black">Corporate</p>
                    <p className="mt-4 text-sm leading-relaxed text-neutral-500">
                        SWU-VISION GROUP LIMITED
                        <br />
                        Reg. 80605496
                        <br />
                        Unit 2904-05, 29/F, Universal Trade Centre
                        <br />
                        3 Arbuthnot Road, Central, Hong Kong S.A.R.
                    </p>
                </div>
            </div>
            <div className="mx-auto mt-14 flex max-w-[1440px] flex-col gap-3 border-t border-black/8 pt-8 text-[10px] uppercase tracking-[0.18em] text-neutral-400 md:flex-row md:justify-between">
                <p>© 2026 SATURNA™ · SWU-VISION GROUP LIMITED</p>
                <p>CNY ¥ · HKD $ · USD · COP</p>
            </div>
        </footer>
    );
}

function mapLiveProduct(p, i, categoryMap) {
    const cents =
        p.variants?.[0]?.price_in_cents ??
        p.price_in_cents ??
        0;
    const img =
        p.image ||
        p.images?.[0]?.url ||
        placeholderImage;
    const catId = p.collections?.[0]?.collection_id;
    return {
        id: p.id || `live-${i}`,
        num: String(i + 1).padStart(2, '0'),
        title: (p.title || 'SATURNA Piece').toUpperCase(),
        subtitle: p.subtitle || (p.description?.slice(0, 48)) || 'SATURNA Collection',
        priceUsdCents: cents,
        image: img,
        hover: img,
        category: (catId && categoryMap?.[catId]) || 'Clothing',
        colors: ['Black'],
        sizes: ['XS', 'S', 'M', 'L'],
        live: true,
        raw: p,
    };
}

export default function ChinaBoutiquePage() {
    const { formatFromUsdCents, market, selectMarket } = useGeoMarket();
    const { addToCart, cartItems } = useCart();
    const { toast } = useToast();
    const { products, loading, categoryMap } = useProducts();
    const reduce = useReducedMotion();

    // Pin the Geo-Market engine to China so prices and checkout locale follow
    // this route, the same way RegionalBoutiquePage pins US/CO/HK.
    useEffect(() => {
        if (market.id !== 'CN') selectMarket('CN');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cartCount = (cartItems || []).reduce((n, i) => n + (i.quantity || 0), 0);

    const displayItems = useMemo(() => {
        if (products && products.length > 0) {
            return products.map((p, i) => mapLiveProduct(p, i, categoryMap));
        }
        return [];
    }, [products, categoryMap]);

    const openCart = () => {
        window.dispatchEvent(new CustomEvent('saturna:open-cart'));
    };

    const onAdd = async (product) => {
        try {
            if (product.live && product.raw?.variants?.[0]) {
                const v = product.raw.variants[0];
                await addToCart(product.raw, v, 1, v.inventory_quantity ?? 99);
            } else {
                const fakeProduct = {
                    id: product.id,
                    title: product.title,
                    thumbnail: product.image,
                    media: [{ url: product.image }],
                };
                const fakeVariant = {
                    id: `${product.id}-default`,
                    title: 'Default',
                    price_in_cents: product.priceUsdCents,
                    manage_inventory: false,
                };
                await addToCart(fakeProduct, fakeVariant, 1, 99);
            }
            toast({
                title: 'Added to bag',
                description: product.title,
            });
            openCart();
        } catch (err) {
            toast({
                title: 'Could not add',
                description: err?.message || 'Please try again.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F5F0] font-body text-black antialiased">
            <Helmet>
                <html lang="zh-CN" />
                <title>SATURNA™ China / Hong Kong — Dark Modern Luxury</title>
                <meta
                    name="description"
                    content="SATURNA™ dark modern luxury boutique for China and Hong Kong. Corsets, bodysuits, tops, jackets and dresses. Editorial fashion ecommerce."
                />
            </Helmet>
            <Seo
                title="SATURNA™ China / Hong Kong — Dark Modern Luxury"
                description="Dark femininity. Modern gothic details. Clean luxury ecommerce for China & Hong Kong."
                image={IMG.hero}
            />

            <Header onOpenCart={openCart} cartCount={cartCount} />
            <Hero />
            <JustIn
                items={displayItems}
                loading={loading}
                formatFromUsdCents={formatFromUsdCents}
                onAdd={onAdd}
            />
            <Collections />
            <LimitedEdition
                onDiscover={() => {
                    document.getElementById('new')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
                }}
            />
            <SaturnaWoman />
            <TrustBar />
            <Footer />

            {/* Market hint for active currency */}
            <div className="sr-only" aria-live="polite">
                Active market {market?.region} {market?.currency?.code}
            </div>
        </div>
    );
}
