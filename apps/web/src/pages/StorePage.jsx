import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ShoppingBag, Loader2, X, Lock, Users, Menu } from 'lucide-react';
import { getProducts, getProductQuantities, getCategories } from '@/api/EcommerceApi';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import Seo from '@/components/Seo';
import RegionSwitcher from '@/components/RegionSwitcher';
import { SATURNA_LOGO, SATURNA_OG_IMAGE } from '@/lib/brand';

const LOGO = SATURNA_LOGO;

const IMG = {
    hero: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/cd09225766c3f80e8956b48d62a49cf5.jpg',
    denim: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/2185b74a310095d60467538427bb28df.jpg',
    cargo: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/c9b17f74d53469c549bbd59261ac73c1.jpg',
    fishnet: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/cd09225766c3f80e8956b48d62a49cf5.jpg',
    lace: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/986a6ea2df7c6be52ac939df0da1bf93.jpg',
    hoodie: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/904e3a98c180a0957d95b969ab9b58c2.jpg',
    mini: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/092ef53d59ace73ada499eb3a8d18a29.jpg',
    leather: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/6463e4a6ae2196508e930e0c6697b1fd.jpg',
    biker: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/d8453996d7144c2a1c519cbca22e4c1d.jpg',
    sheer: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/e635ab1e92dfdf4870ea35beec6b3ff7.jpg',
};

const OPENING_TARGET = new Date('2026-10-28T00:00:00+08:00').getTime();
const PRIVATE_LABELS = ['privado', 'private', 'cliente privado', 'vestidos', 'sastrería', 'sastreria', 'encaje'];
const PUBLIC_LABELS = ['público', 'publico', 'public', 'seda', 'slip', 'body', 'bodysuit', 'top', 'corset'];

const COLLECTIONS = [
    { local: 'Corsets', en: 'CORSETS', tag: 'Structure / Attitude', img: IMG.leather },
    { local: 'Cargo', en: 'CARGO', tag: 'Street 18–25', img: IMG.fishnet },
    { local: 'Lace', en: 'LACE', tag: 'Dark Elegance', img: IMG.lace },
    { local: 'Jackets', en: 'JACKETS', tag: 'The Statement Piece', img: IMG.biker },
    { local: 'Dresses', en: 'DRESSES', tag: 'After Dark', img: IMG.mini },
    { local: 'Denim', en: 'DENIM', tag: 'Urban Silhouette', img: IMG.denim },
];

const CASUAL_GROUPS = [
    {
        local: 'Tees & Tops',
        en: 'Tees & Tops',
        items: [
            { name: 'Black Cargo Set', img: IMG.cargo },
            { name: 'Fishnet Cargo', img: IMG.fishnet },
            { name: 'Cropped Hoodie', img: IMG.hoodie },
            { name: 'Sheer Lace', img: IMG.sheer },
        ],
    },
    {
        local: 'Crops & Corsets',
        en: 'Crops & Corsets',
        items: [
            { name: 'Leather Corset', img: IMG.leather },
            { name: 'Denim Corset', img: IMG.denim },
            { name: 'Lace Top', img: IMG.lace },
        ],
    },
    {
        local: 'Street Looks',
        en: 'Street Looks',
        items: [
            { name: 'Biker Leather Jacket', img: IMG.biker },
            { name: 'Lace Mini Dress', img: IMG.mini },
        ],
    },
];

const placeholderImage =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlM2RjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzVhMTgyNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlNBVFVSTkE8L3RleHQ+PC9zdmc+';

function useCountdown(targetMs) {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, []);
    const diff = Math.max(0, targetMs - now);
    return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        done: diff <= 0,
    };
}

