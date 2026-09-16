/**
 * SATURNA Regional i18n
 * ---------------------
 * Four regional markets share ONE boutique and ONE product catalogue.
 * Each route (/us, /co, /hk, /cn) binds a territory, a language and a currency
 * together. Product data is never duplicated or removed — only the UI strings,
 * currency and checkout locale adapt to the active region.
 *
 *   US  — United States   · English              · USD
 *   CO  — Colombia        · Español              · COP
 *   HK  — Hong Kong SAR   · English + 繁體中文    · HKD
 *   CN  — China mainland  · 简体中文              · CNY
 */

export const REGIONS = ['US', 'CO', 'HK', 'CN'];

export const REGION_META = {
    US: {
        marketId: 'US',
        route: '/us',
        flag: '🇺🇸',
        name: 'United States',
        nameLocal: 'United States',
        lang: 'English',
        htmlLang: 'en',
        checkoutLocale: 'en',
    },
    CO: {
        marketId: 'CO',
        route: '/co',
        flag: '🇨🇴',
        name: 'Colombia',
        nameLocal: 'Colombia',
        lang: 'Español',
        htmlLang: 'es',
        checkoutLocale: 'es',
    },
    HK: {
        marketId: 'HK',
        route: '/hk',
        flag: '🇭🇰',
        name: 'Hong Kong',
        nameLocal: '香港',
        lang: 'English · 繁體中文',
        htmlLang: 'zh-HK',
        checkoutLocale: 'en',
    },
    CN: {
        marketId: 'CN',
        route: '/cn',
        flag: '🇨🇳',
        name: 'China',
        nameLocal: '中国',
        lang: '简体中文',
        htmlLang: 'zh-CN',
        checkoutLocale: 'zh',
    },
};

/**
 * Localised UI strings per region. Keys are intentionally flat so the page
 * can read them as `t.hero.title` etc. Missing keys fall back to English (US).
 */
