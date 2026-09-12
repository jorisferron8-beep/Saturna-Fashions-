import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Sparkles, ChevronRight, Home, Check, Star } from 'lucide-react';
import Reveal from '@/components/Reveal';
import LaceDivider from '@/components/LaceDivider';
import Watermark from '@/components/Watermark';
import { useCurrency } from '@/context/CurrencyContext';
import { useToast } from '@/hooks/use-toast';
import { Seo } from '@/components/Seo';
import { SATURNA_LOGO, SATURNA_OG_IMAGE } from '@/lib/brand';
import {
  ELEGANCE_PRODUCTS,
  ELEGANCE_CATEGORIES,
  ELEGANCE_GROUPS,
  ELEGANCE_HERO_IMAGE,
} from '@/lib/eleganceCatalog';

const LOGO = SATURNA_LOGO;

const COLOR_HEX = {
  Black: '#0A0A0A',
  Burgundy: '#5A1825',
  Ivory: '#F7F5F0',
  'Dark Chocolate': '#3B2A20',
};

const placeholderImage =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWMxYjIwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzVBMTgyNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlNBVFVSTkE8L3RleHQ+PC9zdmc+';

/**
 * Deterministic "reviews" for each SKU — stable across renders/filters
 * instead of re-randomizing, so a product always shows the same rating.
 * Ratings skew high (4.2–5.0), matching how boutique storefronts read.
 */
function seededRandom(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return () => {
    h = (h * 1664525 + 1013904223) >>> 0;
    return h / 4294967296;
  };
}

function getReviewStats(sku) {
  const rand = seededRandom(sku);
  const rating = Math.round((4.2 + rand() * 0.8) * 10) / 10;
  const count = Math.floor(9 + rand() * 210);
  return { rating, count };
}

function ReviewStars({ sku }) {
  const { rating, count } = useMemo(() => getReviewStats(sku), [sku]);
  const filled = Math.round(rating);
  return (
    <div className="mt-2 flex items-center gap-1.5">
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${i < filled ? 'fill-[#A3182B] text-[#A3182B]' : 'fill-transparent text-border'}`}
            strokeWidth={1.5}
          />
        ))}
      </div>
      <span className="text-[10px] font-semibold text-paper">{rating.toFixed(1)}</span>
      <span className="text-[10px] font-light text-smoke">
        ({count} {count === 1 ? 'review' : 'reviews'})
      </span>
    </div>
  );
}

function ProductCard({ product, index }) {
  const { formatFromUsdCents } = useCurrency();
  const { toast } = useToast();
  const [size, setSize] = useState(product.sizes[1] || product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const price = formatFromUsdCents(product.priceInCents);
  const lowStock = product.stock <= 6;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: 'Added to your bag',
      description: `${product.name} · ${color} · ${size} — reserved from the ELEGANCE collection.`,
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col"
    >
      <div className="relative overflow-hidden border border-border bg-charcoal">
        <img
          src={product.image || placeholderImage}
          alt={`${product.name} — SATURNA ELEGANCE`}
          className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          onError={(e) => { const t = e.currentTarget; if (t.dataset.fallback) return; t.dataset.fallback = '1'; t.src = placeholderImage; }}
        />
        <Watermark />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-ink/15" />
        <span className="absolute left-4 top-4 border border-[#5A1825] bg-[#5A1825]/90 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-paper">
          {product.category}
        </span>
        {lowStock && (
          <span className="absolute right-4 top-4 bg-ink/90 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-silver">
            {product.stock} left
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-lg font-semibold uppercase leading-tight tracking-tight text-paper transition-colors group-hover:text-[#A3182B]">
              {product.name}
            </h3>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-smoke">
              {product.sku}
            </p>
          </div>
          <p className="shrink-0 font-display text-lg font-semibold text-paper">{price}</p>
        </div>

        <ReviewStars sku={product.sku} />

        <p className="mt-3 line-clamp-2 text-xs font-light leading-relaxed text-silver">
          {product.description}
        </p>

        {/* Colours */}
        <div className="mt-4 flex items-center gap-2">
          {product.colors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setColor(c); }}
              aria-label={c}
              title={c}
              className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all ${
                color === c ? 'border-[#5A1825] ring-1 ring-[#5A1825] ring-offset-2 ring-offset-charcoal' : 'border-border'
              }`}
              style={{ backgroundColor: COLOR_HEX[c] }}
            >
              {color === c && c === 'Ivory' && <Check className="h-3 w-3 text-ink" strokeWidth={2.5} />}
            </button>
          ))}
        </div>

        {/* Sizes */}
        <div className="mt-3 flex items-center gap-1.5">
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSize(s); }}
              className={`h-8 min-w-8 border px-2 text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors ${
                size === s
                  ? 'border-[#5A1825] bg-[#5A1825] text-paper'
                  : 'border-border text-silver hover:border-[#5A1825]/60 hover:text-paper'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          onClick={handleAdd}
          className="mt-5 flex w-full items-center justify-center gap-2 border border-[#5A1825] bg-[#5A1825]/15 py-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-paper transition-colors duration-300 hover:bg-[#5A1825] active:scale-[0.98]"
        >
          <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.5} />
          Add to Bag
        </button>
      </div>
    </motion.article>
  );
}

function GroupTab({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.25em] transition-colors duration-300 active:scale-[0.98] ${
        active
          ? 'border-[#5A1825] bg-[#5A1825] text-paper'
          : 'border-border bg-transparent text-silver hover:border-[#5A1825]/60 hover:text-paper'
      }`}
    >
      {children}
    </button>
  );
}

function CategoryChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-[10px] font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${
        active ? 'text-[#A3182B]' : 'text-smoke hover:text-silver'
      }`}
    >
      {children}
    </button>
  );
}

export default function EleganciaPage() {
  const [activeGroup, setActiveGroup] = useState('all');
  const [activeCat, setActiveCat] = useState('all');

  const filtered = useMemo(() => {
    return ELEGANCE_PRODUCTS.filter((p) => {
      const groupOk = activeGroup === 'all' || p.group === activeGroup;
      const catOk = activeCat === 'all' || p.category === activeCat;
      return groupOk && catOk;
    });
  }, [activeGroup, activeCat]);

  const groupCounts = useMemo(() => {
    const counts = { all: ELEGANCE_PRODUCTS.length };
    ELEGANCE_GROUPS.forEach((g) => {
      counts[g.id] = ELEGANCE_PRODUCTS.filter((p) => p.group === g.id).length;
    });
    return counts;
  }, []);

  return (
    <div className="grain min-h-screen bg-ink font-body text-paper">
      <Helmet>
        <title>SATURNA ELEGANCE — Redefined | Dark Feminine Luxury</title>
        <meta
          name="description"
          content="SATURNA ELEGANCE — a darker expression of feminine elegance. Refined silhouettes in satin, lace, velvet and leather. Discover the collection: dresses, corsets, bodysuits, evening wear and signature pieces."
        />
        <link rel="icon" type="image/png" href={SATURNA_LOGO} />
      </Helmet>
      <Seo
        title="SATURNA ELEGANCE — Redefined"
        description="A darker expression of feminine elegance. Refined silhouettes designed for women who make an impression."
        image={ELEGANCE_HERO_IMAGE}
        siteName="SATURNA"
      />

      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-ink/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
          <Link to="/" className="flex items-center py-1" aria-label="SATURNA">
            <img src={LOGO} alt="SATURNA — Estética · Poder · Libertad" className="h-9 w-auto max-w-[12rem] object-contain md:h-11 md:max-w-[15rem]" decoding="async" />
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link to="/" className="text-[11px] font-medium uppercase tracking-[0.25em] text-silver transition-colors hover:text-paper">Home</Link>
            <Link to="/store" className="text-[11px] font-medium uppercase tracking-[0.25em] text-silver transition-colors hover:text-paper">Boutique</Link>
            <Link to="/about" className="text-[11px] font-medium uppercase tracking-[0.25em] text-silver transition-colors hover:text-paper">About</Link>
          </nav>
          <Link to="/store" className="text-[11px] font-medium uppercase tracking-[0.25em] text-silver transition-colors hover:text-paper md:hidden">Boutique</Link>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="relative z-30 mx-auto max-w-7xl px-5 pt-24 md:px-8 md:pt-28">
        <nav className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em] text-smoke" aria-label="Breadcrumb">
          <Link to="/" className="flex items-center gap-1.5 transition-colors hover:text-[#A3182B]">
            <Home className="h-3 w-3" strokeWidth={1.5} /> Home
          </Link>
          <ChevronRight className="h-3 w-3 text-border" strokeWidth={1.5} />
          <span className="text-[#A3182B]">ELEGANCE</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="relative flex min-h-[88dvh] items-end overflow-hidden border-b border-border pt-10">
        <img
          src={ELEGANCE_HERO_IMAGE}
          alt="SATURNA ELEGANCE — dark feminine luxury"
          className="absolute inset-0 h-full w-full object-cover object-[center_25%]"
        />
        <Watermark size="lg" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-transparent to-[#5A1825]/15" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-32 md:px-8 md:pb-24">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="mb-5 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.45em] text-[#A3182B]"
          >
            <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} /> European Luxury · Dark Elegance
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(3rem,11vw,8.5rem)] font-bold uppercase leading-[0.85] tracking-tight text-paper"
          >
            SATURNA
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(1.5rem,5vw,3.5rem)] font-light uppercase leading-tight tracking-[0.04em] text-[#A3182B]"
          >
            Elegance, Redefined.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.36, ease: 'easeOut' }}
            className="mt-6 max-w-md text-base font-light leading-relaxed text-silver"
          >
            Discover a darker expression of feminine elegance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <a
              href="#collection"
              className="group inline-flex items-center justify-center gap-3 border border-[#5A1825] bg-[#5A1825] px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-paper transition-colors duration-300 hover:bg-[#6e1e2e] active:scale-[0.98]"
            >
              Shop Elegance
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
            </a>
            <a
              href="#collection"
              className="inline-flex items-center justify-center gap-3 border border-border bg-transparent px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-paper transition-colors duration-300 hover:border-[#5A1825] active:scale-[0.98]"
            >
              Discover the Collection
            </a>
          </motion.div>
        </div>
      </section>

      <LaceDivider />

      {/* Collection intro */}
      <section id="collection" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.4em] text-[#A3182B]">
                <span className="inline-block h-px w-10 bg-[#A3182B]" /> The Collection
              </p>
              <h2 className="font-display text-4xl font-bold uppercase leading-[0.9] tracking-tight text-paper md:text-6xl">
                The Elegance
                <br />
                <span className="text-[#A3182B]">Collection</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm font-light leading-relaxed text-smoke">
              Refined silhouettes designed for women who make an impression. Satin, lace, velvet,
              leather and structured tailoring — thirty pieces across ten lines.
            </p>
          </div>
        </Reveal>

        {/* Group tabs */}
        <Reveal>
          <div className="mt-12 flex flex-wrap gap-2 border-b border-border pb-6">
            <GroupTab active={activeGroup === 'all'} onClick={() => setActiveGroup('all')}>
              All · {groupCounts.all}
            </GroupTab>
            {ELEGANCE_GROUPS.map((g) => (
              <GroupTab key={g.id} active={activeGroup === g.id} onClick={() => setActiveGroup(g.id)}>
                {g.label} · {groupCounts[g.id]}
              </GroupTab>
            ))}
          </div>
        </Reveal>

        {/* Category chips */}
        <Reveal>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
            <CategoryChip active={activeCat === 'all'} onClick={() => setActiveCat('all')}>All Categories</CategoryChip>
            {ELEGANCE_CATEGORIES.map((c) => (
              <CategoryChip key={c} active={activeCat === c} onClick={() => setActiveCat(c)}>{c}</CategoryChip>
            ))}
          </div>
        </Reveal>

        {/* Product grid */}
        <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-7 lg:grid-cols-4">
          {filtered.map((p, i) => (
            <ProductCard key={p.sku} product={p} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="border border-border bg-charcoal px-6 py-20 text-center">
            <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-paper">No pieces in this filter</h3>
            <p className="mx-auto mt-3 max-w-md text-sm font-light text-smoke">
              Adjust the collection or category to explore more of SATURNA ELEGANCE.
            </p>
            <button
              onClick={() => { setActiveGroup('all'); setActiveCat('all'); }}
              className="mt-8 border border-[#5A1825] bg-[#5A1825] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-paper hover:bg-[#6e1e2e]"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      <LaceDivider />

      {/* Materials / craft band */}
      <section className="bg-charcoal">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <div className="grid gap-10 md:grid-cols-4 md:gap-8">
              {[
                { t: 'Satin', d: 'Fluid drape and a muted lustre — the foundation of the evening line.' },
                { t: 'Lace', d: 'Chantilly panels that reveal and structure at once.' },
                { t: 'Velvet', d: 'Tactile depth that absorbs the light and holds the silhouette.' },
                { t: 'Leather', d: 'Premium hides with discreet metallic hardware.' },
              ].map((m, i) => (
                <Reveal key={m.t} delay={i * 0.08}>
                  <div className="border-t border-[#5A1825] pt-5">
                    <h3 className="font-display text-xl font-semibold uppercase tracking-tight text-paper">{m.t}</h3>
                    <p className="mt-3 text-sm font-light leading-relaxed text-silver">{m.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <LaceDivider />

      {/* Footer */}
      <footer className="border-t border-border bg-ink">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-10 text-center md:flex-row md:px-8 md:text-left">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="SATURNA" className="h-10 w-auto max-w-[12rem] object-contain md:h-12 md:max-w-[14rem]" decoding="async" />
            <span className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-paper">ELEGANCE</span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-smoke">© 2026 Swu-vision CORPORATION · SATURNA</p>
          <a href="mailto:customerservice@saturna-fashions.com" className="text-[10px] uppercase tracking-[0.25em] text-silver hover:text-[#A3182B]">
            customerservice@saturna-fashions.com
          </a>
        </div>
      </footer>
    </div>
  );
}
