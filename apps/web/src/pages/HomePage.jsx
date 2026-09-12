import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Menu, X, Loader2, Plus, ArrowRight, ArrowUpRight, MapPin, Mail, Clock, Instagram } from 'lucide-react';
import { getProducts, getCategories } from '@/api/EcommerceApi';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { CurrencySelector, useGeoMarket } from '@/context/CurrencyContext';
import Seo from '@/components/Seo';
import LegalPolicies from '@/components/LegalPolicies';
import RegionSwitcher from '@/components/RegionSwitcher';
import { SATURNA_LOGO, SATURNA_OG_IMAGE } from '@/lib/brand';
const LOGO = SATURNA_LOGO;

/* Editorial photography — SATURNA dark modern luxury */
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
  body: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/6463e4a6ae2196508e930e0c6697b1fd.jpg'
};
const COLLECTIONS = [{
  en: 'CORSETS',
  local: 'Corsets',
  tag: 'Structure / Femininity / Attitude',
  cta: 'Shop Corsets',
  img: IMG.satin,
  href: '#new'
}, {
  en: 'CARGO',
  local: 'Cargo',
  tag: 'Street / 18–25 / Silhouette',
  cta: 'Shop Cargo',
  img: IMG.street,
  href: '#new'
}, {
  en: 'LACE',
  local: 'Lace',
  tag: 'Everyday Dark Elegance',
  cta: 'Shop Lace',
  img: IMG.laceDress,
  href: '#new'
}, {
  en: 'JACKETS',
  local: 'Jackets',
  tag: 'The Statement Piece',
  cta: 'Shop Jackets',
  img: IMG.hero,
  href: '#new'
}, {
  en: 'DRESSES',
  local: 'Dresses',
  tag: 'After Dark',
  cta: 'Shop Dresses',
  img: IMG.dress,
  href: '#new'
}];
const NAV = [{
  label: 'New In',
  href: '#new'
}, {
  label: 'Collections',
  href: '#collections'
}, {
  label: 'Clothing',
  href: '#collections'
}, {
  label: 'Limited Edition',
  href: '#limited'
}, {
  label: 'World of SATURNA',
  href: '#woman'
}, {
  label: 'Store',
  href: '/store'
}, {
  label: 'About',
  href: '/about'
}, {
  label: '🇺🇸 USA',
  href: '/us'
}, {
  label: '🇨🇴 CO',
  href: '/co'
}, {
  label: '🇭🇰 HK',
  href: '/hk'
}, {
  label: '🇨🇳 China',
  href: '/cn'
}];
const TRUST = [{
  en: 'Secure Payment',
  sub: 'PCI-DSS · SSL'
}, {
  en: 'Tracked Shipping',
  sub: 'China · Hong Kong · Worldwide'
}, {
  en: 'Customer Care',
  sub: 'Mon–Fri · 10h–18h HKT'
}, {
  en: 'Authentic SATURNA™',
  sub: 'Guaranteed genuine'
}];
function Header({
  onOpenCart,
  cartCount
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const navCls = 'text-[11px] font-medium uppercase tracking-[0.2em] text-black/70 transition-colors hover:text-black';
  return <>
            <div className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-[#F7F5F0]">
                <div className="flex items-center justify-center gap-4 border-b border-black/5 px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                    <span>USA · COLOMBIA · HONG KONG / CHINA</span>
                    <span className="text-neutral-300">·</span>
                    <RegionSwitcher light />
                </div>
                <header className={`mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-3.5 transition-shadow md:px-8 ${scrolled ? 'shadow-[0_1px_0_rgba(0,0,0,0.06)]' : ''}`}>
                    <div className="flex min-w-0 items-center gap-3">
                        <button type="button" className="text-black md:hidden" onClick={() => setOpen(true)} aria-label="Menu">
                            <Menu className="h-5 w-5" strokeWidth={1.25} />
                        </button>
                        <Link to="/" className="font-display text-lg font-semibold uppercase tracking-[0.28em] text-black md:text-xl">
                            SATURNA<sup className="ml-0.5 text-[0.45em]">™</sup>
                        </Link>
                    </div>

                    <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
                        {NAV.map(n => n.href.startsWith('/') ? <Link key={n.label} to={n.href} className={navCls}>
                                    {n.label}
                                </Link> : <a key={n.label} href={n.href} className={navCls}>
                                    {n.label}
                                </a>)}
                    </nav>

                    <div className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.18em] text-black/70 md:gap-4">
                        <button type="button" className="hidden transition-colors hover:text-black sm:inline">
                            Search
                        </button>
                        <Link to="/about" className="hidden transition-colors hover:text-black md:inline">
                            Account
                        </Link>
                        <button type="button" onClick={onOpenCart} className="relative transition-colors hover:text-black" aria-label="Bag">
                            BAG{cartCount > 0 ? ` (${cartCount})` : ''}
                        </button>
                    </div>
                </header>
            </div>

            {open ? <div className="fixed inset-0 z-[60] bg-[#F7F5F0] md:hidden">
                    <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
                        <span className="font-display text-lg font-semibold uppercase tracking-[0.28em] text-black">
                            SATURNA™
                        </span>
                        <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                            <X className="h-5 w-5 text-black" strokeWidth={1.25} />
                        </button>
                    </div>
                    <nav className="flex flex-col px-5 pt-4">
                        {NAV.map(n => n.href.startsWith('/') ? <Link key={n.label} to={n.href} onClick={() => setOpen(false)} className="flex items-baseline justify-between border-b border-black/10 py-5">
                                    <span className="font-display text-2xl font-medium uppercase tracking-[0.08em] text-black">
                                        {n.label}
                                    </span>
                                </Link> : <a key={n.label} href={n.href} onClick={() => setOpen(false)} className="flex items-baseline justify-between border-b border-black/10 py-5">
                                    <span className="font-display text-2xl font-medium uppercase tracking-[0.08em] text-black">
                                        {n.label}
                                    </span>
                                </a>)}
                    </nav>
                    <div className="mt-8 space-y-3 px-5 text-[11px] uppercase tracking-[0.2em] text-neutral-600">
                        <RegionSwitcher light />
                    </div>
                </div> : null}
        </>;
}
function Hero() {
  const reduce = useReducedMotion();
  return <section className="relative mt-[88px] min-h-[min(92dvh,900px)] w-full overflow-hidden bg-[#F7F5F0]">
            <motion.img src={IMG.hero} alt="SATURNA — Dark Femininity" className="absolute inset-0 h-full w-full object-cover object-[center_20%]" initial={reduce ? {} : {
      scale: 1.04
    }} animate={reduce ? {} : {
      scale: 1
    }} transition={{
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1]
    }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/10" />
            <div className="relative z-10 mx-auto flex min-h-[min(92dvh,900px)] max-w-[1440px] flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-24">
                <p className="mb-3 font-display text-sm font-medium uppercase tracking-[0.4em] text-white/90 md:text-base">
                    SATURNA™
                </p>
                <h1 className="max-w-3xl font-display text-5xl font-semibold uppercase leading-[0.92] tracking-[0.04em] text-white md:text-7xl lg:text-8xl">
                    Dark Femininity
                </h1>
                <p className="mt-4 text-sm tracking-[0.28em] text-white/80 md:text-base">
                    Aesthetic · Power · Freedom
                </p>
                <p className="mt-6 max-w-md text-sm leading-relaxed text-white/80 md:text-base">
                    Dresses, bodysuits, tailoring and silk — designed for women who turn the night
                    into their own territory.
                </p>
                <div className="mt-10 flex flex-wrap gap-3">
                    <a href="#new" className="inline-flex items-center bg-white px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-black transition-colors hover:bg-[#F7F5F0]">
                        Shop New In
                    </a>
                    <Link to="/store" className="inline-flex items-center border border-white/70 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-white hover:text-black">
                        Online Boutique
                    </Link>
                </div>
            </div>
        </section>;
}
const placeholderImage =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUzMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjdGNUYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzVBMTgyNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlNBVFVSTkE8L3RleHQ+PC9zdmc+';

const stripHtml = (html) => (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

function mapLiveProduct(p, i, categoryMap) {
  const cents = p.variants?.[0]?.price_in_cents ?? p.price_in_cents ?? 0;
  const img = p.image || p.images?.[0]?.url || placeholderImage;
  const catId = p.collections?.[0]?.collection_id;
  return {
    id: p.id || `live-${i}`,
    num: String(i + 1).padStart(2, '0'),
    title: (p.title || 'SATURNA Piece').toUpperCase(),
    subtitle: p.subtitle || (p.description?.slice(0, 48)) || 'SATURNA Collection',
    priceUsdCents: cents,
    image: img,
    hover: img,
    category: (catId && categoryMap?.[catId]) || 'SATURNA',
    live: true,
    raw: p
  };
}
function ProductCard({
  product,
  formatFromUsdCents,
  onAdd,
  index,
  currencyCode
}) {
  const [hover, setHover] = useState(false);
  const price = product.priceUsdCents != null ? formatFromUsdCents(product.priceUsdCents) : product.priceLabel || '';
  const desc = stripHtml(product.raw?.description || product.description || '');
  return <article className="group" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-200">
                <img src={hover && product.hover ? product.hover : product.image} alt={product.title} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" loading="lazy" onError={(e) => { const t = e.currentTarget; if (t.dataset.fallback) return; t.dataset.fallback = '1'; t.src = placeholderImage; }} />
                {product.limited ? <span className="absolute left-3 top-3 bg-[#5A1825] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white">
                        Limited
                    </span> : <span className="absolute left-3 top-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white/90 drop-shadow">
                        Quick View
                    </span>}
                <button type="button" onClick={() => onAdd(product)} className="absolute bottom-0 left-0 right-0 translate-y-full bg-black py-3 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-white transition-transform duration-300 group-hover:translate-y-0">
                    Add to Bag +
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
        </article>;
}
function JustIn({
  items,
  loading,
  formatFromUsdCents,
  onAdd,
  currencyCode
}) {
  return <section id="new" className="scroll-mt-28 bg-[#F7F5F0] px-5 py-20 md:px-8 md:py-28">
            <div className="mx-auto max-w-[1440px]">
                <div className="mb-12 flex flex-col gap-2 md:mb-16 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="font-display text-4xl font-semibold uppercase tracking-[0.06em] text-black md:text-5xl">
                            Just In
                        </h2>
                        <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-neutral-500">
                            NEW SEASON · 2026
                        </p>
                    </div>
                    <p className="max-w-sm text-sm leading-relaxed text-neutral-500">
                        Structured silhouettes. Dark femininity. Pieces designed for the modern SATURNA woman.
                    </p>
                </div>

                {loading ? <div className="flex justify-center py-24">
                        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" strokeWidth={1.5} />
                    </div> : items.length === 0 ? <div className="flex flex-col items-center justify-center py-24 text-center">
                        <p className="font-display text-xl font-semibold uppercase tracking-[0.08em] text-black">Catalogue empty</p>
                        <p className="mt-3 max-w-sm text-sm font-light leading-relaxed text-neutral-500">The boutique catalogue is not returning products at this time. Please check back later.</p>
                    </div> : <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-6 md:gap-y-16">
                        {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} formatFromUsdCents={formatFromUsdCents} onAdd={onAdd} currencyCode={currencyCode} />)}
                    </div>}
            </div>
        </section>;
}
function Collections() {
  return <section id="collections" className="scroll-mt-28 border-t border-black/5 bg-white px-5 py-20 md:px-8 md:py-28">
            <div className="mx-auto max-w-[1440px]">
                <h2 className="mb-3 font-display text-3xl font-semibold uppercase tracking-[0.08em] text-black md:text-4xl">
                    Collections
                </h2>
                <p className="mb-14 text-[11px] uppercase tracking-[0.28em] text-neutral-500">SATURNA / Ready-to-wear · 18–25</p>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {COLLECTIONS.map(c => <a key={c.en} href={c.href} className="group block">
                            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                                <img src={c.img} alt={c.en} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" loading="lazy" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/70">{c.local}</p>
                                    <h3 className="mt-1 font-display text-2xl font-semibold uppercase tracking-[0.08em]">
                                        {c.en}
                                    </h3>
                                    <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/75">{c.tag}</p>
                                    <span className="mt-5 inline-block border-b border-white/80 pb-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors group-hover:border-white">
                                        {c.cta}
                                    </span>
                                </div>
                            </div>
                        </a>)}
                </div>
            </div>
        </section>;
}
function LimitedEdition({
  onDiscover
}) {
  return <section id="limited" className="scroll-mt-28 bg-[#0A0A0A] px-5 py-24 md:px-8 md:py-32">
            <div className="mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-2 lg:gap-16">
                <div className="relative aspect-[4/5] overflow-hidden md:aspect-[3/4]">
                    <img src={IMG.coat} alt="SATURNA Limited Edition" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
                </div>
                <div className="text-white">
                    <p className="text-[11px] uppercase tracking-[0.35em] text-[#A3182B]">SATURNA</p>
                    <h2 className="mt-4 font-display text-5xl font-semibold uppercase leading-none tracking-[0.04em] md:text-6xl lg:text-7xl">
                        Limited
                        <br />
                        Edition
                    </h2>
                    <p className="mt-4 text-sm tracking-[0.2em] text-white/50">Few pieces · One identity</p>
                    <p className="mt-8 max-w-md text-sm leading-relaxed text-white/70">
                        A selection of creations produced in limited quantity — sculptural coats,
                        lace and evening silhouettes. Each piece, its own universe.
                    </p>
                    <button type="button" onClick={onDiscover} className="mt-10 inline-flex items-center bg-[#5A1825] px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#6e1e2e]">
                        Discover
                    </button>
                </div>
            </div>
        </section>;
}
function SaturnaWoman() {
  return <section id="woman" className="scroll-mt-28 bg-[#F7F5F0]">
            <div className="relative min-h-[70vh] w-full overflow-hidden md:min-h-[85vh]">
                <img src={IMG.blouse} alt="The SATURNA Woman" className="absolute inset-0 h-full w-full object-cover object-center" />
                <div className="absolute inset-0 bg-black/35" />
                <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-[900px] flex-col items-center justify-center px-6 py-24 text-center text-white md:min-h-[85vh]">
                    <h2 className="font-display text-4xl font-semibold uppercase tracking-[0.1em] md:text-6xl">
                        The SATURNA Woman
                    </h2>
                    <p className="mt-5 text-sm tracking-[0.35em] text-white/80">Confidence · Mystery · Independence</p>
                    <p className="mt-10 max-w-lg font-display text-xl font-light italic leading-snug tracking-wide text-white/90 md:text-2xl">
                        She doesn&apos;t follow the silhouette.
                        <br />
                        She defines it.
                    </p>
                    <Link to="/about" className="mt-10 inline-flex items-center gap-2 border-b border-white/80 pb-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:border-white">
                        Discover the Maison
                        <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                    </Link>
                </div>
            </div>
        </section>;
}
function Atelier() {
  return <section id="atelier" className="border-t border-black/5 bg-white px-5 py-20 md:px-8 md:py-28">
            <div className="mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-2 lg:gap-16">
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                    <img src={IMG.laceDress} alt="Atelier SATURNA" className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div>
                    <p className="text-[11px] uppercase tracking-[0.35em] text-[#5A1825]">The Atelier</p>
                    <h2 className="mt-4 font-display text-4xl font-semibold uppercase leading-[0.95] tracking-[0.04em] text-black md:text-5xl">
                        Dark fashion.
                        <br />
                        Made with intention.
                    </h2>
                    <p className="mt-8 max-w-md text-sm leading-relaxed text-neutral-600">
                        Every SATURNA piece is developed between the creative studio and the
                        private client: prototypes, fittings and adjustments until the silhouette
                        feels like a second skin.
                    </p>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-400">
                        No filler. No filler details. Only silhouette, fabric, and the woman who
                        wears it.
                    </p>
                    <div className="mt-10 grid grid-cols-3 gap-6 border-t border-black/10 pt-8">
                        {[{
            v: 'USA',
            l: 'Business HQ'
          }, {
            v: 'CO',
            l: 'Creative Root'
          }, {
            v: 'DF',
            l: 'Dark Fashion'
          }].map(s => <div key={s.l}>
                                <p className="font-display text-3xl font-bold text-black md:text-4xl">{s.v}</p>
                                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-neutral-400">{s.l}</p>
                            </div>)}
                    </div>
                </div>
            </div>
        </section>;
}
function TrustBar() {
  return <div className="border-y border-black/8 bg-[#F7F5F0]">
            <div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-black/5 md:grid-cols-4">
                {TRUST.map(t => <div key={t.en} className="px-4 py-8 text-center">
                        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-black">{t.en}</p>
                        <p className="mt-1 text-[11px] text-neutral-400">{t.sub}</p>
                    </div>)}
            </div>
        </div>;
}
function Rendezvous() {
  const details = [{
    icon: MapPin,
    label: 'Office',
    value: 'Unit 2904-05, 29/F, Universal Trade Centre, 3 Arbuthnot Road, Central, Hong Kong S.A.R.'
  }, {
    icon: Mail,
    label: 'Customer Care',
    value: 'customerservice@saturna-fashions.com'
  }, {
    icon: Mail,
    label: 'Support',
    value: 'support@saturna-fashions.com'
  }, {
    icon: Clock,
    label: 'Hours',
    value: 'Mon – Fri, 10am – 6pm (ET)'
  }];
  return <section id="cita" className="scroll-mt-28 bg-white px-5 py-20 md:px-8 md:py-28">
            <div className="mx-auto max-w-4xl text-center">
                <p className="text-[11px] uppercase tracking-[0.5em] text-[#5A1825]">Appointment</p>
                <h2 className="mt-4 font-display text-5xl font-semibold uppercase leading-[0.9] tracking-[0.04em] text-black md:text-7xl">
                    By
                    <br />
                    Appointment Only
                </h2>
                <p className="mx-auto mt-8 max-w-lg text-sm leading-relaxed text-neutral-600">
                    Private fittings are unhurried. Write to SATURNA and we&apos;ll guide you through
                    a commission or the private client selection.
                </p>
                <a href="mailto:customerservice@saturna-fashions.com" className="mt-10 inline-flex items-center gap-3 bg-black px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-neutral-800 active:scale-[0.98]">
                    Request an Appointment
                    <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </a>

                <div className="mt-16 grid gap-8 border-t border-black/10 pt-12 sm:grid-cols-2 md:grid-cols-4">
                    {details.map(d => <div key={d.label}>
                            <d.icon className="mx-auto mb-3 h-5 w-5 text-[#5A1825]" strokeWidth={1.5} />
                            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400">{d.label}</p>
                            <p className="mt-2 text-sm font-light text-neutral-700">{d.value}</p>
                        </div>)}
                </div>
            </div>
        </section>;
}
function Newsletter() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const submit = e => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    setEmail('');
  };
  return <section id="newsletter" className="bg-[#F7F5F0] px-5 py-20 md:px-8 md:py-28">
            <div className="mx-auto max-w-3xl text-center">
                <p className="text-[11px] uppercase tracking-[0.5em] text-[#5A1825]">Newsletter</p>
                <h2 className="mt-4 font-display text-5xl font-semibold uppercase leading-[0.9] tracking-[0.04em] text-black md:text-6xl">
                    Join the
                    <br />
                    SATURNA Circle
                </h2>
                <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-neutral-600">
                    Early access to collections, private appointments and the online boutique
                    launch. No noise — just dark fashion.
                </p>
                {sent ? <p className="mx-auto mt-10 max-w-md border border-black/15 bg-white px-6 py-5 font-display text-xl font-semibold uppercase tracking-tight text-black">
                        Thank you — we&apos;ll be in touch soon.
                    </p> : <form onSubmit={submit} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" className="flex-1 border border-black/15 bg-white px-5 py-4 text-sm font-light text-black placeholder:text-neutral-400 focus:border-black focus:outline-none" />
                        <button type="submit" className="bg-black px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-neutral-800 active:scale-[0.98]">
                            Subscribe
                        </button>
                    </form>}
                <p className="mt-5 text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                    By subscribing you accept the Privacy Policy. No spam.
                </p>
            </div>
        </section>;
}
function Footer() {
  return <footer className="bg-ink text-paper">
            <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-8">
                <div className="grid gap-12 md:grid-cols-4">
                    <div className="md:col-span-1">
                        <p className="font-display text-xl font-semibold uppercase tracking-[0.28em] text-paper">
                            SATURNA™
                        </p>
                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-smoke">
                            Dark feminine fashion. USA · Colombia · Hong Kong / China. Apparel only.
                        </p>
                        <div className="mt-4">
                            <CurrencySelector />
                        </div>
                        <a href="https://instagram.com" className="mt-5 inline-flex items-center gap-2 text-silver transition-colors hover:text-violet-bright" aria-label="Instagram">
                            <Instagram className="h-5 w-5" strokeWidth={1.5} />
                        </a>
                    </div>
                    <div>
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-violet-bright">
                            Shop
                        </p>
                        <ul className="space-y-2 text-sm font-light text-smoke">
                            <li><Link to="/store" className="hover:text-paper">Online Boutique</Link></li>
                            <li><Link to="/elegancia" className="hover:text-paper">Espace Elegancia</Link></li>
                            <li><Link to="/us" className="hover:text-paper">🇺🇸 USA · USD</Link></li>
                            <li><Link to="/co" className="hover:text-paper">🇨🇴 Colombia · COP</Link></li>
                            <li><Link to="/hk" className="hover:text-paper">🇭🇰 Hong Kong · HKD</Link></li>
                            <li><Link to="/cn" className="hover:text-paper">🇨🇳 China / HK</Link></li>
                            <li><a href="#new" className="hover:text-paper">New In</a></li>
                            <li><a href="#limited" className="hover:text-paper">Limited Edition</a></li>
                        </ul>
                    </div>
                    <div>
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-violet-bright">
                            Contact
                        </p>
                        <ul className="space-y-2 text-sm font-light text-smoke">
                            <li><a href="mailto:customerservice@saturna-fashions.com" className="hover:text-paper">customerservice@saturna-fashions.com</a></li>
                            <li><a href="mailto:support@saturna-fashions.com" className="hover:text-paper">support@saturna-fashions.com</a></li>
                            <li><a href="mailto:servicelegals@saturna-fashions.com" className="hover:text-paper">servicelegals@saturna-fashions.com</a></li>
                        </ul>
                    </div>
                    <div>
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-violet-bright">
                            Corporate
                        </p>
                        <ul className="space-y-2 text-sm font-light text-smoke">
                            <li>SWU-VISION GROUP LIMITED</li>
                            <li>注册编号 Reg. 80605496</li>
                            <li>Unit 2904-05, 29/F, Universal Trade Centre</li>
                            <li>3 Arbuthnot Road, Central</li>
                            <li>Hong Kong S.A.R.</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-border pt-8">
                    <p className="text-center text-[11px] font-light leading-relaxed text-smoke md:text-left">
                        © 2026 Swu-vision CORPORATION. All rights reserved. SATURNA™ Dark
                        Fashion. Legal contact for claims:{' '}
                        <a href="mailto:servicelegals@saturna-fashions.com" className="text-silver hover:text-paper">
                            servicelegals@saturna-fashions.com
                        </a>
                        {' · '}
                        Claims service:{' '}
                        <a href="mailto:support@saturna-fashions.com" className="text-silver hover:text-paper">
                            support@saturna-fashions.com
                        </a>
                    </p>
                </div>
            </div>
            <LegalPolicies />
        </footer>;
}
export default function HomePage() {
  const {
    formatFromUsdCents,
    market
  } = useGeoMarket();
  const {
    addToCart,
    cartItems
  } = useCart();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [products, setProducts] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    getProducts({
      limit: 100,
      order: 'DESC',
      sort_by: 'created_at'
    }).then(res => {
      if (cancelled) return;
      setProducts(res.products || []);
    }).catch(() => {
      if (!cancelled) setProducts([]);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    getCategories().then(res => {
      if (cancelled) return;
      const map = {};
      (res.categories || []).forEach(c => { map[c.id] = c.title; });
      setCategoryMap(map);
    }).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  const cartCount = (cartItems || []).reduce((n, i) => n + (i.quantity || 0), 0);
  const displayItems = useMemo(() => {
    if (products && products.length > 0) {
      return products.map((p, i) => mapLiveProduct(p, i, categoryMap));
    }
    return [];
  }, [products, categoryMap]);
  const openCart = useCallback(() => {
    window.dispatchEvent(new CustomEvent('saturna:open-cart'));
  }, []);
  const onAdd = useCallback(async product => {
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
          media: [{
            url: product.image
          }]
        };
        const fakeVariant = {
          id: `${product.id}-default`,
          title: 'Default',
          price_in_cents: product.priceUsdCents,
          manage_inventory: false
        };
        await addToCart(fakeProduct, fakeVariant, 1, 99);
      }
      toast({
        title: 'Added to bag',
        description: product.title
      });
      openCart();
    } catch (err) {
      toast({
        title: 'Could not add',
        description: err?.message || 'Please try again.',
        variant: 'destructive'
      });
    }
  }, [addToCart, toast, openCart, navigate]);
  return <div className="min-h-screen bg-[#F7F5F0] font-body text-black antialiased">
            <Helmet>
                <html lang="en" />
                <title>SATURNA — Dark Fashion | USA · Colombia · Asia</title>
                <meta name="description" content="SATURNA dark feminine fashion. Dresses, bodysuits, tailoring and silk. Online boutique for USA, Colombia, Hong Kong and China. Private and public clients." />
                <link rel="icon" type="image/png" href={SATURNA_LOGO} />
            </Helmet>
            <Seo title="SATURNA — Dark Fashion" description="SATURNA dark feminine fashion. Dresses, bodysuits, tailoring and silk. Boutique for USA, Colombia, Hong Kong and China." image={SATURNA_OG_IMAGE} siteName="SATURNA" />
            <Header onOpenCart={openCart} cartCount={cartCount} />
            <main>
                <Hero />
                <JustIn items={displayItems} loading={loading} formatFromUsdCents={formatFromUsdCents} onAdd={onAdd} currencyCode={market?.currency?.code} />
                <Collections />
                <LimitedEdition onDiscover={() => {
        document.getElementById('new')?.scrollIntoView({
          behavior: reduce ? 'auto' : 'smooth'
        });
      }} />
                <SaturnaWoman />
                <Atelier />
                <TrustBar />
                <Rendezvous />
                <Newsletter />
            </main>
            <Footer />
        </div>;
}