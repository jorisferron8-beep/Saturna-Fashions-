import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import BrandHeader from '@/components/BrandHeader';
import BrandFooter from '@/components/BrandFooter';
import PieceCard, { addPieceToCart } from '@/components/PieceCard';
import Seo from '@/components/Seo';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { useGeoMarket } from '@/context/CurrencyContext';
import { SATURNA_OG_IMAGE } from '@/lib/brand';
import { getLook, getLookProducts } from '@/lib/saturnaCollections';

export default function LookDetailPage() {
  const { slug } = useParams();
  const look = getLook(slug);
  const pieces = useMemo(() => (look ? getLookProducts(look) : []), [look]);
  const { formatFromUsdCents } = useGeoMarket();
  const { addToCart } = useCart();
  const { toast } = useToast();

  if (!look) return <Navigate to="/looks" replace />;

  const total = pieces.reduce((n, p) => n + p.priceInCents, 0);

  const shopTheLook = async () => {
    for (const piece of pieces) {
      // eslint-disable-next-line no-await-in-loop
      await addPieceToCart(piece, addToCart);
    }
    toast({ title: 'Look added to your bag', description: `${look.name} · ${pieces.length} pieces` });
    window.dispatchEvent(new CustomEvent('saturna:open-cart'));
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] font-body text-black antialiased">
      <Helmet>
        <html lang="en" />
        <title>{look.name} — Looks — SATURNA™</title>
        <meta name="description" content={`SATURNA look — ${look.name}: ${pieces.map((p) => p.name).join(', ')}.`} />
      </Helmet>
      <Seo title={`${look.name} — SATURNA™`} description={`SATURNA look — ${look.name}.`} image={look.image || SATURNA_OG_IMAGE} siteName="SATURNA" />
      <BrandHeader />

      <div className="mx-auto max-w-[1440px] px-5 pt-24 md:px-8 md:pt-28">
        <nav className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-400" aria-label="Breadcrumb">
          <Link to="/" className="flex items-center gap-1.5 hover:text-[#5A1825]"><Home className="h-3 w-3" strokeWidth={1.5} /> Home</Link>
          <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
          <Link to="/looks" className="hover:text-[#5A1825]">Looks</Link>
          <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
          <span className="text-[#5A1825]">{look.name}</span>
        </nav>
      </div>

      <section className="mx-auto mt-6 grid max-w-[1440px] gap-8 px-5 md:grid-cols-2 md:px-8 md:py-8">
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900">
          <img src={look.image} alt={look.name} className="h-full w-full object-cover" />
        </div>
        <div className="py-6">
          <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-black md:text-6xl">{look.name}</h1>
          <p className="mt-3 text-sm font-light leading-relaxed text-neutral-500">
            {pieces.length} pieces, styled as one look — shop it whole or pick your favourite piece.
          </p>

          <div className="mt-8 divide-y divide-black/10 border-y border-black/10">
            {pieces.map((p) => (
              <Link key={p.sku} to={`/piece/${p.sku}`} className="flex items-center gap-4 py-4 transition-colors hover:bg-black/[0.02]">
                <img src={p.image} alt={p.name} className="h-16 w-14 shrink-0 object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-semibold uppercase tracking-tight text-black">{p.name}</p>
                  <p className="text-xs text-neutral-500">{p.category}</p>
                </div>
                <p className="shrink-0 text-sm font-medium text-black">{formatFromUsdCents(p.priceInCents)}</p>
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={shopTheLook}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 bg-[#5A1825] px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#6e1e2e] sm:w-auto"
          >
            Shop This Look — {formatFromUsdCents(total)}
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-16 md:px-8 md:py-24">
        <h2 className="mb-8 font-display text-2xl font-bold uppercase tracking-tight text-black">Shop the Pieces</h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {pieces.map((p) => <PieceCard key={p.sku} piece={p} dark={false} />)}
        </div>
      </section>

      <BrandFooter />
    </div>
  );
}
