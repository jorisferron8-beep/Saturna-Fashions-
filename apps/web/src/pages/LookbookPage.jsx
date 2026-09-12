import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import BrandHeader from '@/components/BrandHeader';
import BrandFooter from '@/components/BrandFooter';
import Seo from '@/components/Seo';
import { SATURNA_OG_IMAGE } from '@/lib/brand';
import { LOOKS } from '@/lib/saturnaCollections';

export default function LookbookPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] font-body text-white antialiased">
      <Helmet>
        <html lang="en" />
        <title>Looks — SATURNA™</title>
        <meta name="description" content="SATURNA lookbook — styled outfits from Dark Rebel, Dark Feminine, Street Luxe and Night Edit, ready to shop in one move." />
      </Helmet>
      <Seo title="Looks — SATURNA™" description="SATURNA lookbook — styled outfits, ready to shop in one move." image={SATURNA_OG_IMAGE} siteName="SATURNA" />
      <BrandHeader />

      <section className="mx-auto max-w-[1440px] px-5 pb-20 pt-28 md:px-8 md:pt-32">
        <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-[#A3182B]">The Lookbook</p>
        <h1 className="mt-3 font-display text-5xl font-bold uppercase tracking-tight md:text-7xl">Looks</h1>
        <p className="mt-4 max-w-lg text-sm font-light leading-relaxed text-smoke">
          Full SATURNA outfits, styled to be worn exactly as shown — or taken apart, piece by piece.
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {LOOKS.map((look) => (
            <Link key={look.slug} to={`/looks/${look.slug}`} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900">
                <img src={look.image} alt={look.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold uppercase tracking-tight">{look.name}</h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A3182B] transition-transform group-hover:translate-x-1">
                  View Look <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                </span>
              </div>
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-smoke">{look.skus.length} pieces</p>
            </Link>
          ))}
        </div>
      </section>

      <BrandFooter />
    </div>
  );
}
