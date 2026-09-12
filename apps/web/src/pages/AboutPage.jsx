import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import Reveal from '@/components/Reveal';
import Seo from '@/components/Seo';
import RegionSwitcher from '@/components/RegionSwitcher';
import { SATURNA_LOGO, SATURNA_OG_IMAGE } from '@/lib/brand';

const LOGO = SATURNA_LOGO;

const IMG = {
    hero: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/6463e4a6ae2196508e930e0c6697b1fd.jpg',
    story: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/e635ab1e92dfdf4870ea35beec6b3ff7.jpg',
    street: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/cd09225766c3f80e8956b48d62a49cf5.jpg',
    lace: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/986a6ea2df7c6be52ac939df0da1bf93.jpg',
    denim: 'https://horizons-cdn.hostinger.com/f61795ef-0633-4135-9be7-be2789d2a9fe/2185b74a310095d60467538427bb28df.jpg',
};

const VALUES = [
    {
        n: '01',
        en: 'INDIVIDUALITY',
        textEn: 'Every piece is cut to reveal who wears it — never to uniform her.',
    },
    {
        n: '02',
        en: 'FREEDOM',
        textEn: 'Dress without permission. SATURNA rejects fixed codes and celebrates being fully yourself.',
    },
    {
        n: '03',
        en: 'CREATIVITY',
        textEn: 'The atelier is a lab: contrasting materials, bold cuts, details that tell a story.',
    },
    {
        n: '04',
        en: 'AUTHENTICITY',
        textEn: 'No facade. A dark, sensual, honest aesthetic — aligned with the real woman who chooses it.',
    },
    {
        n: '05',
        en: 'REBELLION',
        textEn: 'Against bland luxury and anonymous ready-to-wear. SATURNA is an attitude: elegant, sharp, free.',
    },
];

const HK_ADDRESS = [
    'Unit 2904-05, 29/F, Universal Trade Centre',
    '3 Arbuthnot Road, Central',
    'Hong Kong S.A.R.',
];

