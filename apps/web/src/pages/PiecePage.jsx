import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import BrandHeader from '@/components/BrandHeader';
import BrandFooter from '@/components/BrandFooter';
import PieceCard, { ReviewStars, addPieceToCart } from '@/components/PieceCard';
import Seo from '@/components/Seo';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { useGeoMarket } from '@/context/CurrencyContext';
import { SATURNA_OG_IMAGE } from '@/lib/brand';
import { getCollection, getProduct, getProductsByCollection } from '@/lib/saturnaCollections';

export default function PiecePage() {
  const { sku } = useParams();
  const piece = getProduct(sku);
  const [color, setColor] = useState(piece?.colors?.[0]);
  const [size, setSize] = useState(piece?.sizes?.[1] || piece?.sizes?.[0]);
  const [view, setView] = useState('front');
  const { formatFromUsdCents } = useGeoMarket();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const collection = useMemo(() => (piece ? getCollection(piece.collectionSlug) : null), [piece]);
  const completeLook = useMemo(
    () => (piece ? getProductsByCollection(piece.collectionSlug).filter((p) => p.sku !== piece.sku).slice(0, 4) : []),
    [piece],
  );

  if (!piece) return <Navigate to="/" replace />;

  const handleAdd = async () => {
    try {
      await addPieceToCart({ ...piece, colors: [color] }, addToCart);
      toast({ title: 'Added to your bag', description: `${piece.name} · ${color} · ${size}` });
      window.dispatchEvent(new CustomEvent('saturna:open-cart'));
    } catch (err) {
      toast({ title: 'Could not add', description: err?.message || 'Please try again.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] font-body text-black antialiased">
      <Helmet>
        <html lang="en" />
        <title>{piece.name} — SATURNA™</title>
        <meta name="description" content={piece.description} />
      </Helmet>
      <Seo title={`${piece.name} — SATURNA™`} description={piece.description} image={piece.image || SATURNA_OG_IMAGE} siteName="SATURNA" />
      <BrandHeader />

      <div className="mx-auto max-w-[1440px] px-5 pt-24 md:px-8 md:pt-28">
        <nav className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-400" aria-label="Breadcrumb">
          <Link to="/" className="flex items-center gap-1.5 hover:text-[#5A1825]"><Home className="h-3 w-3" strokeWidth={1.5} /> Home</Link>
          <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
          {collection ? (
            <>
              <Link to={`/collections/${collection.slug}`} className="hover:text-[#5A1825]">{collection.name}</Link>
              <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
            </>
          ) : null}
          <span className="text-[#5A1825]">{piece.name}</span>
        </nav>
      </div>

      <section className="mx-auto mt-6 grid max-w-[1440px] gap-10 px-5 pb-20 md:grid-cols-2 md:px-8 md:py-10">
        <div>
          <div className="aspect-[3/4] overflow-hidden bg-neutral-900">
            <img src={view === 'front' ? piece.image : piece.hover} alt={piece.name} className="h-full w-full object-cover" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {[{ id: 'front', label: 'Front', img: piece.image }, { id: 'detail', label: 'Detail', img: piece.hover }].map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setView(v.id)}
                className={`aspect-[3/4] overflow-hidden border-2 transition-colors ${view === v.id ? 'border-[#5A1825]' : 'border-transparent hover:border-black/20'}`}
              >
                <img src={v.img} alt={`${piece.name} — ${v.label}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          {collection ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#A3182B]">{collection.name} Collection</p>
          ) : null}
          <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-black md:text-4xl">{piece.name}</h1>
          <p className="mt-2 font-display text-xl font-semibold text-black">{formatFromUsdCents(piece.priceInCents)}</p>
          <div className="mt-3"><ReviewStars sku={piece.sku} /></div>

          <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-neutral-600">{piece.description}</p>

          <div className="mt-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500">Colour — {color}</p>
            <div className="mt-2 flex items-center gap-2">
              {piece.colors.map((cName) => (
                <button
                  key={cName}
                  type="button"
                  onClick={() => setColor(cName)}
                  aria-label={cName}
                  title={cName}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${color === cName ? 'border-[#5A1825] ring-1 ring-[#5A1825] ring-offset-2' : 'border-black/15'}`}
                  style={{ backgroundColor: COLOR_HEX[cName] || '#0A0A0A' }}
                />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500">Size — {size}</p>
              <Link to="/legal" className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400 underline-offset-2 hover:text-[#5A1825] hover:underline">
                Size Guide
              </Link>
            </div>
            <div className="mt-2 flex items-center gap-2">
              {piece.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`h-10 min-w-10 border px-3 text-xs font-semibold uppercase tracking-[0.1em] transition-colors ${
                    size === s ? 'border-[#5A1825] bg-[#5A1825] text-white' : 'border-black/15 text-neutral-600 hover:border-black'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="mt-10 w-full bg-black py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:bg-[#5A1825]"
          >
            Add to Bag
          </button>
        </div>
      </section>

      {completeLook.length > 0 ? (
        <section className="border-t border-black/10 bg-white px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <h2 className="mb-8 font-display text-2xl font-bold uppercase tracking-tight text-black">Complete the Look</h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {completeLook.map((p) => <PieceCard key={p.sku} piece={p} dark={false} />)}
            </div>
          </div>
        </section>
      ) : null}

      <BrandFooter />
    </div>
  );
}

const COLOR_HEX = {
  Black: '#0A0A0A',
  Burgundy: '#5A1825',
  Ivory: '#F7F5F0',
  'Dark Chocolate': '#3B2A20',
  'Washed Grey': '#8A8A8A',
};
