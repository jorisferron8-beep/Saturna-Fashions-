import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import BrandHeader from '@/components/BrandHeader';
import BrandFooter from '@/components/BrandFooter';
import PieceCard from '@/components/PieceCard';
import Seo from '@/components/Seo';
import { SATURNA_OG_IMAGE } from '@/lib/brand';
import { getCollection, getProductsByCollection } from '@/lib/saturnaCollections';

function FilterChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors ${
        active ? 'border-[#5A1825] bg-[#5A1825] text-white' : 'border-black/15 text-neutral-600 hover:border-black hover:text-black'
      }`}
    >
      {children}
    </button>
  );
}

export default function CollectionPage() {
  const { slug } = useParams();
  const collection = getCollection(slug);
  const [activeFilter, setActiveFilter] = useState('all');

  const products = useMemo(() => (collection ? getProductsByCollection(collection.slug) : []), [collection]);
  const filtered = useMemo(
    () => (activeFilter === 'all' ? products : products.filter((p) => p.category === activeFilter)),
    [products, activeFilter],
  );

  if (!collection) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-[#F7F5F0] font-body text-black antialiased">
      <Helmet>
        <html lang="en" />
        <title>{collection.name} — SATURNA™</title>
        <meta name="description" content={`SATURNA ${collection.name} — ${collection.description}`} />
      </Helmet>
      <Seo title={`${collection.name} — SATURNA™`} description={collection.description} image={collection.image || SATURNA_OG_IMAGE} siteName="SATURNA" />
      <BrandHeader />

      <div className="mx-auto max-w-[1440px] px-5 pt-24 md:px-8 md:pt-28">
        <nav className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-400" aria-label="Breadcrumb">
          <Link to="/" className="flex items-center gap-1.5 transition-colors hover:text-[#5A1825]">
            <Home className="h-3 w-3" strokeWidth={1.5} /> Home
          </Link>
          <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
          <span className="text-[#5A1825]">{collection.name}</span>
        </nav>
      </div>

      <section className="relative mt-6 min-h-[62vh] overflow-hidden">
        <img src={collection.image} alt={collection.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
        <div className="relative mx-auto flex min-h-[62vh] max-w-[1440px] flex-col justify-end px-5 pb-16 pt-24 md:px-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#A3182B]">{collection.nameZh}</p>
          <h1 className="mt-3 font-display text-6xl font-bold uppercase leading-[0.9] tracking-tight text-white md:text-8xl">
            {collection.name}
          </h1>
          <p className="mt-4 max-w-lg text-base font-light leading-relaxed text-white/85">{collection.tagline}</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-16 md:px-8 md:py-24">
        <p className="max-w-2xl text-sm font-light leading-relaxed text-neutral-600">{collection.description}</p>
        <p className="mt-6 font-display text-lg font-semibold uppercase tracking-wide text-black">
          {products.length} Pieces
        </p>

        <div className="mt-6 flex flex-wrap gap-2 border-b border-black/10 pb-8">
          <FilterChip active={activeFilter === 'all'} onClick={() => setActiveFilter('all')}>All</FilterChip>
          {collection.filters.map((f) => (
            <FilterChip key={f} active={activeFilter === f} onClick={() => setActiveFilter(f)}>{f}</FilterChip>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => <PieceCard key={p.sku} piece={p} dark={false} />)}
        </div>
      </section>

      <BrandFooter />
    </div>
  );
}
