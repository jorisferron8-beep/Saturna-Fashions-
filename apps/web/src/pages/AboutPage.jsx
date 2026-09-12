import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { useGeoMarket, MARKETS } from '@/context/CurrencyContext';
import Seo from '@/components/Seo';
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
        cn: '个性',
        en: 'INDIVIDUALITY',
        textCn: '每件单品为展现穿戴者的独特性而设计——从不统一、从不复制。',
        textEn: 'Every piece is cut to reveal who wears it — never to uniform her.',
    },
    {
        n: '02',
        cn: '自由',
        en: 'FREEDOM',
        textCn: '无需许可的穿衣权。SATURNA 拒绝固定规则，庆祝完整的自我。',
        textEn: 'Dress without permission. SATURNA rejects fixed codes and celebrates being fully yourself.',
    },
    {
        n: '03',
        cn: '创造力',
        en: 'CREATIVITY',
        textCn: '工作室是实验室：对比材质、大胆剪裁、讲述故事的细节。',
        textEn: 'The atelier is a lab: contrasting materials, bold cuts, details that tell a story.',
    },
    {
        n: '04',
        cn: '真实',
        en: 'AUTHENTICITY',
        textCn: '没有伪装。黑暗、感性、诚实的美学——与选择它的真实女性对齐。',
        textEn: 'No facade. A dark, sensual, honest aesthetic — aligned with the real woman who chooses it.',
    },
    {
        n: '05',
        cn: '反叛',
        en: 'REBELLION',
        textCn: '对抗平淡奢华与匿名成衣。SATURNA 是一种态度：优雅、锋利、自由。',
        textEn: 'Against bland luxury and anonymous ready-to-wear. SATURNA is an attitude: elegant, sharp, free.',
    },
];

const HK_ADDRESS = [
    'Unit 2904-05, 29/F, Universal Trade Centre',
    '3 Arbuthnot Road, Central',
    'Hong Kong S.A.R.',
];

