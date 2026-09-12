import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Menu, X, Loader2, ArrowRight, Instagram } from 'lucide-react';
import { getProducts, getCategories } from '@/api/EcommerceApi';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { useGeoMarket } from '@/context/CurrencyContext';
import Seo from '@/components/Seo';
import LegalPolicies from '@/components/LegalPolicies';
import RegionSwitcher from '@/components/RegionSwitcher';
import { SATURNA_LOGO, SATURNA_OG_IMAGE } from '@/lib/brand';
import { REGION_META, getStrings } from '@/i18n/regions';

/* Shared editorial photography — common SATURNA visual identity */
const IMG = {
    hero: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/d8453996d7144c2a1c519cbca22e4c1d.jpg',
    street: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/cd09225766c3f80e8956b48d62a49cf5.jpg',
    coat: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/c9b17f74d53469c549bbd59261ac73c1.jpg',
    blouse: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/e635ab1e92dfdf4870ea35beec6b3ff7.jpg',
    dress: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/092ef53d59ace73ada499eb3a8d18a29.jpg',
    cargo: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/904e3a98c180a0957d95b969ab9b58c2.jpg',
    laceDress: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/986a6ea2df7c6be52ac939df0da1bf93.jpg',
    satin: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/6463e4a6ae2196508e930e0c6697b1fd.jpg',
    laceTop: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/218b74a310095d60467538427bb28df.jpg',
    body: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/6463e4a6ae2196508e930e0c6697b1fd.jpg',
};

const COLLECTION_IMG = [IMG.satin, IMG.street, IMG.laceDress, IMG.hero, IMG.dress];

const placeholderImage =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUzMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjdGNUYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzVBMTgyNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlNBVFVSTkE8L3RleHQ+PC9zdmc+';

