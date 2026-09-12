import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import RegionSwitcher from '@/components/RegionSwitcher';
import { useCart } from '@/hooks/useCart';
import { SATURNA_LOGO } from '@/lib/brand';

const NAV = [
  { label: 'New In', to: '/#new-drop' },
  { label: 'Collections', to: '/#collections' },
  { label: 'Looks', to: '/looks' },
  { label: 'Store', to: '/store' },
  { label: 'About', to: '/about' },
];

/**
 * Shared header for the flagship SATURNA pages (Home, Collections, Looks,
 * Piece) — same fixed cream bar and RegionSwitcher used sitewide, with
 * "Looks" added to the primary nav.
 */
export default function BrandHeader() {
  const [open, setOpen] = useState(false);
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
          <div className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.18em] text-black/70 md:gap-4">
            <button type="button" onClick={openCart} className="relative transition-colors hover:text-black" aria-label="Bag">
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
