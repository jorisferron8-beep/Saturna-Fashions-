import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';
import BrandHeader from '@/components/BrandHeader';
import BrandFooter from '@/components/BrandFooter';
import Seo from '@/components/Seo';
import { useToast } from '@/hooks/use-toast';
import { SATURNA_OG_IMAGE } from '@/lib/brand';
import { SEASONAL } from '@/lib/saturnaCollections';

function Snowfall({ count = 40 }) {
  const flakes = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 3,
        duration: 8 + Math.random() * 10,
        delay: Math.random() * 10,
        drift: (Math.random() - 0.5) * 60,
        opacity: 0.25 + Math.random() * 0.5,
      })),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {flakes.map((f) => (
        <span
          key={f.id}
          className="snowflake"
          style={{
            left: `${f.left}%`,
            width: f.size,
            height: f.size,
            opacity: f.opacity,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            '--snow-drift': `${f.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

function Hero() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );

  useEffect(() => {
    if (reduceMotion.current) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % SEASONAL.heroImages.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative flex min-h-[92dvh] items-end justify-center overflow-hidden bg-[#0A0A0A] text-center">
      {SEASONAL.heroImages.map((src, i) => (
        <img
          key={src}
          src={src}
          alt="SATURNA Christmas &amp; Winter"
          aria-hidden={i !== index}
          className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-1000 ease-in-out ${i === index ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/15" />
      <Snowfall />
      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center px-5 pb-24 pt-32">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-[11px] font-semibold uppercase tracking-[0.4em] text-white/70">
          SATURNA
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-3 font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight text-white md:text-7xl"
        >
          {SEASONAL.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-3 font-display text-lg font-light italic text-white/85 md:text-xl"
        >
          {SEASONAL.tagline}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 border border-white/30 px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white"
        >
          {SEASONAL.launchLabel}
        </motion.p>
        <motion.a
          href="#preview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mt-9 inline-flex items-center bg-white px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-black transition-colors hover:bg-[#F7F5F0]"
        >
          Discover the Collection
        </motion.a>
      </div>
    </section>
  );
}

function CategoryPreview() {
  return (
    <section id="preview" className="scroll-mt-20 bg-[#F7F5F0] px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1440px]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#5A1825]">What&apos;s Coming</p>
        <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight text-black md:text-4xl">
          Three Edits, One Season
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {SEASONAL.categories.map((cat) => (
            <div key={cat.name} className="border border-black/10 bg-white p-7">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold uppercase tracking-tight text-black">{cat.name}</h3>
                <span className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  <Lock className="h-3 w-3" strokeWidth={1.5} /> Soon
                </span>
              </div>
              <ul className="mt-5 space-y-2">
                {cat.items.map((item) => (
                  <li key={item} className="text-sm font-light text-neutral-600">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LookPreview() {
  const scrollerRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const { toast } = useToast();
  const reduceMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );

  useEffect(() => {
    if (paused || reduceMotion.current) return undefined;
    const id = setInterval(() => {
      const el = scrollerRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + el.clientWidth * 0.32, behavior: 'smooth' });
    }, 4000);
    return () => clearInterval(id);
  }, [paused]);

  const previewLook = () => {
    toast({
      title: 'Coming Soon',
      description: 'Be the first to discover the new SATURNA Christmas & Winter collection.',
    });
  };

  return (
    <section className="border-t border-white/5 bg-[#0A0A0A] py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#A3182B]">The Looks</p>
        <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight text-white md:text-4xl">
          A First Look, Before the Drop
        </h2>
      </div>
      <div
        ref={scrollerRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {SEASONAL.looks.map((look) => (
          <button
            key={look.name}
            type="button"
            onClick={previewLook}
            className="group relative w-[62%] shrink-0 snap-start overflow-hidden bg-neutral-900 sm:w-[34%] lg:w-[22%]"
          >
            <div className="aspect-[3/4]">
              <img src={look.image} alt={look.name} className="h-full w-full object-cover object-top opacity-80 transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            </div>
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white">
              <Lock className="h-5 w-5" strokeWidth={1.5} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">Coming Soon</span>
            </div>
            <span className="absolute left-3 top-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">{look.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function NotifyMe() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    setEmail('');
  };

  return (
    <section className="bg-[#F7F5F0] px-5 py-20 text-center md:px-8 md:py-28">
      <div className="mx-auto max-w-lg">
        <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-black md:text-4xl">
          Be the First to Know
        </h2>
        <p className="mt-3 text-sm font-light leading-relaxed text-neutral-600">
          Leave your email and we&apos;ll notify you the moment SATURNA Christmas &amp; Winter goes live.
        </p>
        {sent ? (
          <p className="mx-auto mt-8 max-w-md border border-black/15 bg-white px-6 py-5 font-display text-lg font-semibold uppercase tracking-tight text-black">
            Thank you — we&apos;ll be in touch.
          </p>
        ) : (
          <form onSubmit={submit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" strokeWidth={1.5} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full border border-black/15 bg-white py-4 pl-11 pr-4 text-sm font-light text-black placeholder:text-neutral-400 focus:border-black focus:outline-none"
              />
            </div>
            <button type="submit" className="bg-black px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#5A1825]">
              Notify Me
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default function ChristmasPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] font-body antialiased">
      <Helmet>
        <html lang="en" />
        <title>Christmas &amp; Winter — Coming Soon | SATURNA™</title>
        <meta
          name="description"
          content="SATURNA Christmas & Winter — a new season is coming. Coming soon: December 2026."
        />
      </Helmet>
      <Seo
        title="Christmas & Winter — Coming Soon | SATURNA™"
        description="A new season is coming. SATURNA Christmas & Winter — coming soon."
        image={SATURNA_OG_IMAGE}
        siteName="SATURNA"
      />
      <BrandHeader />
      <main>
        <Hero />
        <CategoryPreview />
        <LookPreview />
        <NotifyMe />
      </main>
      <BrandFooter />
    </div>
  );
}