const stripHtml = (html) => (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

function mapLiveProduct(p, i, categoryMap, fallbackImg) {
    const cents = p.variants?.[0]?.price_in_cents ?? p.price_in_cents ?? 8900;
    const img = p.image || p.images?.[0]?.url || fallbackImg;
    const catId = p.collections?.[0]?.collection_id;
    return {
        id: p.id || `live-${i}`,
        num: String(i + 1).padStart(2, '0'),
        title: (p.title || 'SATURNA Piece').toUpperCase(),
        subtitle: p.subtitle || (p.description?.slice(0, 48)) || 'SATURNA',
        priceUsdCents: cents,
        image: img,
        hover: fallbackImg,
        category: (catId && categoryMap?.[catId]) || 'SATURNA',
        live: true,
        raw: p,
    };
}

function ProductCard({ product, formatFromUsdCents, onAdd, index, t, currencyCode }) {
    const [hover, setHover] = useState(false);
    const price = product.priceUsdCents != null ? formatFromUsdCents(product.priceUsdCents) : product.priceLabel || '';
    const desc = stripHtml(product.raw?.description || product.description || '');
    return (
        <article className="group" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-200">
                <img
                    src={hover && product.hover ? product.hover : product.image}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                    onError={(e) => { const el = e.currentTarget; if (el.dataset.fallback) return; el.dataset.fallback = '1'; el.src = placeholderImage; }}
                />
                {product.limited ? (
                    <span className="absolute left-3 top-3 bg-[#5A1825] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white">
                        {t.product.limited}
                    </span>
                ) : (
                    <span className="absolute left-3 top-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white/90 drop-shadow">
                        {t.product.quickView}
                    </span>
                )}
                <button
                    type="button"
                    onClick={() => onAdd(product)}
                    className="absolute bottom-0 left-0 right-0 translate-y-full bg-black py-3 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-white transition-transform duration-300 group-hover:translate-y-0"
                >
                    {t.product.addToBag}
                </button>
            </div>
            <div className="mt-4 space-y-1.5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                    {product.num || String(index + 1).padStart(2, '0')} — {product.category || 'SATURNA'}
                </p>
                <h3 className="font-display text-base font-medium uppercase tracking-[0.06em] text-black md:text-lg">
                    {product.title}
                </h3>
                <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">{product.subtitle}</p>
                <p className="pt-1 text-sm font-medium tracking-wide text-black">{price}{currencyCode ? <span className="ml-1 text-[10px] font-normal uppercase tracking-[0.18em] text-neutral-400">{currencyCode}</span> : null}</p>
                {desc ? <p className="mt-1 line-clamp-2 text-[11px] font-light leading-relaxed text-neutral-500">{desc}</p> : null}
            </div>
        </article>
    );
}

function Header({ t, region, onOpenCart, cartCount }) {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    const navCls = 'text-[11px] font-medium uppercase tracking-[0.2em] text-black/70 transition-colors hover:text-black';
    return (
        <>
            <div className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-[#F7F5F0]">
                <div className="flex items-center justify-center gap-4 border-b border-black/5 px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                    <span>{t.marketLine}</span>
                    <span className="text-neutral-300">·</span>
                    <RegionSwitcher light />
                </div>
                <header className={`mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-3.5 transition-shadow md:px-8 ${scrolled ? 'shadow-[0_1px_0_rgba(0,0,0,0.06)]' : ''}`}>
                    <div className="flex min-w-0 items-center gap-3">
                        <button type="button" className="text-black md:hidden" onClick={() => setOpen(true)} aria-label="Menu">
                            <Menu className="h-5 w-5" strokeWidth={1.25} />
                        </button>
                        <Link to={region.route} className="font-display text-lg font-semibold uppercase tracking-[0.28em] text-black md:text-xl">
                            SATURNA<sup className="ml-0.5 text-[0.45em]">™</sup>
                        </Link>
                    </div>
                    <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
                        {t.nav.map((n) => n.href.startsWith('/') ? (
                            <Link key={n.label} to={n.href} className={navCls}>{n.label}</Link>
                        ) : (
                            <a key={n.label} href={n.href} className={navCls}>{n.label}</a>
                        ))}
                    </nav>
                    <div className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.18em] text-black/70 md:gap-4">
                        <Link to="/about" className="hidden transition-colors hover:text-black md:inline">Account</Link>
                        <button type="button" onClick={onOpenCart} className="relative transition-colors hover:text-black" aria-label="Bag">
                            BAG{cartCount > 0 ? ` (${cartCount})` : ''}
                        </button>
                    </div>
                </header>
            </div>

            {open ? (
                <div className="fixed inset-0 z-[60] bg-[#F7F5F0] md:hidden">
                    <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
                        <span className="font-display text-lg font-semibold uppercase tracking-[0.28em] text-black">SATURNA™</span>
                        <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                            <X className="h-5 w-5 text-black" strokeWidth={1.25} />
                        </button>
                    </div>
                    <nav className="flex flex-col px-5 pt-4">
                        {t.nav.map((n) => n.href.startsWith('/') ? (
                            <Link key={n.label} to={n.href} onClick={() => setOpen(false)} className="flex items-baseline justify-between border-b border-black/10 py-5">
                                <span className="font-display text-2xl font-medium uppercase tracking-[0.08em] text-black">{n.label}</span>
                            </Link>
                        ) : (
                            <a key={n.label} href={n.href} onClick={() => setOpen(false)} className="flex items-baseline justify-between border-b border-black/10 py-5">
                                <span className="font-display text-2xl font-medium uppercase tracking-[0.08em] text-black">{n.label}</span>
                            </a>
                        ))}
                    </nav>
                    <div className="mt-8 space-y-3 px-5 text-[11px] uppercase tracking-[0.2em] text-neutral-600">
                        <RegionSwitcher light />
                    </div>
                </div>
            ) : null}
        </>
    );
}

function Hero({ t }) {
    const reduce = useReducedMotion();
    return (
        <section className="relative mt-[88px] min-h-[min(92dvh,900px)] w-full overflow-hidden bg-[#F7F5F0]">
            <motion.img
                src={IMG.hero}
                alt="SATURNA — Dark Fashion"
                className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
                initial={reduce ? {} : { scale: 1.04 }}
                animate={reduce ? {} : { scale: 1 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/10" />
            <div className="relative z-10 mx-auto flex min-h-[min(92dvh,900px)] max-w-[1440px] flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-24">
                <p className="mb-3 font-display text-sm font-medium uppercase tracking-[0.4em] text-white/90 md:text-base">{t.hero.eyebrow}</p>
                <h1 className="max-w-3xl font-display text-5xl font-semibold uppercase leading-[0.92] tracking-[0.04em] text-white md:text-7xl lg:text-8xl">
                    {t.hero.title}
                </h1>
                <p className="mt-4 text-sm tracking-[0.28em] text-white/80 md:text-base">{t.hero.sub}</p>
                <p className="mt-6 max-w-md text-sm leading-relaxed text-white/80 md:text-base">{t.hero.desc}</p>
                <div className="mt-10 flex flex-wrap gap-3">
                    <a href="#new" className="inline-flex items-center bg-white px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-black transition-colors hover:bg-[#F7F5F0]">
                        {t.hero.cta1}
                    </a>
                    <Link to="/store" className="inline-flex items-center border border-white/70 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-white hover:text-black">
                        {t.hero.cta2}
                    </Link>
                </div>
            </div>
        </section>
    );
}

function JustIn({ t, items, loading, formatFromUsdCents, onAdd, currencyCode }) {
    return (
        <section id="new" className="scroll-mt-28 bg-[#F7F5F0] px-5 py-20 md:px-8 md:py-28">
            <div className="mx-auto max-w-[1440px]">
                <div className="mb-12 flex flex-col gap-2 md:mb-16 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="font-display text-4xl font-semibold uppercase tracking-[0.06em] text-black md:text-5xl">{t.justIn.title}</h2>
                        <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-neutral-500">{t.justIn.sub}</p>
                    </div>
                    <p className="max-w-sm text-sm leading-relaxed text-neutral-500">{t.justIn.desc}</p>
                </div>
                {loading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" strokeWidth={1.5} />
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <p className="font-display text-xl font-semibold uppercase tracking-[0.08em] text-black">{t.empty?.title || 'Catálogo vacío'}</p>
                        <p className="mt-3 max-w-sm text-sm font-light leading-relaxed text-neutral-500">{t.empty?.desc || 'El catálogo de la boutique no devuelve productos en este momento. Vuelva a intentarlo más tarde.'}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-6 md:gap-y-16">
                        {items.map((p, i) => (
                            <ProductCard key={p.id} product={p} index={i} formatFromUsdCents={formatFromUsdCents} onAdd={onAdd} t={t} currencyCode={currencyCode} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

function Collections({ t }) {
    return (
        <section id="collections" className="scroll-mt-28 border-t border-black/5 bg-white px-5 py-20 md:px-8 md:py-28">
            <div className="mx-auto max-w-[1440px]">
                <h2 className="mb-3 font-display text-3xl font-semibold uppercase tracking-[0.08em] text-black md:text-4xl">{t.collections.title}</h2>
                <p className="mb-14 text-[11px] uppercase tracking-[0.28em] text-neutral-500">{t.collections.sub}</p>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {t.collections.items.map((c, i) => (
                        <a key={c.en} href="#new" className="group block">
                            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                                <img src={COLLECTION_IMG[i % COLLECTION_IMG.length]} alt={c.en} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" loading="lazy" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/70">{c.local}</p>
                                    <h3 className="mt-1 font-display text-2xl font-semibold uppercase tracking-[0.08em]">{c.en}</h3>
                                    <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/75">{c.tag}</p>
                                    <span className="mt-5 inline-block border-b border-white/80 pb-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors group-hover:border-white">{c.cta}</span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

function LimitedEdition({ t, onDiscover }) {
    return (
        <section id="limited" className="scroll-mt-28 bg-[#0A0A0A] px-5 py-24 md:px-8 md:py-32">
            <div className="mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-2 lg:gap-16">
                <div className="relative aspect-[4/5] overflow-hidden md:aspect-[3/4]">
                    <img src={IMG.coat} alt="SATURNA Limited Edition" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
                </div>
                <div className="text-white">
                    <p className="text-[11px] uppercase tracking-[0.35em] text-[#A3182B]">{t.limited.eyebrow}</p>
                    <h2 className="mt-4 font-display text-5xl font-semibold uppercase leading-none tracking-[0.04em] md:text-6xl lg:text-7xl">{t.limited.title}</h2>
                    <p className="mt-4 text-sm tracking-[0.2em] text-white/50">{t.limited.sub}</p>
                    <p className="mt-8 max-w-md text-sm leading-relaxed text-white/70">{t.limited.desc}</p>
                    <button type="button" onClick={onDiscover} className="mt-10 inline-flex items-center bg-[#5A1825] px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#6e1e2e] active:scale-[0.98]">
                        {t.limited.cta}
                    </button>
                </div>
            </div>
        </section>
    );
}

function SaturnaWoman({ t }) {
    return (
        <section id="woman" className="scroll-mt-28 bg-[#F7F5F0]">
            <div className="relative min-h-[70vh] w-full overflow-hidden md:min-h-[85vh]">
                <img src={IMG.blouse} alt={t.woman.title} className="absolute inset-0 h-full w-full object-cover object-center" />
                <div className="absolute inset-0 bg-black/35" />
                <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-[900px] flex-col items-center justify-center px-6 py-24 text-center text-white md:min-h-[85vh]">
                    <h2 className="font-display text-4xl font-semibold uppercase tracking-[0.1em] md:text-6xl">{t.woman.title}</h2>
                    <p className="mt-5 text-sm tracking-[0.35em] text-white/80">{t.woman.sub}</p>
                    <p className="mt-10 max-w-lg font-display text-xl font-light italic leading-snug tracking-wide text-white/90 md:text-2xl">{t.woman.quote}</p>
                    <Link to="/about" className="mt-10 inline-flex items-center gap-2 border-b border-white/80 pb-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:border-white">
                        {t.woman.cta}
                        <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                    </Link>
                </div>
            </div>
        </section>
    );
}

function TrustBar({ t }) {
    return (
        <div className="border-y border-black/8 bg-[#F7F5F0]">
            <div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-black/5 md:grid-cols-4">
                {t.trust.map((item) => (
                    <div key={item.main} className="px-4 py-8 text-center">
                        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-black">{item.main}</p>
                        <p className="mt-1 text-[11px] text-neutral-400">{item.sub}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Footer({ t }) {
    return (
        <footer className="bg-ink text-paper">
            <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-8">
                <div className="grid gap-12 md:grid-cols-4">
                    <div className="md:col-span-1">
                        <p className="font-display text-xl font-semibold uppercase tracking-[0.28em] text-paper">SATURNA™</p>
                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-smoke">{t.footer.tagline}</p>
                        <div className="mt-4"><RegionSwitcher /></div>
                        <a href="https://instagram.com" className="mt-5 inline-flex items-center gap-2 text-silver transition-colors hover:text-violet-bright" aria-label="Instagram">
                            <Instagram className="h-5 w-5" strokeWidth={1.5} />
                        </a>
                    </div>
                    <div>
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-violet-bright">{t.footer.shopTitle}</p>
                        <ul className="space-y-2 text-sm font-light text-smoke">
                            {t.footer.shopLinks.map((l) => (
                                <li key={l.label}>
                                    {l.href.startsWith('/') ? (
                                        <Link to={l.href} className="hover:text-paper">{l.label}</Link>
                                    ) : (
                                        <a href={l.href} className="hover:text-paper">{l.label}</a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-violet-bright">{t.footer.contactTitle}</p>
                        <ul className="space-y-2 text-sm font-light text-smoke">
                            <li><a href="mailto:customerservice@saturna-fashions.com" className="hover:text-paper">customerservice@saturna-fashions.com</a></li>
                            <li><a href="mailto:support@saturna-fashions.com" className="hover:text-paper">support@saturna-fashions.com</a></li>
                            <li><a href="mailto:servicelegals@saturna-fashions.com" className="hover:text-paper">servicelegals@saturna-fashions.com</a></li>
                        </ul>
                    </div>
                    <div>
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-violet-bright">{t.footer.corpTitle}</p>
                        <ul className="space-y-2 text-sm font-light text-smoke">
                            <li>SWU-VISION GROUP LIMITED</li>
                            <li>注册编号 Reg. 80605496</li>
                            <li>Unit 2904-05, 29/F, Universal Trade Centre</li>
                            <li>3 Arbuthnot road, Central</li>
                            <li>Hong Kong S.A.R.</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-border pt-8">
                    <p className="text-center text-[11px] font-light leading-relaxed text-smoke md:text-left">{t.footer.rights}</p>
                </div>
            </div>
            <LegalPolicies />
        </footer>
    );
}

/**
 * RegionalBoutiquePage — one shared boutique, four regional markets.
 * Receives a `marketId` (US | CO | HK | CN), pins the Geo-Market engine to it,
 * and renders the catalogue in the region's language and currency.
 */
export default function RegionalBoutiquePage({ marketId = 'US' }) {
    const region = REGION_META[marketId] || REGION_META.US;
    const t = getStrings(marketId);
    const { formatFromUsdCents, selectMarket, market } = useGeoMarket();
    const { addToCart, cartItems } = useCart();
    const { toast } = useToast();
    const navigate = useNavigate();
    const reduce = useReducedMotion();

    const [products, setProducts] = useState([]);
    const [categoryMap, setCategoryMap] = useState({});
    const [loading, setLoading] = useState(true);

    // Pin the Geo-Market engine to this region so prices, shipping and
    // checkout locale all follow the route the visitor is on.
    useEffect(() => {
        if (market.id !== region.marketId) selectMarket(region.marketId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [region.marketId]);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        Promise.all([
            getProducts({ limit: 100, order: 'DESC', sort_by: 'created_at' }).catch(() => ({ products: [] })),
            getCategories().catch(() => ({ categories: [] })),
        ]).then(([res, catRes]) => {
            if (cancelled) return;
            setProducts(res.products || []);
            const map = {};
            (catRes.categories || []).forEach((c) => { map[c.id] = c.title; });
            if (Object.keys(map).length) setCategoryMap(map);
        }).finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    const cartCount = (cartItems || []).reduce((n, i) => n + (i.quantity || 0), 0);

    const displayItems = useMemo(() => {
        if (products && products.length > 0) {
            const fb = IMG.satin;
            return products.map((p, i) => mapLiveProduct(p, i, categoryMap, fb));
        }
        return [];
    }, [products, categoryMap]);

    const openCart = useCallback(() => {
        window.dispatchEvent(new CustomEvent('saturna:open-cart'));
    }, []);

    const onAdd = useCallback(async (product) => {
        try {
            if (product.live && product.raw?.variants?.[0]) {
                const v = product.raw.variants[0];
                if (product.raw.variants.length > 1) {
                    navigate(`/product/${product.raw.id}`);
                    return;
                }
                await addToCart(product.raw, v, 1, v.inventory_quantity ?? 99);
            } else {
                const fakeProduct = {
                    id: product.id,
                    title: product.title,
                    thumbnail: product.image,
                    image: product.image,
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
            toast({ title: t.product.addToBag.replace(' +', ''), description: product.title });
            openCart();
        } catch (err) {
            toast({ title: '—', description: err?.message || '—', variant: 'destructive' });
        }
    }, [addToCart, toast, openCart, navigate, t.product.addToBag]);

    return (
        <div className="min-h-screen bg-[#F7F5F0] font-body text-black antialiased">
            <Helmet>
                <html lang={t.htmlLang} />
                <title>{t.seo.title}</title>
                <meta name="description" content={t.seo.description} />
                <link rel="icon" type="image/png" href={SATURNA_LOGO} />
            </Helmet>
            <Seo title={t.seo.title} description={t.seo.description} image={SATURNA_OG_IMAGE} siteName="SATURNA" />
            <Header t={t} region={region} onOpenCart={openCart} cartCount={cartCount} />
            <main>
                <Hero t={t} />
                <JustIn t={t} items={displayItems} loading={loading} formatFromUsdCents={formatFromUsdCents} onAdd={onAdd} currencyCode={market?.currency?.code} />
                <Collections t={t} />
                <LimitedEdition t={t} onDiscover={() => document.getElementById('new')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })} />
                <SaturnaWoman t={t} />
                <TrustBar t={t} />
            </main>
            <Footer t={t} />
            <div className="sr-only" aria-live="polite">
                Active market {market?.region} {market?.currency?.code} · {region.lang}
            </div>
        </div>
    );
}
