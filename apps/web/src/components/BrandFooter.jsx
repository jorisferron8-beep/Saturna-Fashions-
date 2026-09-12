import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import RegionSwitcher from '@/components/RegionSwitcher';
import { SATURNA_LOGO } from '@/lib/brand';

const SHOP_LINKS = [
  { label: 'New In', to: '/#new-drop' },
  { label: 'Collections', to: '/#collections' },
  { label: 'Looks', to: '/looks' },
  { label: 'Essentials', to: '/collections/essentials' },
];

const COLLECTION_LINKS = [
  { label: 'Dark Rebel', to: '/collections/dark-rebel' },
  { label: 'Dark Feminine', to: '/collections/dark-feminine' },
  { label: 'Street Luxe', to: '/collections/street-luxe' },
  { label: 'Night Edit', to: '/collections/night-edit' },
];

const CLIENT_LINKS = [
  { label: 'Shipping', to: '/legal' },
  { label: 'Returns', to: '/legal' },
  { label: 'Size Guide', to: '/legal' },
];

function FooterColumn({ title, links }) {
  return (
    <div>
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#A3182B]">{title}</p>
      <ul className="space-y-2 text-sm font-light text-smoke">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="hover:text-paper">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Shared footer for the flagship SATURNA pages (Home, Collections, Looks,
 * Piece). Store/About/Elegancia/Regional boutiques keep their own existing
 * footers.
 */
export default function BrandFooter() {
  return (
    <footer className="border-t border-border bg-ink text-paper">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <img src={SATURNA_LOGO} alt="SATURNA" className="h-9 w-auto max-w-[10rem] object-contain brightness-0 invert" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-smoke">
              Dark. Feminine. Unbound. USA · Colombia · Hong Kong / China.
            </p>
            <div className="mt-4"><RegionSwitcher /></div>
            <a href="https://instagram.com" className="mt-5 inline-flex items-center gap-2 text-silver transition-colors hover:text-[#A3182B]" aria-label="Instagram">
              <Instagram className="h-5 w-5" strokeWidth={1.5} />
            </a>
          </div>

          <FooterColumn title="Shop" links={SHOP_LINKS} />
          <FooterColumn title="Collections" links={COLLECTION_LINKS} />

          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#A3182B]">Client</p>
            <ul className="space-y-2 text-sm font-light text-smoke">
              {CLIENT_LINKS.map((l) => (
                <li key={l.label}><Link to={l.to} className="hover:text-paper">{l.label}</Link></li>
              ))}
              <li><a href="mailto:customerservice@saturna-fashions.com" className="hover:text-paper">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-8 text-[11px] font-light leading-relaxed text-smoke md:flex-row md:items-center md:justify-between">
          <p>© 2026 Swu-vision CORPORATION. All rights reserved. SATURNA™ Dark Fashion.</p>
          <Link to="/legal" className="uppercase tracking-[0.2em] text-silver hover:text-paper">Legal Centre</Link>
        </div>
      </div>
    </footer>
  );
}