export const STRINGS = {
    US: {
        htmlLang: 'en',
        marketLine: 'UNITED STATES · USD',
        nav: [
            { label: 'New In', href: '#new' },
            { label: 'Collections', href: '#collections' },
            { label: 'Limited Edition', href: '#limited' },
            { label: 'World of SATURNA', href: '#woman' },
            { label: 'Store', href: '/store' },
            { label: 'About', href: '/about' },
        ],
        hero: {
            eyebrow: 'SATURNA™',
            title: 'Dark Femininity',
            sub: 'Aesthetic · Power · Freedom',
            desc: 'Dresses, bodysuits, tailoring and silk — designed for women who turn the night into their own territory.',
            cta1: 'Shop New In',
            cta2: 'Online Boutique',
        },
        justIn: {
            title: 'Just In',
            sub: 'NEW SEASON · 2026',
            desc: 'Structured silhouettes. Dark femininity. Pieces designed for the modern SATURNA woman.',
        },
        collections: {
            title: 'Collections',
            sub: 'SATURNA / Ready-to-wear · 18–25',
            items: [
                { en: 'CORSETS', local: 'Corsets', tag: 'Structure / Femininity / Attitude', cta: 'Shop Corsets' },
                { en: 'CARGO', local: 'Cargo', tag: 'Street / 18–25 / Silhouette', cta: 'Shop Cargo' },
                { en: 'LACE', local: 'Lace', tag: 'Everyday Dark Elegance', cta: 'Shop Lace' },
                { en: 'JACKETS', local: 'Jackets', tag: 'The Statement Piece', cta: 'Shop Jackets' },
                { en: 'DRESSES', local: 'Dresses', tag: 'After Dark', cta: 'Shop Dresses' },
            ],
        },
        limited: {
            eyebrow: 'SATURNA',
            title: 'Limited Edition',
            sub: 'Few pieces · One identity',
            desc: 'A selection of creations produced in limited quantity — sculptural coats, lace and evening silhouettes. Each piece, its own universe.',
            cta: 'Discover',
        },
        woman: {
            title: 'The SATURNA Woman',
            sub: 'Confidence · Mystery · Independence',
            quote: 'She doesn’t follow the silhouette. She defines it.',
            cta: 'Discover the Maison',
        },
        trust: [
            { main: 'Secure Payment', sub: 'PCI-DSS · SSL' },
            { main: 'Tracked Shipping', sub: 'USA · Colombia · Asia' },
            { main: 'Customer Care', sub: 'Mon–Fri · 10h–18h ET' },
            { main: 'Authentic SATURNA™', sub: 'Guaranteed genuine' },
        ],
        product: { addToBag: 'Add to Bag +', quickView: 'Quick View', limited: 'Limited' },
        footer: {
            tagline: 'Dark feminine fashion. USA · Colombia · Hong Kong / China. Apparel only.',
            shopTitle: 'Shop',
            shopLinks: [
                { label: 'Online Boutique', href: '/store' },
                { label: 'Espace Elegancia', href: '/elegancia' },
                { label: 'New In', href: '#new' },
                { label: 'Limited Edition', href: '#limited' },
            ],
            contactTitle: 'Contact',
            corpTitle: 'Corporate',
            rights: '© 2026 Swu-vision CORPORATION. All rights reserved. SATURNA™ Dark Fashion.',
        },
        seo: {
            title: 'SATURNA — Dark Fashion | United States (USD)',
            description: 'SATURNA dark feminine fashion. Dresses, bodysuits, tailoring and silk. Online boutique for the United States — USD pricing and secure checkout.',
        },
    },

    CO: {
        htmlLang: 'es',
        marketLine: 'COLOMBIA · COP',
        nav: [
            { label: 'Novedades', href: '#new' },
            { label: 'Colecciones', href: '#collections' },
            { label: 'Edición Limitada', href: '#limited' },
            { label: 'Mundo SATURNA', href: '#woman' },
            { label: 'Tienda', href: '/store' },
            { label: 'Acerca de', href: '/about' },
        ],
        hero: {
            eyebrow: 'SATURNA™',
            title: 'Moda Oscura Femenina',
            sub: 'Estética · Poder · Libertad',
            desc: 'Vestidos, bodysuits, sastrería y seda — diseñados para mujeres que convierten la noche en territorio propio.',
            cta1: 'Ver Novedades',
            cta2: 'Boutique en Línea',
        },
        justIn: {
            title: 'Novedades',
            sub: 'NUEVA TEMPORADA · 2026',
            desc: 'Siluetas estructuradas. Feminidad oscura. Piezas diseñadas para la mujer SATURNA moderna.',
        },
        collections: {
            title: 'Colecciones',
            sub: 'SATURNA / Prêt-à-porter · 18–25',
            items: [
                { en: 'CORSETS', local: 'Corsets', tag: 'Estructura / Feminidad / Actitud', cta: 'Ver Corsets' },
                { en: 'CARGO', local: 'Cargo', tag: 'Calle / 18–25 / Silueta', cta: 'Ver Cargo' },
                { en: 'LACE', local: 'Encaje', tag: 'Elegancia oscura diaria', cta: 'Ver Encaje' },
                { en: 'JACKETS', local: 'Chaquetas', tag: 'La pieza statement', cta: 'Ver Chaquetas' },
                { en: 'DRESSES', local: 'Vestidos', tag: 'Después del oscuro', cta: 'Ver Vestidos' },
            ],
        },
        limited: {
            eyebrow: 'SATURNA',
            title: 'Edición Limitada',
            sub: 'Pocas piezas · Una identidad',
            desc: 'Una selección de creaciones producidas en cantidad limitada — abrigos escultóricos, encaje y siluetas de noche. Cada pieza, un universo propio.',
            cta: 'Descubrir',
        },
        woman: {
            title: 'La Mujer SATURNA',
            sub: 'Confianza · Misterio · Independencia',
            quote: 'Ella no sigue la silueta. Ella la define.',
            cta: 'Conocer la Maison',
        },
        trust: [
            { main: 'Pago Seguro', sub: 'PCI-DSS · SSL' },
            { main: 'Envío con Seguimiento', sub: 'Colombia · USA · Asia' },
            { main: 'Atención al Cliente', sub: 'Lun–Vie · 10h–18h' },
            { main: 'SATURNA™ Original', sub: 'Garantía de autenticidad' },
        ],
        product: { addToBag: 'Añadir a la Bolsa +', quickView: 'Vista Rápida', limited: 'Limitado' },
        footer: {
            tagline: 'Moda oscura femenina. USA · Colombia · Hong Kong / China. Solo prendas de vestir.',
            shopTitle: 'Tienda',
            shopLinks: [
                { label: 'Boutique en Línea', href: '/store' },
                { label: 'Espace Elegancia', href: '/elegancia' },
                { label: 'Novedades', href: '#new' },
                { label: 'Edición Limitada', href: '#limited' },
            ],
            contactTitle: 'Contacto',
            corpTitle: 'Corporativo',
            rights: '© 2026 Swu-vision CORPORATION. Todos los derechos reservados. SATURNA™ Dark Fashion.',
        },
        seo: {
            title: 'SATURNA — Moda Oscura | Colombia (COP)',
            description: 'SATURNA moda oscura femenina. Vestidos, bodysuits, sastrería y seda. Boutique en línea para Colombia — precios en COP y pago seguro.',
        },
    },

    HK: {
        htmlLang: 'zh-HK',
        marketLine: '香港 HONG KONG · HKD',
        nav: [
            { label: 'New In 新品', href: '#new' },
            { label: 'Collections 系列', href: '#collections' },
            { label: 'Limited 限量', href: '#limited' },
            { label: 'World of SATURNA', href: '#woman' },
            { label: 'Store 商店', href: '/store' },
            { label: 'About 關於', href: '/about' },
        ],
        hero: {
            eyebrow: 'SATURNA™',
            title: 'Dark Femininity',
            sub: '現代女性 · 黑暗美學',
            desc: 'Dresses, bodysuits, tailoring and silk — 為將黑夜化為自身領地的女性而設計。',
            cta1: 'Shop New In',
            cta2: '探索女裝',
        },
        justIn: {
            title: 'Just In 新品到店',
            sub: 'NEW SEASON · 2026',
            desc: 'Structured silhouettes. Dark femininity. 為現代 SATURNA 女性而設計的單品。',
        },
        collections: {
            title: 'Collections 系列',
            sub: 'SATURNA / 成衣 · 18–25',
            items: [
                { en: 'CORSETS', local: '緊身胸衣', tag: '結構 / 女性力量 / 態度', cta: 'Shop Corsets' },
                { en: 'CARGO', local: '工裝', tag: '街頭 / 18–25 / 輪廓', cta: 'Shop Cargo' },
                { en: 'LACE', local: '蕾絲', tag: '日常暗黑優雅', cta: 'Shop Lace' },
                { en: 'JACKETS', local: '外套', tag: '聲明單品', cta: 'Shop Jackets' },
                { en: 'DRESSES', local: '連衣裙', tag: '夜色之後', cta: 'Shop Dresses' },
            ],
        },
        limited: {
            eyebrow: 'SATURNA',
            title: 'Limited Edition',
            sub: '少量限定系列',
            desc: 'A selection of creations produced in limited quantity — sculptural coats, lace and evening silhouettes. 精選限量剪裁。',
            cta: 'Discover 發現',
        },
        woman: {
            title: 'The SATURNA Woman',
            sub: '自信 · 神秘 · 獨立',
            quote: 'She doesn’t follow the silhouette. She defines it. 她不追隨輪廓，她定義輪廓。',
            cta: 'Discover the Maison',
        },
        trust: [
            { main: 'Secure Payment', sub: 'PCI-DSS · SSL' },
            { main: 'Tracked Shipping', sub: '香港 · 全球' },
            { main: 'Customer Care', sub: 'Mon–Fri · 10h–18h HKT' },
            { main: 'Authentic SATURNA™', sub: '正品保障' },
        ],
        product: { addToBag: 'Add to Bag +', quickView: 'Quick View', limited: '限量' },
        footer: {
            tagline: 'Dark modern luxury. 國際品牌美學，為香港而設。',
            shopTitle: 'Shop',
            shopLinks: [
                { label: 'Online Boutique', href: '/store' },
                { label: 'Espace Elegancia', href: '/elegancia' },
                { label: 'New In', href: '#new' },
                { label: 'Limited Edition', href: '#limited' },
            ],
            contactTitle: 'Contact',
            corpTitle: 'Corporate',
            rights: '© 2026 SATURNA™ · SWU-VISION GROUP LIMITED',
        },
        seo: {
            title: 'SATURNA™ Hong Kong — Dark Modern Luxury (HKD)',
            description: 'SATURNA™ dark modern luxury boutique for Hong Kong. Corsets, bodysuits, tops, jackets and dresses. HKD pricing and secure checkout.',
        },
    },

    CN: {
        htmlLang: 'zh-CN',
        marketLine: '中国内地 · CNY',
        nav: [
            { label: '新品', href: '#new' },
            { label: '系列', href: '#collections' },
            { label: '限量', href: '#limited' },
            { label: 'SATURNA 世界', href: '#woman' },
            { label: '商店', href: '/store' },
            { label: '关于', href: '/about' },
        ],
        hero: {
            eyebrow: 'SATURNA™',
            title: '暗黑女性气质',
            sub: '美学 · 力量 · 自由',
            desc: '连衣裙、连体衣、西装与丝绸 — 为将黑夜化为自身领地的女性而设计。',
            cta1: '查看新品',
            cta2: '在线精品店',
        },
        justIn: {
            title: '新品到店',
            sub: '新季 · 2026',
            desc: '结构化轮廓。暗黑女性气质。为现代 SATURNA 女性打造的单品。',
        },
        collections: {
            title: '系列',
            sub: 'SATURNA / 成衣 · 18–25',
            items: [
                { en: 'CORSETS', local: '胸衣', tag: '结构 / 女性力量 / 态度', cta: '查看胸衣' },
                { en: 'CARGO', local: '工装', tag: '街头 / 18–25 / 轮廓', cta: '查看工装' },
                { en: 'LACE', local: '蕾丝', tag: '暗黑优雅日常', cta: '查看蕾丝' },
                { en: 'JACKETS', local: '外套', tag: '声明单品', cta: '查看外套' },
                { en: 'DRESSES', local: '连衣裙', tag: '夜色之后', cta: '查看裙装' },
            ],
        },
        limited: {
            eyebrow: 'SATURNA',
            title: '限量系列',
            sub: '少量限定 · 唯一身份',
            desc: '精选限量制作的单品 — 雕塑感大衣、蕾丝与晚装轮廓。每一件，都是独立宇宙。',
            cta: '发现',
        },
        woman: {
            title: 'SATURNA 女性',
            sub: '自信 · 神秘 · 独立',
            quote: '她不追随轮廓。她定义轮廓。',
            cta: '了解品牌',
        },
        trust: [
            { main: '安全支付', sub: 'PCI-DSS · SSL' },
            { main: '物流追踪', sub: '中国内地 · 全球' },
            { main: '客户服务', sub: '周一–周五 · 10h–18h' },
            { main: 'SATURNA™ 正品', sub: '正品保障' },
        ],
        product: { addToBag: '加入购物袋 +', quickView: '快速预览', limited: '限量' },
        footer: {
            tagline: '暗黑女性时尚。美国 · 哥伦比亚 · 香港 / 中国。仅限服装。',
            shopTitle: '商店',
            shopLinks: [
                { label: '在线精品店', href: '/store' },
                { label: 'Espace Elegancia', href: '/elegancia' },
                { label: '新品', href: '#new' },
                { label: '限量系列', href: '#limited' },
            ],
            contactTitle: '联系',
            corpTitle: '企业',
            rights: '© 2026 Swu-vision CORPORATION. 保留所有权利。SATURNA™ Dark Fashion。',
        },
        seo: {
            title: 'SATURNA — 暗黑时尚 | 中国内地 (CNY)',
            description: 'SATURNA 暗黑女性时尚。连衣裙、连体衣、西装与丝绸。中国内地在线精品店 — 人民币定价与安全支付。',
        },
    },
};

/** Resolve strings for a region, falling back to US English. */
export function getStrings(regionId) {
    return STRINGS[regionId] || STRINGS.US;
}