function Header() {
    const [open, setOpen] = useState(false);
    const links = [
        { to: '/', label: 'Home' },
        { to: '/store', label: 'Store' },
        { to: '/cn', label: 'China / HK' },
        { to: '/elegancia', label: 'Elegancia' },
        { to: '/about', label: 'About' },
    ];
    return (
        <>
            <div className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-[#F7F5F0]">
                <div className="flex items-center justify-center gap-4 border-b border-black/5 px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                    <span>Worldwide Shipping · Hong Kong Operated · Curated Womenswear</span>
                    <span className="text-neutral-300">·</span>
                    <RegionSwitcher light />
                </div>
                <header className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-3.5 md:px-8">
                    <button type="button" className="md:hidden" onClick={() => setOpen(true)} aria-label="Menu">
                        <Menu className="h-5 w-5" strokeWidth={1.5} />
                    </button>
                    <nav className="hidden items-center gap-6 md:flex">
                        {links.map((l) => (
                            <Link key={l.to} to={l.to} className="text-[11px] font-medium uppercase tracking-[0.18em] text-black/70 hover:text-black">
                                {l.label}
                            </Link>
                        ))}
                    </nav>
                    <Link to="/" className="absolute left-1/2 -translate-x-1/2" aria-label="SATURNA">
                        <img src={LOGO} alt="SATURNA" className="h-8 w-auto max-w-[10rem] object-contain md:h-10 md:max-w-[13rem]" />
                    </Link>
                    <Link to="/about" className="ml-auto text-[11px] font-medium uppercase tracking-[0.18em] text-black/70 hover:text-black">
                        About
                    </Link>
                </header>
            </div>
            {open ? (
                <div className="fixed inset-0 z-[70] flex flex-col bg-[#F7F5F0] md:hidden">
                    <div className="flex h-14 items-center justify-between px-5">
                        <img src={LOGO} alt="" className="h-8 w-auto max-w-[9rem] object-contain" />
                        <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <nav className="flex flex-1 flex-col items-center justify-center gap-8 font-display text-2xl font-semibold uppercase">
                        {links.map((l) => (
                            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>
                                {l.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            ) : null}
        </>
    );
}

function ProductCard({ product, index }) {
    const { addToCart } = useCart();
    const { toast } = useToast();
    const navigate = useNavigate();
    const variant = product.variants?.[0];
    const hasSale = variant && variant.sale_price_in_cents !== null;

    const handleAdd = useCallback(
        async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!product.variants?.length) return;
            if (product.variants.length > 1) {
                navigate(`/product/${product.id}`);
                return;
            }
            try {
                await addToCart(product, product.variants[0], 1, product.variants[0].inventory_quantity);
                toast({ title: 'Added to bag', description: product.title });
            } catch (err) {
                toast({ title: 'Could not add', description: err.message, variant: 'destructive' });
            }
        },
        [product, addToCart, toast, navigate],
    );

    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }}>
            <Link to={`/product/${product.id}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                    <img
                        src={product.image || placeholderImage}
                        alt={product.title}
                        className="h-full w-full object-contain p-4 transition-transform duration-700 group-hover:scale-[1.03]"
                        loading="lazy"
                        onError={(e) => { const t = e.currentTarget; if (t.dataset.fallback) return; t.dataset.fallback = '1'; t.src = placeholderImage; }}
                    />
                    {hasSale ? (
                        <span className="absolute left-3 top-3 bg-[#5A1825] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white">Sale</span>
                    ) : null}
                    <button
                        type="button"
                        onClick={handleAdd}
                        className="absolute bottom-0 left-0 right-0 translate-y-full bg-black py-3 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-white transition-transform duration-300 group-hover:translate-y-0"
                        aria-label="Add to bag"
                    >
                        Add to Bag +
                    </button>
                </div>
                <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                        <h3 className="font-display text-base font-medium uppercase tracking-[0.06em] text-black md:text-lg">{product.title}</h3>
                        {product.subtitle ? <p className="mt-1 line-clamp-1 text-xs text-neutral-500">{product.subtitle}</p> : null}
                    </div>
                    <div className="text-right" aria-hidden="true" />
                </div>
            </Link>
        </motion.div>
    );
}

function tierOfProduct(product) {
    const blob = [product.title, product.subtitle, product.description, ...(product.collections || []).map((c) => c.title || c.name || '')]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
    if (PRIVATE_LABELS.some((k) => blob.includes(k))) return 'privados';
    if (PUBLIC_LABELS.some((k) => blob.includes(k))) return 'publico';
    return 'all';
}

function FilterChip({ active, onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`inline-flex items-center whitespace-nowrap border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors ${
                active ? 'border-black bg-black text-white' : 'border-black/15 text-neutral-600 hover:border-black hover:text-black'
            }`}
        >
            {children}
        </button>
    );
}

export default function StorePage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tier, setTier] = useState('all');
    const [activeCat, setActiveCat] = useState('all');
    const countdown = useCountdown(OPENING_TARGET);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    getProducts({ limit: 48, order: 'DESC', sort_by: 'created_at' }),
                    getCategories().catch(() => ({ categories: [] })),
                ]);
                if (cancelled) return;
                const live = prodRes.products || [];
                if (live.length) {
                    let list = live;
                    try {
                        const ids = list.map((p) => p.id);
                        if (ids.length) {
                            const qty = await getProductQuantities({ fields: 'inventory_quantity', product_ids: ids });
                            const map = new Map(qty.variants.map((v) => [v.id, v.inventory_quantity]));
                            list = list.map((p) => ({
                                ...p,
                                variants: (p.variants || []).map((v) => ({ ...v, inventory_quantity: map.get(v.id) ?? v.inventory_quantity })),
                            }));
                        }
                    } catch {
                        /* keep list */
                    }
                    setProducts(list);
                }
                if (catRes.categories?.length) setCategories(catRes.categories);
            } catch (e) {
                if (!cancelled) setError('Could not load the boutique catalogue.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const categoryMap = useMemo(() => {
        const map = {};
        categories.forEach((c) => { map[c.id] = c.title; });
        return map;
    }, [categories]);

    const filtered = useMemo(() => {
        return products.filter((p) => {
            const t = tierOfProduct(p);
            if (tier === 'privados' && t !== 'privados') return false;
            if (tier === 'publico' && t === 'privados') return false;
            if (activeCat !== 'all') {
                const ids = (p.collections || []).map((c) => c.collection_id);
                if (!ids.includes(activeCat)) return false;
            }
            return true;
        });
    }, [products, tier, activeCat]);

    // Group filtered products by their first collection, resolved to the
    // category title. Products with no collection land in "Other".
    const groupedByCategory = useMemo(() => {
        const groups = new Map();
        filtered.forEach((p) => {
            const catId = p.collections?.[0]?.collection_id;
            const title = (catId && categoryMap[catId]) || 'Other';
            if (!groups.has(title)) groups.set(title, []);
            groups.get(title).push(p);
        });
        return Array.from(groups.entries());
    }, [filtered, categoryMap]);

    return (
        <div className="min-h-screen bg-[#F7F5F0] font-body text-black antialiased">
            <Helmet>
                <title>Store / Shop — SATURNA™ | China · Hong Kong · Worldwide</title>
                <meta name="description" content="SATURNA™ womenswear boutique. Corsets, cargo, lace, jackets. For ages 18–25. Hong Kong operated, worldwide shipping." />
                <html lang="en" />
                <link rel="icon" type="image/png" href={SATURNA_LOGO} />
            </Helmet>
            <Seo title="Store — SATURNA™" description="SATURNA dark fashion boutique. Corsets, cargo, lace. Ages 18–25." image={SATURNA_OG_IMAGE} siteName="SATURNA" />
            <Header />

            <section className="relative mt-[5.5rem] min-h-[58vh] overflow-hidden md:mt-[6.25rem]">
                <img src={IMG.hero} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/15" />
                <div className="relative mx-auto flex min-h-[58vh] max-w-[1440px] flex-col justify-end px-5 pb-14 pt-28 md:px-8">
                    <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-white/70">THE BOUTIQUE</p>
                    <h1 className="mt-3 font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight text-white md:text-7xl">Store</h1>
                    <p className="mt-2 text-sm uppercase tracking-[0.3em] text-white/55">SHOP</p>
                    <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-white/80">
                        Clothing only. Private client &amp; public lines for young women 18–25.
                    </p>
                </div>
            </section>

            <section className="border-b border-black/10 bg-[#0A0A0A] text-white">
                <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-6 px-5 py-8 md:flex-row md:justify-between md:px-8">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/50">COUNTDOWN</p>
                        <p className="mt-2 font-display text-lg font-semibold uppercase tracking-wide md:text-xl">
                            SATURNA Online Boutique Launch · China / Hong Kong / Worldwide
                        </p>
                    </div>
                    {countdown.done ? (
                        <p className="font-display text-2xl font-bold uppercase tracking-[0.2em]">Now Open</p>
                    ) : (
                        <div className="flex gap-3">
                            {[
                                ['Days', countdown.days],
                                ['Hrs', countdown.hours],
                                ['Min', countdown.minutes],
                                ['Sec', countdown.seconds],
                            ].map(([label, value]) => (
                                <div key={label} className="min-w-[4rem] border border-white/20 bg-white/5 px-3 py-2 text-center">
                                    <p className="font-display text-2xl font-bold tabular-nums">{String(value).padStart(2, '0')}</p>
                                    <p className="text-[9px] uppercase tracking-[0.25em] text-white/60">{label}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section id="collections" className="mx-auto max-w-[1440px] px-5 py-16 md:px-8 md:py-24">
                <h2 className="font-display text-3xl font-semibold uppercase tracking-[0.06em] md:text-4xl">Collections</h2>
                <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-neutral-500">18–25 · Street &amp; Night</p>
                <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-6">
                    {COLLECTIONS.map((c) => (
                        <a key={c.en} href="#catalog" className="group block">
                            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-200">
                                <img src={c.img} alt={c.local} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                                    <p className="text-[9px] uppercase tracking-[0.2em] text-white/65">{c.en}</p>
                                    <p className="mt-0.5 font-display text-lg font-semibold uppercase">{c.local}</p>
                                    <p className="mt-1 text-[9px] tracking-[0.15em] text-white/70">{c.tag}</p>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </section>

            <section className="border-y border-black/5 bg-white px-5 py-16 md:px-8 md:py-24">
                <div className="mx-auto max-w-[1440px]">
                    <h2 className="font-display text-3xl font-semibold uppercase md:text-4xl">Casual</h2>
                    <p className="mt-2 max-w-lg text-sm text-neutral-500">Street looks for a young clientele — tees, crops, cargo and lace.</p>
                    <div className="mt-12 space-y-16">
                        {CASUAL_GROUPS.map((g) => (
                            <div key={g.en}>
                                <div className="mb-6 flex items-end justify-between border-b border-black/10 pb-4">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">{g.en}</p>
                                        <h3 className="font-display text-2xl font-bold uppercase md:text-3xl">{g.local}</h3>
                                    </div>
                                </div>
                                <div className={`grid gap-3 ${g.items.length === 4 ? 'grid-cols-2 md:grid-cols-4' : g.items.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
                                    {g.items.map((m) => (
                                        <div key={m.name} className="group relative aspect-[3/4] overflow-hidden bg-neutral-100">
                                            <img src={m.img} alt={m.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                                <p className="text-sm font-medium text-white">{m.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="sticky top-[5.5rem] z-30 border-b border-black/10 bg-[#F7F5F0]/95 backdrop-blur-md md:top-[6.25rem]">
                <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-8">
                    <div className="flex flex-wrap gap-2">
                        <FilterChip active={tier === 'all'} onClick={() => setTier('all')}>
                            All
                        </FilterChip>
                        <FilterChip active={tier === 'privados'} onClick={() => setTier('privados')}>
                            <Lock className="mr-1.5 inline h-3 w-3" strokeWidth={1.5} />
                            Private Client
                        </FilterChip>
                        <FilterChip active={tier === 'publico'} onClick={() => setTier('publico')}>
                            <Users className="mr-1.5 inline h-3 w-3" strokeWidth={1.5} />
                            Public Line
                        </FilterChip>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto">
                        <FilterChip active={activeCat === 'all'} onClick={() => setActiveCat('all')}>
                            Category
                        </FilterChip>
                        {categories.map((c) => (
                            <FilterChip key={c.id} active={activeCat === c.id} onClick={() => setActiveCat(c.id)}>
                                {c.title}
                            </FilterChip>
                        ))}
                    </div>
                </div>
            </section>

            <section id="catalog" className="mx-auto max-w-[1440px] scroll-mt-40 px-5 py-16 md:px-8 md:py-24">
                <h2 className="mb-10 font-display text-3xl font-bold uppercase tracking-tight md:text-4xl">Available Now</h2>
                {loading ? (
                    <div className="flex min-h-[30vh] items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" strokeWidth={1.5} />
                    </div>
                ) : error ? (
                    <p className="py-20 text-center text-sm text-neutral-500">{error}</p>
                ) : filtered.length === 0 ? (
                    <div className="mx-auto max-w-lg py-20 text-center">
                        <img src={LOGO} alt="SATURNA" className="mx-auto mb-6 h-14 w-auto max-w-[16rem] object-contain" />
                        <p className="font-display text-3xl font-semibold uppercase">Collection in Preparation</p>
                        <p className="mt-4 text-sm font-light text-neutral-500">
                            The SATURNA online boutique is launching soon. Contact customerservice@saturna-fashions.com to arrange a private viewing.
                        </p>
                        <a
                            href="mailto:customerservice@saturna-fashions.com"
                            className="mt-8 inline-flex items-center gap-3 border border-black bg-black px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white hover:bg-[#5A1825] hover:border-[#5A1825]"
                        >
                            Contact the Studio
                            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                        </a>
                    </div>
                ) : activeCat === 'all' && groupedByCategory.length > 1 ? (
                    <div className="space-y-16">
                        {groupedByCategory.map(([title, items]) => (
                            <div key={title}>
                                <div className="mb-6 flex items-end justify-between border-b border-black/10 pb-4">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">Category</p>
                                        <h3 className="font-display text-2xl font-bold uppercase md:text-3xl">{title}</h3>
                                    </div>
                                    <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">{items.length} items</span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6">
                                    {items.map((p, i) => (
                                        <ProductCard key={p.id} product={p} index={i} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6">
                        {filtered.map((p, i) => (
                            <ProductCard key={p.id} product={p} index={i} />
                        ))}
                    </div>
                )}
            </section>

            <section className="border-t border-black/10 bg-white px-5 py-16 text-center md:px-8">
                <p className="font-display text-3xl font-semibold uppercase md:text-4xl">Can&apos;t find the right piece?</p>
                <p className="mx-auto mt-4 max-w-md text-sm font-light text-neutral-500">Contact SATURNA for a bespoke private client selection.</p>
                <a
                    href="mailto:customerservice@saturna-fashions.com"
                    className="mt-8 inline-flex items-center gap-3 border-b border-black pb-1 text-[11px] font-semibold uppercase tracking-[0.3em] hover:text-[#5A1825]"
                >
                    Contact the Studio / ATELIER
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                </a>
            </section>

            <footer className="border-t border-black/10 bg-[#0A0A0A] px-5 py-12 text-[#F7F5F0] md:px-8">
                <div className="mx-auto grid max-w-[1440px] gap-8 md:grid-cols-3">
                    <div>
                        <img src={LOGO} alt="SATURNA" className="h-10 w-auto max-w-[12rem] object-contain brightness-0 invert" />
                        <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-white/40">China · Hong Kong · USA · Colombia</p>
                    </div>
                    <div className="text-sm font-light leading-relaxed text-white/70">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/45">Office</p>
                        <p className="mt-2">SWU-VISION GROUP LIMITED</p>
                        <p>Unit 2904-05, 29/F, Universal Trade Centre</p>
                        <p>3 Arbuthnot Road, Central</p>
                        <p>Hong Kong S.A.R.</p>
                        <p className="mt-1 text-white/40">Reg. 80605496</p>
                    </div>
                    <div className="flex flex-col gap-2 md:items-end">
                        <Link to="/about" className="text-[11px] uppercase tracking-[0.25em] text-white/60 hover:text-white">
                            About
                        </Link>
                        <Link to="/legal" className="text-[11px] uppercase tracking-[0.25em] text-white/60 hover:text-white">
                            Legal Centre
                        </Link>
                        <a href="mailto:customerservice@saturna-fashions.com" className="text-sm text-white/70 hover:text-white">
                            customerservice@saturna-fashions.com
                        </a>
                    </div>
                </div>
                <p className="mx-auto mt-10 max-w-[1440px] text-center text-[10px] uppercase tracking-[0.2em] text-white/35">
                    © 2026 SATURNA™ · SWU-VISION GROUP LIMITED · Hong Kong S.A.R.
                </p>
            </footer>
        </div>
    );
}
