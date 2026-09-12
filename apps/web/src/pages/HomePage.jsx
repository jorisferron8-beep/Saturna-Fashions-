import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import BrandHeader from '@/components/BrandHeader';
import BrandFooter from '@/components/BrandFooter';
import PieceCard, { addPieceToCart } from '@/components/PieceCard';
import AutoCrossfade from '@/components/AutoCrossfade';
import Seo from '@/components/Seo';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { useGeoMarket } from '@/context/CurrencyContext';
import { SATURNA_OG_IMAGE } from '@/lib/brand';
import { PHOTOS } from '@/lib/brandImagery';
import { COLLECTIONS, LOOKS, STORIES, getProduct, getProductsByCollection, getLookProducts } from '@/lib/saturnaCollections';

const NEW_DROP_SKUS = ['SAT-101', 'SAT-201', 'SAT-301', 'SAT-401'];
const EDIT_SKUS = ['SAT-101', 'SAT-201', 'SAT-303', 'SAT-105', 'SAT-402', 'SAT-306', 'SAT-206', 'SAT-505'];
const FEATURED_LOOK = LOOKS[0]; // Rebel Night

function Hero() {
  return (
    <section className="relative flex min-h-[92dvh] items-end overflow-hidden bg-[#0A0A0A]">
      <img src={PHOTOS.streetLuxeBomber} alt="SATURNA — Dark. Feminine. Unbound." className="absolute inset-0 h-full w-full object-cover object-[center_20%]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/15" />
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col justify-end px-5 pb-20 pt-32 md:px-8 md:pb-28">
        <h1 className="font-display text-6xl font-bold uppercase leading-[0.88] tracking-tight text-white md:text-8xl lg:text-9xl">
          SATURNA
        </h1>
        <p className="mt-4 font-display text-xl font-semibold uppercase tracking-[0.2em] text-[#A3182B] md:text-3xl">
          Dark. Feminine. Unbound.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href="#new-drop" className="inline-flex items-center bg-white px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-black transition-colors hover:bg-[#F7F5F0]">
            Shop New Collection
          </a>
          <a href="#collections" className="inline-flex items-center border border-white/70 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-white hover:text-black">
            Discover SATURNA
          </a>
        </div>
      </div>
    </section>
  );
}