function Header() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const nav = [
        { label: 'Home', to: '/' },
        { label: 'Shop', to: '/store' },
        { label: 'China / HK', to: '/cn' },
        { label: 'Elegancia', to: '/elegancia' },
    ];

    return (
        <>
            <div className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-[#F7F5F0]">
                <div className="flex items-center justify-center gap-4 border-b border-black/5 px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                    <span>Worldwide Shipping · Hong Kong Operated · Curated Womenswear</span>
                    <span className="text-neutral-300">·</span>
                    <RegionSwitcher light />
                </div>
                <header
                    className={`mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-3.5 md:px-8 ${
                        scrolled ? 'shadow-[0_1px_0_rgba(0,0,0,0.06)]' : ''
                    }`}
                >
                    <button type="button" className="text-black md:hidden" onClick={() => setOpen(true)} aria-label="Menu">
                        <Menu className="h-5 w-5" strokeWidth={1.5} />
                    </button>
                    <nav className="hidden items-center gap-6 md:flex">
                        {nav.map((l) => (
                            <Link
                                key={l.to}
                                to={l.to}
                                className="text-[11px] font-medium uppercase tracking-[0.18em] text-black/70 transition-colors hover:text-black"
                            >
                                {l.label}
                            </Link>
                        ))}
                    </nav>
                    <Link to="/" className="absolute left-1/2 -translate-x-1/2" aria-label="SATURNA">
                        <img src={LOGO} alt="SATURNA" className="h-8 w-auto max-w-[10rem] object-contain md:h-10 md:max-w-[13rem]" />
                    </Link>
                    <Link
                        to="/store"
                        className="ml-auto border border-black bg-black px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#5A1825] hover:border-[#5A1825]"
                    >
                        Shop
                    </Link>
                </header>
            </div>
            {open ? (
                <div className="fixed inset-0 z-[70] flex flex-col bg-[#F7F5F0] md:hidden">
                    <div className="flex h-14 items-center justify-between px-5">
                        <img src={LOGO} alt="" className="h-8 w-auto max-w-[9rem] object-contain" />
                        <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                            <X className="h-6 w-6" strokeWidth={1.5} />
                        </button>
                    </div>
                    <nav className="flex flex-1 flex-col items-center justify-center gap-8 font-display text-2xl font-semibold uppercase tracking-[0.12em]">
                        {nav.map((l) => (
                            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>
                                {l.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            ) : null}
        </>
    );
}

export default function AboutPage() {
    return (
        <div className="min-h-[100dvh] bg-[#F7F5F0] font-body text-black antialiased">
            <Helmet>
                <title>About — SATURNA™ | Aesthetics · Power · Freedom</title>
                <meta
                    name="description"
                    content="SATURNA™ brand story, mission, vision and values. Dark fashion for women 18–25. Hong Kong · China · USA · Colombia."
                />
                <html lang="en" />
                <link rel="icon" type="image/png" href={SATURNA_LOGO} />
            </Helmet>
            <Seo
                title="About — SATURNA™"
                description="SATURNA brand story, mission, vision and values. Dark fashion for young women."
                image={SATURNA_OG_IMAGE}
                siteName="SATURNA"
            />
            <Header />

            {/* Hero */}
            <section className="relative mt-[5.5rem] min-h-[72dvh] overflow-hidden md:mt-[6.25rem]">
                <img src={IMG.hero} alt="" className="absolute inset-0 h-full w-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20" />
                <div className="relative mx-auto flex min-h-[72dvh] max-w-[1440px] flex-col justify-end px-5 pb-16 pt-32 md:px-8 md:pb-24">
                    <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-white/70">ABOUT</p>
                    <h1 className="mt-3 font-display text-5xl font-bold uppercase leading-[0.92] tracking-tight text-white md:text-7xl lg:text-8xl">
                        SATURNA
                    </h1>
                    <p className="mt-4 max-w-xl text-base font-light leading-relaxed text-white/85 md:text-lg">
                        AESTHETICS · POWER · FREEDOM
                    </p>
                    <p className="mt-6 max-w-lg text-sm font-light leading-relaxed text-white/75 md:text-[15px]">
                        Dark luxury fashion for women 18–25. From Hong Kong to the world — structure, lace, cargo and attitude.
                    </p>
                </div>
            </section>

            {/* Story split */}
            <section className="mx-auto grid max-w-[1440px] gap-0 md:grid-cols-2">
                <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[560px]">
                    <img src={IMG.story} alt="" className="absolute inset-0 h-full w-full object-cover" />
                </div>
                <div className="flex flex-col justify-center px-6 py-16 md:px-14 md:py-24 lg:px-20">
                    <Reveal>
                        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#5A1825]">01 — Origin</p>
                        <h2 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight md:text-5xl">
                            Our Story
                        </h2>
                    </Reveal>
                    <Reveal delay={0.06}>
                        <div className="mt-8 space-y-5 text-[15px] font-light leading-relaxed text-neutral-700">
                            <p>
                                SATURNA was born from an obsession: dressing the woman who refuses to make herself small. Operated from Hong Kong and spanning the Americas and Asia, the house builds a dark-luxury silhouette — leather, silk, lace and sharp cuts — for a generation that walks the night like a temple.
                            </p>
                            <p>
                                Under SWU-VISION GROUP LIMITED, SATURNA draws from Saturn: discipline and mystery, rings of light around a dark core. Each collection is an orbit — precise, sensual, uncompromising.
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* Mission strip */}
            <section className="border-y border-black/10 bg-[#0A0A0A] text-[#F7F5F0]">
                <div className="mx-auto grid max-w-[1440px] md:grid-cols-3">
                    {[
                        {
                            kEn: 'PURPOSE',
                            tEn: 'Shape an aesthetic of feminine power — dark, refined, unapologetic.',
                        },
                        {
                            kEn: 'MISSION',
                            tEn: 'Create pieces that free body and attitude: from gala dress to street body, every cut affirms who you are.',
                        },
                        {
                            kEn: 'VISION',
                            tEn: 'Become the global reference for women’s dark fashion between the Americas and Asia — an orbital house, never disposable fashion.',
                        },
                    ].map((b, i) => (
                        <Reveal key={b.kEn} delay={i * 0.05}>
                            <div className={`h-full px-8 py-14 md:px-10 ${i < 2 ? 'border-b border-white/10 md:border-b-0 md:border-r' : ''}`}>
                                <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#c4a0a8]">
                                    {b.kEn}
                                </p>
                                <p className="mt-5 text-sm font-light leading-relaxed text-white/85">{b.tEn}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* Values */}
            <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-8 md:py-28">
                <Reveal>
                    <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#5A1825]">CODES</p>
                    <h2 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight md:text-5xl">
                        Our Values
                    </h2>
                </Reveal>
                <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {VALUES.map((v, i) => (
                        <Reveal key={v.n} delay={i * 0.04}>
                            <article className="group h-full border border-black/10 bg-white/40 p-7 transition-colors hover:border-[#5A1825]/40">
                                <span className="font-display text-3xl font-bold text-[#5A1825]/90">{v.n}</span>
                                <h3 className="mt-5 font-display text-xl font-semibold uppercase tracking-[0.1em]">
                                    {v.en}
                                </h3>
                                <p className="mt-3 text-sm font-light leading-relaxed text-neutral-800">{v.textEn}</p>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* Gallery youth */}
            <section className="bg-[#0A0A0A] py-16 md:py-24">
                <div className="mx-auto max-w-[1440px] px-5 md:px-8">
                    <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-white/50">18–25 · Street &amp; Night</p>
                    <h2 className="mt-2 font-display text-3xl font-bold uppercase text-white md:text-5xl">
                        THE SATURNA WOMAN
                    </h2>
                    <div className="mt-10 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
                        {[IMG.street, IMG.lace, IMG.denim, IMG.hero].map((src) => (
                            <div key={src} className="relative aspect-[3/4] overflow-hidden">
                                <img src={src} alt="" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Philosophy */}
            <section className="mx-auto max-w-3xl px-5 py-20 text-center md:px-8 md:py-28">
                <Reveal>
                    <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#5A1825]">DOCTRINE</p>
                    <h2 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight md:text-5xl">
                        Our Philosophy
                    </h2>
                </Reveal>
                <Reveal delay={0.06}>
                    <p className="mt-10 text-[15px] font-light leading-relaxed text-neutral-700 md:text-base">
                        We believe dressing is a ritual. Wearing SATURNA is choosing intensity: textures that catch black light, lines that sculpt, silence that impresses. The house rejects decorative luxury — preferring atelier precision and the freedom of a woman who does not wait for permission.
                    </p>
                </Reveal>
                <Reveal delay={0.1}>
                    <div className="mt-14 border border-black/10 bg-white/50 px-8 py-12">
                        <img src={LOGO} alt="SATURNA" className="mx-auto h-16 w-auto max-w-[18rem] object-contain md:h-20" />
                        <p className="mt-6 text-[11px] uppercase tracking-[0.35em] text-neutral-500">Aesthetics · Power · Freedom</p>
                    </div>
                </Reveal>
                <Link
                    to="/store"
                    className="mt-12 inline-flex items-center gap-2 border border-black bg-black px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:bg-[#5A1825] hover:border-[#5A1825]"
                >
                    Enter Shop
                    <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </Link>
            </section>

            <footer className="border-t border-black/10 bg-[#0A0A0A] px-5 py-14 text-[#F7F5F0] md:px-8">
                <div className="mx-auto grid max-w-[1440px] gap-10 md:grid-cols-3">
                    <div>
                        <img src={LOGO} alt="SATURNA" className="h-10 w-auto max-w-[12rem] object-contain brightness-0 invert" />
                        <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-white/40">
                            China · Hong Kong · USA · Colombia
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">Office</p>
                        <p className="mt-3 text-sm font-light leading-relaxed text-white/75">
                            SWU-VISION GROUP LIMITED
                            <br />
                            {HK_ADDRESS.map((line) => (
                                <span key={line} className="block">
                                    {line}
                                </span>
                            ))}
                            <span className="mt-2 block text-white/45">Reg. No. 80605496</span>
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 md:items-end">
                        <Link to="/" className="text-[11px] uppercase tracking-[0.25em] text-white/60 hover:text-white">
                            ← Home
                        </Link>
                        <Link to="/legal" className="text-[11px] uppercase tracking-[0.25em] text-white/60 hover:text-white">
                            Legal Centre
                        </Link>
                        <a href="mailto:customerservice@saturna-fashions.com" className="text-sm font-light text-white/70 hover:text-white">
                            customerservice@saturna-fashions.com
                        </a>
                    </div>
                </div>
                <p className="mx-auto mt-12 max-w-[1440px] text-center text-[10px] uppercase tracking-[0.2em] text-white/35">
                    © 2026 SATURNA™ · SWU-VISION GROUP LIMITED · Hong Kong S.A.R.
                </p>
            </footer>
        </div>
    );
}