function MarketPill() {
    const { marketId, selectMarket, autoDetecting } = useGeoMarket();
    return (
        <label className="inline-flex items-center gap-1.5">
            <select
                value={marketId}
                onChange={(e) => selectMarket(e.target.value)}
                className="cursor-pointer border-0 bg-transparent py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-600 outline-none hover:text-black"
                aria-label="市场 / Market"
            >
                {MARKETS.map((m) => (
                    <option key={m.id} value={m.id}>
                        {m.flag} {m.region} · {m.currency.code}
                    </option>
                ))}
            </select>
            {autoDetecting ? (
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#5A1825]" aria-hidden />
            ) : null}
        </label>
    );
}

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
        { label: '首页 / Home', to: '/' },
        { label: '商店 / Shop', to: '/store' },
        { label: '中国 / HK', to: '/cn' },
        { label: '优雅 / Elegancia', to: '/elegancia' },
    ];

    return (
        <>
            <div className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-[#F7F5F0]">
                <div className="flex items-center justify-center gap-4 border-b border-black/5 px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                    <span>全球配送 · 香港运营 · 精选女装</span>
                    <span className="text-neutral-300">·</span>
                    <MarketPill />
                </div>
                <header
                    className={`mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-3.5 md:px-8 ${
                        scrolled ? 'shadow-[0_1px_0_rgba(0,0,0,0.06)]' : ''
                    }`}
                >
                    <button type="button" className="text-black md:hidden" onClick={() => setOpen(true)} aria-label="菜单">
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
                        选购 / SHOP
                    </Link>
                </header>
            </div>
            {open ? (
                <div className="fixed inset-0 z-[70] flex flex-col bg-[#F7F5F0] md:hidden">
                    <div className="flex h-14 items-center justify-between px-5">
                        <img src={LOGO} alt="" className="h-8 w-auto max-w-[9rem] object-contain" />
                        <button type="button" onClick={() => setOpen(false)} aria-label="关闭">
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
                <title>关于我们 / About — SATURNA™ | 美学 · 力量 · 自由</title>
                <meta
                    name="description"
                    content="SATURNA™ 品牌故事、使命、愿景与价值观。Dark fashion for women 18–25. Hong Kong · China · USA · Colombia."
                />
                <html lang="zh-Hans" />
                <link rel="icon" type="image/png" href={SATURNA_LOGO} />
            </Helmet>
            <Seo
                title="关于我们 / About — SATURNA™"
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
                    <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-white/70">关于我们 · ABOUT</p>
                    <h1 className="mt-3 font-display text-5xl font-bold uppercase leading-[0.92] tracking-tight text-white md:text-7xl lg:text-8xl">
                        SATURNA
                    </h1>
                    <p className="mt-4 max-w-xl text-base font-light leading-relaxed text-white/85 md:text-lg">
                        美学 · 力量 · 自由
                        <span className="mt-1 block text-sm tracking-[0.12em] text-white/60">
                            AESTHETICS · POWER · FREEDOM
                        </span>
                    </p>
                    <p className="mt-6 max-w-lg text-sm font-light leading-relaxed text-white/75 md:text-[15px]">
                        面向 18–25 岁年轻女性的暗黑奢华时装。从香港到全球——结构、蕾丝、工装与态度。
                        <span className="mt-2 block text-white/55">
                            Dark luxury fashion for women 18–25. From Hong Kong to the world — structure, lace, cargo and attitude.
                        </span>
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
                        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#5A1825]">01 — 起源 / ORIGIN</p>
                        <h2 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight md:text-5xl">
                            我们的故事
                            <span className="mt-2 block text-2xl font-medium tracking-[0.08em] text-neutral-500 md:text-3xl">
                                Our Story
                            </span>
                        </h2>
                    </Reveal>
                    <Reveal delay={0.06}>
                        <div className="mt-8 space-y-5 text-[15px] font-light leading-relaxed text-neutral-700">
                            <p>
                                SATURNA 诞生于一种执念：为拒绝缩小自己的女性着装。品牌在香港运营，连接美国、哥伦比亚与中国大陆，编织暗黑奢华轮廓——皮革、丝绸、蕾丝与锋利剪裁——献给以夜为舞台的年轻世代。
                            </p>
                            <p className="text-neutral-500">
                                SATURNA was born from an obsession: dressing the woman who refuses to make herself small. Operated from Hong Kong and spanning the Americas and Asia, the house builds a dark-luxury silhouette — leather, silk, lace and sharp cuts — for a generation that walks the night like a temple.
                            </p>
                            <p>
                                在 SWU-VISION GROUP LIMITED 运营下，SATURNA 取名自土星：纪律与神秘，黑暗核心外的光环。每季系列是一次轨道——精准、感性、毫不妥协。
                            </p>
                            <p className="text-neutral-500">
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
                            kCn: '宗旨',
                            kEn: 'PURPOSE',
                            tCn: '塑造女性力量美学——黑暗、精致、无需道歉。',
                            tEn: 'Shape an aesthetic of feminine power — dark, refined, unapologetic.',
                        },
                        {
                            kCn: '使命',
                            kEn: 'MISSION',
                            tCn: '创造解放身体与态度的单品：从礼服到街头 body，每一刀剪裁都在宣告你是谁。',
                            tEn: 'Create pieces that free body and attitude: from gala dress to street body, every cut affirms who you are.',
                        },
                        {
                            kCn: '愿景',
                            kEn: 'VISION',
                            tCn: '成为美洲与亚洲之间女性 dark fashion 的全球参照——轨道之家，而非快时尚。',
                            tEn: 'Become the global reference for women’s dark fashion between the Americas and Asia — an orbital house, never disposable fashion.',
                        },
                    ].map((b, i) => (
                        <Reveal key={b.kEn} delay={i * 0.05}>
                            <div className={`h-full px-8 py-14 md:px-10 ${i < 2 ? 'border-b border-white/10 md:border-b-0 md:border-r' : ''}`}>
                                <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#c4a0a8]">
                                    {b.kCn} · {b.kEn}
                                </p>
                                <p className="mt-5 text-sm font-light leading-relaxed text-white/85">{b.tCn}</p>
                                <p className="mt-3 text-sm font-light leading-relaxed text-white/45">{b.tEn}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* Values */}
            <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-8 md:py-28">
                <Reveal>
                    <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#5A1825]">准则 · CODES</p>
                    <h2 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight md:text-5xl">
                        我们的价值观
                        <span className="mt-2 block text-2xl font-medium tracking-[0.08em] text-neutral-500 md:text-3xl">
                            Our Values
                        </span>
                    </h2>
                </Reveal>
                <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {VALUES.map((v, i) => (
                        <Reveal key={v.n} delay={i * 0.04}>
                            <article className="group h-full border border-black/10 bg-white/40 p-7 transition-colors hover:border-[#5A1825]/40">
                                <span className="font-display text-3xl font-bold text-[#5A1825]/90">{v.n}</span>
                                <h3 className="mt-5 font-display text-xl font-semibold uppercase tracking-[0.1em]">
                                    {v.cn}
                                    <span className="mt-1 block text-sm font-medium tracking-[0.2em] text-neutral-500">{v.en}</span>
                                </h3>
                                <p className="mt-3 text-sm font-light leading-relaxed text-neutral-800">{v.textCn}</p>
                                <p className="mt-2 text-sm font-light leading-relaxed text-neutral-500">{v.textEn}</p>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* Gallery youth */}
            <section className="bg-[#0A0A0A] py-16 md:py-24">
                <div className="mx-auto max-w-[1440px] px-5 md:px-8">
                    <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-white/50">18–25 · 街头与夜晚</p>
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
                    <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#5A1825]">信条 · DOCTRINE</p>
                    <h2 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight md:text-5xl">
                        我们的哲学
                        <span className="mt-2 block text-2xl font-medium tracking-[0.08em] text-neutral-500">Our Philosophy</span>
                    </h2>
                </Reveal>
                <Reveal delay={0.06}>
                    <p className="mt-10 text-[15px] font-light leading-relaxed text-neutral-700 md:text-base">
                        我们相信着装是一种仪式。穿上 SATURNA，就是选择强度：捕捉暗光的质感、雕塑轮廓的线条、令人印象深刻的沉默。
                    </p>
                    <p className="mt-4 text-[15px] font-light leading-relaxed text-neutral-500 md:text-base">
                        We believe dressing is a ritual. Wearing SATURNA is choosing intensity: textures that catch black light, lines that sculpt, silence that impresses. The house rejects decorative luxury — preferring atelier precision and the freedom of a woman who does not wait for permission.
                    </p>
                </Reveal>
                <Reveal delay={0.1}>
                    <div className="mt-14 border border-black/10 bg-white/50 px-8 py-12">
                        <img src={LOGO} alt="SATURNA" className="mx-auto h-16 w-auto max-w-[18rem] object-contain md:h-20" />
                        <p className="mt-6 text-[11px] uppercase tracking-[0.35em] text-neutral-500">美学 · 力量 · 自由</p>
                    </div>
                </Reveal>
                <Link
                    to="/store"
                    className="mt-12 inline-flex items-center gap-2 border border-black bg-black px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:bg-[#5A1825] hover:border-[#5A1825]"
                >
                    进入商店 / ENTER SHOP
                    <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </Link>
            </section>

            <footer className="border-t border-black/10 bg-[#0A0A0A] px-5 py-14 text-[#F7F5F0] md:px-8">
                <div className="mx-auto grid max-w-[1440px] gap-10 md:grid-cols-3">
                    <div>
                        <img src={LOGO} alt="SATURNA" className="h-10 w-auto max-w-[12rem] object-contain brightness-0 invert" />
                        <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-white/40">
                            中国 · 香港 · USA · Colombia
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">办公地址 / Office</p>
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
                            ← 首页 / Home
                        </Link>
                        <Link to="/legal" className="text-[11px] uppercase tracking-[0.25em] text-white/60 hover:text-white">
                            法律中心 / Legal
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