function NewDrop() {
  const pieces = NEW_DROP_SKUS.map(getProduct).filter(Boolean);
  return (
    <section id="new-drop" className="scroll-mt-24 bg-[#0A0A0A] px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-12 flex flex-col gap-2 md:mb-16 md:flex-row md:items-end md:justify-between">
          <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-white md:text-6xl">The New Drop</h2>
          <p className="max-w-sm text-sm font-light leading-relaxed text-smoke">
            Six pieces, four silhouettes, one attitude — the first edit of the new SATURNA season.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-2 lg:gap-8">
          <div className="relative aspect-[4/5] overflow-hidden lg:aspect-auto">
            <img src={PHOTOS.darkCityCrosswalk} alt="SATURNA — The New Drop" className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div className="grid grid-cols-2 gap-5 md:gap-6">
            {pieces.map((p) => <PieceCard key={p.sku} piece={p} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function ShopTheEdit() {
  const scrollerRef = useRef(null);
  const pieces = useMemo(() => EDIT_SKUS.map(getProduct).filter(Boolean), []);

  const scrollBy = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: 'smooth' });
  };

  return (
    <section className="border-t border-white/5 bg-[#0A0A0A] py-20 md:py-28">
      <div className="mx-auto flex max-w-[1440px] items-end justify-between px-5 md:px-8">
        <div>
          <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-white md:text-5xl">Shop the Edit</h2>
          <p className="mt-2 max-w-md text-sm font-light leading-relaxed text-smoke">
            Swipe through a mix pulled from every collection.
          </p>
        </div>
        <div className="hidden shrink-0 gap-2 md:flex">
          <button type="button" onClick={() => scrollBy(-1)} aria-label="Previous" className="border border-white/20 p-2.5 text-white transition-colors hover:border-white">
            <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button type="button" onClick={() => scrollBy(1)} aria-label="Next" className="border border-white/20 p-2.5 text-white transition-colors hover:border-white">
            <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <div
        ref={scrollerRef}
        className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {pieces.map((p) => (
          <div key={p.sku} className="w-[62%] shrink-0 snap-start sm:w-[34%] lg:w-[22%]">
            <PieceCard piece={p} />
          </div>
        ))}
      </div>
    </section>
  );
}

function CollectionsGallery() {
  return (
    <section id="collections" className="scroll-mt-24 bg-[#F7F5F0] px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1440px]">
        <h2 className="mb-3 font-display text-4xl font-bold uppercase tracking-tight text-black md:text-5xl">Collections</h2>
        <p className="mb-14 max-w-lg text-sm font-light leading-relaxed text-neutral-500">
          Five collections, one identity. Each edit brings its own silhouette, mood and pace.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {COLLECTIONS.map((c) => {
            const preview = [c.image, ...getProductsByCollection(c.slug).slice(0, 2).map((p) => p.image)];
            return (
            <Link key={c.slug} to={`/collections/${c.slug}`} className="group relative block aspect-[4/5] overflow-hidden bg-neutral-900">
              <AutoCrossfade images={preview} alt={c.name} className="transition-transform duration-700 group-hover:scale-[1.04]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/70">{c.nameZh}</p>
                <h3 className="mt-1 font-display text-2xl font-bold uppercase tracking-tight">{c.name}</h3>
                <p className="mt-2 max-w-xs text-xs font-light leading-relaxed text-white/75">{c.tagline}</p>
                <span className="mt-5 inline-flex items-center gap-2 border-b border-white/80 pb-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors group-hover:border-white">
                  Explore Collection <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                </span>
              </div>
            </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ShopTheLook() {
  const [active, setActive] = useState(null);
  const { formatFromUsdCents } = useGeoMarket();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const pieces = useMemo(() => getLookProducts(FEATURED_LOOK), []);
  const total = pieces.reduce((n, p) => n + p.priceInCents, 0);

  const addOne = async (piece) => {
    try {
      await addPieceToCart(piece, addToCart);
      toast({ title: 'Added to your bag', description: piece.name });
    } catch (err) {
      toast({ title: 'Could not add', description: err?.message || 'Please try again.', variant: 'destructive' });
    }
  };

  const addAll = async () => {
    for (const piece of pieces) {
      // eslint-disable-next-line no-await-in-loop
      await addPieceToCart(piece, addToCart);
    }
    toast({ title: 'Look added to your bag', description: `${FEATURED_LOOK.name} · ${pieces.length} pieces` });
    window.dispatchEvent(new CustomEvent('saturna:open-cart'));
  };

  return (
    <section id="shop-the-look" className="scroll-mt-24 border-t border-white/5 bg-[#0A0A0A] px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1440px]">
        <h2 className="mb-3 font-display text-4xl font-bold uppercase tracking-tight text-white md:text-5xl">Shop the Look</h2>
        <p className="mb-12 max-w-lg text-sm font-light leading-relaxed text-smoke">
          {FEATURED_LOOK.name} — tap a marker to see the piece, or shop the entire look in one move.
        </p>

        <div className="relative mx-auto aspect-[3/4] max-w-2xl overflow-hidden bg-neutral-900 md:aspect-video md:max-w-none">
          <img src={FEATURED_LOOK.image} alt={FEATURED_LOOK.name} className="h-full w-full object-cover" loading="lazy" />
          {FEATURED_LOOK.hotspots.map((h, i) => {
            const piece = pieces.find((p) => p.sku === h.sku);
            if (!piece) return null;
            const isActive = active === h.sku;
            return (
              <motion.div
                key={h.sku}
                className="absolute"
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
                initial={{ opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  type="button"
                  onClick={() => setActive(isActive ? null : h.sku)}
                  aria-label={`${piece.name} — ${formatFromUsdCents(piece.priceInCents)}`}
                  className={`flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#5A1825]/90 text-white shadow-lg transition-transform ${isActive ? 'scale-110' : 'animate-pulse'}`}
                >
                  <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
                {isActive ? (
                  <div className="absolute left-1/2 top-9 z-20 w-56 -translate-x-1/2 border border-white/10 bg-[#0A0A0A]/95 p-4 text-left shadow-2xl backdrop-blur">
                    <p className="font-display text-sm font-semibold uppercase tracking-wide text-white">{piece.name}</p>
                    <p className="mt-1 text-xs font-medium text-[#A3182B]">{formatFromUsdCents(piece.priceInCents)}</p>
                    <div className="mt-3 flex gap-2">
                      <Link to={`/piece/${piece.sku}`} className="flex-1 border border-white/25 px-2 py-2 text-center text-[9px] font-semibold uppercase tracking-[0.18em] text-white hover:border-white">
                        View
                      </Link>
                      <button type="button" onClick={() => addOne(piece)} className="flex-1 bg-[#5A1825] px-2 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white hover:bg-[#6e1e2e]">
                        Add
                      </button>
                    </div>
                  </div>
                ) : null}
              </motion.div>
            );
          })}
        </div>

        <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-4 border border-white/10 bg-white/[0.03] p-6 sm:flex-row sm:items-center sm:justify-between md:max-w-none">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-light text-smoke">
            {pieces.map((p, i) => (
              <motion.span
                key={p.sku}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.35 }}
              >
                {p.name} — {formatFromUsdCents(p.priceInCents)}{i < pieces.length - 1 ? ' +' : ''}
              </motion.span>
            ))}
          </div>
          <button
            type="button"
            onClick={addAll}
            className="inline-flex shrink-0 items-center justify-center gap-2 bg-[#5A1825] px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#6e1e2e]"
          >
            Shop This Look — {formatFromUsdCents(total)}
          </button>
        </div>
      </div>
    </section>
  );
}

function ProductWall() {
  return (
    <section className="border-t border-black/5 bg-[#F7F5F0] px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1440px]">
        <h2 className="mb-14 font-display text-4xl font-bold uppercase tracking-tight text-black md:text-5xl">The SATURNA Wall</h2>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
          <div className="col-span-2 row-span-2">
            <PieceCard piece={getProduct('SAT-304')} dark={false} />
          </div>
          <PieceCard piece={getProduct('SAT-105')} dark={false} />
          <div className="row-span-2 overflow-hidden">
            <Link to="/looks" className="group relative block h-full min-h-[280px]">
              <img src={PHOTOS.darkRebelDuoSaturna} alt="SATURNA look" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute bottom-4 left-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-white">View the Look</span>
            </Link>
          </div>
          <PieceCard piece={getProduct('SAT-204')} dark={false} />
          <div className="col-span-2">
            <PieceCard piece={getProduct('SAT-104')} dark={false} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stories() {
  return (
    <section className="border-t border-white/5 bg-[#0A0A0A] px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1440px]">
        <h2 className="mb-14 font-display text-4xl font-bold uppercase tracking-tight text-white md:text-5xl">SATURNA Stories</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STORIES.map((s) => (
            <div key={s.slug} className="group relative aspect-[3/4] overflow-hidden bg-neutral-900">
              <img src={s.image} alt={s.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <h3 className="font-display text-lg font-bold uppercase tracking-tight">{s.title}</h3>
                <p className="mt-2 text-xs font-light leading-relaxed text-white/70">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] font-body antialiased">
      <Helmet>
        <html lang="en" />
        <title>SATURNA — Dark. Feminine. Unbound.</title>
        <meta
          name="description"
          content="SATURNA — a women's fashion house built around dark femininity, street culture and individual expression. Shop the new collection, discover Dark Rebel, Dark Feminine, Street Luxe and Night Edit."
        />
      </Helmet>
      <Seo
        title="SATURNA — Dark. Feminine. Unbound."
        description="A women's fashion house built around dark femininity, street culture and individual expression."
        image={SATURNA_OG_IMAGE}
        siteName="SATURNA"
      />
      <BrandHeader />
      <main>
        <Hero />
        <NewDrop />
        <ShopTheEdit />
        <CollectionsGallery />
        <ShopTheLook />
        <ProductWall />
        <Stories />
      </main>
      <BrandFooter />
    </div>
  );
}
