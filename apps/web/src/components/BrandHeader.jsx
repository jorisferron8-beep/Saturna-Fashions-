import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGeoMarket } from '@/context/CurrencyContext';
import { Menu, Search, X } from 'lucide-react';
import RegionSwitcher from '@/components/RegionSwitcher';
import { useCart } from '@/hooks/useCart';
import { SATURNA_LOGO } from '@/lib/brand';
import { PLACEHOLDER_IMAGE } from '@/lib/brandImagery';
import { searchCatalog } from '@/lib/saturnaCollections';

const NAV = [
  { label: 'New In', to: '/#new-drop' },
  { label: 'Collections', to: '/#collections' },
  { label: 'Looks', to: '/looks' },
  { label: 'Store', to: '/store' },
  { label: 'About', to: '/about' },
];

function SearchOverlay({ onClose }) {
  const [query, setQuery] = useState('');
  const { formatFromUsdCents } = useGeoMarket();
  const { products, collections } = useMemo(() => searchCatalog(query), [query]);
  const hasResults = products.length > 0 || collections.length > 0;

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="mx-auto mt-24 w-full max-w-2xl bg-[#F7F5F0] px-6 py-6 shadow-2xl md:px-8 md:py-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-black/15 pb-4">
          <Search className="h-5 w-5 text-black/50" strokeWidth={1.5} />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pieces, collections…"
            className="flex-1 bg-transparent text-lg font-light text-black outline-none placeholder:text-black/35"
          />
          <button type="button" onClick={onClose} aria-label="Close search">
            <X className="h-5 w-5 text-black/60" strokeWidth={1.5} />
          </button>
        </div>

        {query.trim() ? (
          hasResults ? (
            <div className="mt-5 max-h-[60vh] space-y-6 overflow-y-auto">
              {collections.length > 0 ? (
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400">Collections</p>
                  <div className="flex flex-wrap gap-2">
                    {collections.map((c) => (
                      <Link
                        key={c.slug}
                        to={`/collections/${c.slug}`}
                        onClick={onClose}
                        className="border border-black/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-black hover:border-black"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
              {products.length > 0 ? (
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400">Pieces</p>
                  <div className="divide-y divide-black/8">
                    {products.map((p) => (
                      <Link
                        key={p.sku}
                        to={`/piece/${p.sku}`}
                        onClick={onClose}
                        className="flex items-center gap-4 py-3 transition-colors hover:bg-black/[0.03]"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-16 w-14 shrink-0 object-cover"
                          onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE; }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-sm font-semibold uppercase tracking-tight text-black">{p.name}</p>
                          <p className="text-xs text-neutral-500">{p.category}</p>
                        </div>
                        <p className="shrink-0 text-sm font-medium text-black">{formatFromUsdCents(p.priceInCents)}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="mt-6 text-sm font-light text-neutral-500">No results for &quot;{query}&quot;.</p>
          )
        ) : (
          <p className="mt-6 text-sm font-light text-neutral-500">Try &quot;corset&quot;, &quot;denim&quot;, or a collection name.</p>
        )}
      </div>
    </div>
  );
}

/**
 * Shared header for the flagship SATURNA pages (Home, Collections, Looks,
 * Piece) — same fixed cream bar and RegionSwitcher used sitewide, with
 * "Looks" added to the primary nav.
 */
export default function BrandHeader() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartItems } = useCart();
  const cartCount = (cartItems || []).reduce((n, i) => n + (i.quantity || 0), 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openCart = () => window.dispatchEvent(new CustomEvent('saturna:open-cart'));

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-[#F7F5F0]">
        <div className="flex items-center justify-center gap-4 border-b border-black/5 px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] text-neutral-500">
          <span>Dark. Feminine. Unbound.</span>
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
            {NAV.map((n) => (
              <Link key={n.label} to={n.to} className="text-[11px] font-medium uppercase tracking-[0.2em] text-black/70 transition-colors hover:text-black">
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.18em] text-black/70 md:gap-5">
            <button type="button" onClick={() => setSearchOpen(true)} className="transition-colors hover:text-black" aria-label="Search">
              <Search className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button type="button" onClick={openCart} className="relative transition-colors hover:text-black" aria-label="Bag">
              BAG{cartCount > 0 ? ` (${cartCount})` : ''}
            </button>
          </div>
        </header>
      </div>

      {searchOpen ? <SearchOverlay onClose={() => setSearchOpen(false)} /> : null}

      {open ? (
        <div className="fixed inset-0 z-[60] bg-[#F7F5F0] md:hidden">
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
            <span className="font-display text-lg font-semibold uppercase tracking-[0.28em] text-black">SATURNA™</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close">
              <X className="h-5 w-5 text-black" strokeWidth={1.25} />
            </button>
          </div>
          <nav className="flex flex-col px-5 pt-4">
            {NAV.map((n) => (
              <Link key={n.label} to={n.to} onClick={() => setOpen(false)} className="flex items-baseline justify-between border-b border-black/10 py-5">
                <span className="font-display text-2xl font-medium uppercase tracking-[0.08em] text-black">{n.label}</span>
              </Link>
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
