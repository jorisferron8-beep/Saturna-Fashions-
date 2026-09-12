import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Star } from 'lucide-react';
import { useGeoMarket } from '@/context/CurrencyContext';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { getReviewStats } from '@/lib/reviews';
import { PLACEHOLDER_IMAGE } from '@/lib/brandImagery';

export function addPieceToCart(piece, addToCart) {
  const fakeProduct = { id: piece.sku, title: piece.name, image: piece.image, media: [{ url: piece.image }] };
  const fakeVariant = {
    id: `${piece.sku}-${piece.colors[0]}`,
    title: piece.colors[0],
    price_in_cents: piece.priceInCents,
    manage_inventory: false,
  };
  return addToCart(fakeProduct, fakeVariant, 1, 99);
}

export function ReviewStars({ sku, className = '' }) {
  const { rating, count } = getReviewStats(sku);
  const filled = Math.round(rating);
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`h-3 w-3 ${i < filled ? 'fill-[#A3182B] text-[#A3182B]' : 'fill-transparent text-border'}`} strokeWidth={1.5} />
        ))}
      </div>
      <span className="text-[10px] font-semibold">{rating.toFixed(1)}</span>
      <span className="text-[10px] font-light text-smoke">({count})</span>
    </div>
  );
}

/**
 * Compact editorial product card — image with a quick-add reveal, name,
 * price and a review line. Used on Home (New Drop / Product Wall) and on
 * the collection pages.
 */
export default function PieceCard({ piece, dark = true }) {
  const [hover, setHover] = useState(false);
  const { formatFromUsdCents } = useGeoMarket();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addPieceToCart(piece, addToCart);
      toast({ title: 'Added to your bag', description: piece.name });
      window.dispatchEvent(new CustomEvent('saturna:open-cart'));
    } catch (err) {
      toast({ title: 'Could not add', description: err?.message || 'Please try again.', variant: 'destructive' });
    }
  };

  const textCls = dark ? 'text-paper' : 'text-black';
  const subCls = dark ? 'text-smoke' : 'text-neutral-500';

  return (
    <Link
      to={`/piece/${piece.sku}`}
      className="group block"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900">
        <img
          src={hover ? piece.hover : piece.image}
          alt={piece.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          loading="lazy"
          onError={(e) => { const t = e.currentTarget; if (t.dataset.fallback) return; t.dataset.fallback = '1'; t.src = PLACEHOLDER_IMAGE; }}
        />
        <button
          type="button"
          onClick={handleQuickAdd}
          className="absolute bottom-0 left-0 right-0 flex translate-y-full items-center justify-center gap-2 bg-black py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white transition-transform duration-300 group-hover:translate-y-0"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} /> Quick Add
        </button>
      </div>
      <div className="mt-3 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className={`font-display text-sm font-semibold uppercase tracking-[0.06em] ${textCls}`}>{piece.name}</h3>
          <p className={`shrink-0 text-sm font-medium ${textCls}`}>{formatFromUsdCents(piece.priceInCents)}</p>
        </div>
        <p className={`text-[10px] uppercase tracking-[0.2em] ${subCls}`}>{piece.category}</p>
        <ReviewStars sku={piece.sku} className={dark ? 'text-paper' : 'text-black'} />
      </div>
    </Link>
  );
}
