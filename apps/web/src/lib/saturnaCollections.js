/**
 * SATURNA — flagship collections, pieces, looks and stories.
 *
 * This is the editorial catalogue that powers the Home page, the five
 * collection pages, the lookbook and the piece (product) page. It is a
 * separate, curated catalogue from the live WooCommerce-backed store
 * (`/store`) and from SATURNA ELEGANCE (`/elegancia`) — its purpose is to
 * present SATURNA as a fashion house with named collections and styled
 * looks, not a flat product feed.
 *
 * Prices are stored in USD cents so the Geo-Market engine can convert them
 * per active market via `formatFromUsdCents`.
 */
import { IMG } from '@/lib/brandImagery';

export const COLLECTIONS = [
  {
    slug: 'dark-rebel',
    name: 'Dark Rebel',
    nameZh: '暗黑叛逆',
    tagline: 'Gothic streetwear meets feminine attitude.',
    description:
      'Structured corsetry against raw denim and faux leather — the SATURNA woman who turns the street into her own runway.',
    tags: ['Gothic streetwear', 'Denim', 'Corsets', 'Mesh', 'Oversized'],
    filters: ['Tops', 'Bodies', 'Denim', 'Skirts', 'Jackets'],
    image: IMG.hero,
  },
  {
    slug: 'dark-feminine',
    name: 'Dark Feminine',
    nameZh: '暗黑女性',
    tagline: 'Lace, bodies and fitted silhouettes.',
    description:
      'Second-skin silhouettes in lace and satin — softness sharpened into a statement.',
    tags: ['Lace', 'Bodies', 'Fitted silhouettes'],
    filters: ['Dresses', 'Bodies', 'Tops'],
    image: IMG.laceDress,
  },
  {
    slug: 'street-luxe',
    name: 'Street Luxe',
    nameZh: '都市奢华',
    tagline: 'Urban tailoring, elevated.',
    description:
      'Oversized denim, structured blazers and utility trousers — street proportions with a luxury hand.',
    tags: ['Urban', 'Denim', 'Jackets', 'Oversized'],
    filters: ['Denim', 'Jackets', 'Blazers', 'Trousers'],
    image: IMG.coat,
  },
  {
    slug: 'night-edit',
    name: 'Night Edit',
    nameZh: '夜色系列',
    tagline: 'Party. Evening. After dark.',
    description:
      'Dresses, corsets and evening silhouettes built for the hours after sunset.',
    tags: ['Party', 'Evening', 'Dresses', 'Corsets'],
    filters: ['Dresses', 'Corsets', 'Bodies', 'Skirts', 'Jackets'],
    image: IMG.satin,
  },
  {
    slug: 'essentials',
    name: 'Essentials',
    nameZh: '基础系列',
    tagline: 'Everyday SATURNA pieces.',
    description:
      'The foundation of the SATURNA wardrobe — quiet, wearable, unmistakably dark feminine.',
    tags: ['Everyday', 'Layering', 'Foundation'],
    filters: ['Tops', 'Trousers', 'Dresses', 'Denim', 'Skirts'],
    image: IMG.blouse,
  },
];

const c = (
  n,
  name,
  collectionSlug,
  category,
  priceUsd,
  description,
  colors,
  image,
  hover,
) => ({
  sku: `SAT-${n}`,
  name,
  collectionSlug,
  category,
  priceInCents: priceUsd * 100,
  description,
  colors,
  sizes: ['XS', 'S', 'M', 'L'],
  image,
  hover: hover || image,
});

export const PRODUCTS = [
  // ---------------------------- Dark Rebel ----------------------------
  c(101, 'Rebel Corset', 'dark-rebel', 'Bodies', 89,
    'A structured black corset with exposed boning — the anchor piece of the Dark Rebel line.',
    ['Black', 'Burgundy'], IMG.satin, IMG.coat),
  c(102, 'Rebel Denim', 'dark-rebel', 'Denim', 119,
    'Raw, high-rise denim cut for movement, distressed at the knee and hem.',
    ['Black', 'Washed Grey'], IMG.laceTop, IMG.street),
  c(103, 'Faux Leather Jacket', 'dark-rebel', 'Jackets', 139,
    'Faux leather biker jacket with asymmetric zip and discreet hardware.',
    ['Black'], IMG.hero, IMG.coat),
  c(104, 'Dark Bomber', 'dark-rebel', 'Jackets', 129,
    'Cropped bomber in matte nylon, quilted lining, ribbed cuffs.',
    ['Black', 'Dark Chocolate'], IMG.coat, IMG.hero),
  c(105, 'Mesh Panel Top', 'dark-rebel', 'Tops', 59,
    'Sheer mesh top with contrast seaming, worn alone or layered.',
    ['Black'], IMG.blouse, IMG.laceTop),
  c(106, 'Rebel Mini Skirt', 'dark-rebel', 'Skirts', 69,
    'A-line mini in structured twill with a hidden zip closure.',
    ['Black', 'Burgundy'], IMG.dress, IMG.satin),

  // -------------------------- Dark Feminine ----------------------------
  c(201, 'Noir Lace Dress', 'dark-feminine', 'Dresses', 129,
    'Floor-grazing lace dress with a fitted bodice and sheer sleeves.',
    ['Black'], IMG.laceDress, IMG.dress),
  c(202, 'Second Skin Bodysuit', 'dark-feminine', 'Bodies', 79,
    'Second-skin bodysuit in matte satin — the base layer of the Dark Feminine wardrobe.',
    ['Black', 'Ivory'], IMG.satin, IMG.blouse),
  c(203, 'Sheer Lace Top', 'dark-feminine', 'Tops', 59,
    'Chantilly lace top, fully lined, with a scalloped neckline.',
    ['Black', 'Ivory'], IMG.blouse, IMG.laceTop),
  c(204, 'Fitted Slip Dress', 'dark-feminine', 'Dresses', 99,
    'Bias-cut slip dress in liquid satin, cut to fall close to the body.',
    ['Black', 'Burgundy'], IMG.dress, IMG.laceDress),
  c(205, 'Velvet Corset Top', 'dark-feminine', 'Bodies', 89,
    'Velvet corset top with adjustable back lacing and boned structure.',
    ['Black', 'Dark Chocolate'], IMG.coat, IMG.satin),
  c(206, 'Lace Cami', 'dark-feminine', 'Tops', 49,
    'Delicate lace-trim camisole, worn solo or under tailoring.',
    ['Black', 'Ivory'], IMG.laceTop, IMG.blouse),

  // ---------------------------- Street Luxe ----------------------------
  c(301, 'Oversized Denim Jacket', 'street-luxe', 'Jackets', 139,
    'Oversized trucker jacket in rigid denim with dropped shoulders.',
    ['Washed Grey', 'Black'], IMG.laceTop, IMG.street),
  c(302, 'Tailored Cargo Trouser', 'street-luxe', 'Trousers', 99,
    'Wide-leg cargo trouser in technical twill with utility pockets.',
    ['Black', 'Dark Chocolate'], IMG.cargo, IMG.street),
  c(303, 'Structured Blazer', 'street-luxe', 'Blazers', 149,
    'Sharp-shouldered blazer in a heavyweight wool blend, single button.',
    ['Black'], IMG.coat, IMG.cargo),
  c(304, 'Street Bomber', 'street-luxe', 'Jackets', 129,
    'Boxy bomber with contrast ribbing and an oversized fit.',
    ['Black', 'Burgundy'], IMG.hero, IMG.coat),
  c(305, 'Wide-Leg Denim', 'street-luxe', 'Denim', 109,
    'High-rise, wide-leg denim with a clean, undistressed finish.',
    ['Washed Grey'], IMG.street, IMG.laceTop),
  c(306, 'Utility Vest', 'street-luxe', 'Tops', 79,
    'Multi-pocket utility vest in washed cotton canvas.',
    ['Black'], IMG.blouse, IMG.cargo),

  // ----------------------------- Night Edit -----------------------------
  c(401, 'After Dark Slip Dress', 'night-edit', 'Dresses', 149,
    'Liquid satin slip dress with a low back — built for the hours after sunset.',
    ['Black', 'Burgundy'], IMG.satin, IMG.laceDress),
  c(402, 'Evening Corset', 'night-edit', 'Corsets', 99,
    'Boned evening corset in duchess satin, worn as outerwear or under tailoring.',
    ['Black', 'Burgundy'], IMG.laceDress, IMG.satin),
  c(403, 'Velvet Evening Dress', 'night-edit', 'Dresses', 159,
    'Fitted velvet dress with a thigh-high slit and sculpted neckline.',
    ['Black', 'Dark Chocolate'], IMG.dress, IMG.satin),
  c(404, 'Sculptural Bodysuit', 'night-edit', 'Bodies', 89,
    'Sculptural bodysuit with a structured neckline for evening layering.',
    ['Black'], IMG.satin, IMG.dress),
  c(405, 'Satin Evening Skirt', 'night-edit', 'Skirts', 109,
    'Bias-cut satin maxi skirt with a fluid, floor-length drape.',
    ['Black', 'Burgundy'], IMG.cargo, IMG.satin),
  c(406, 'Night Cape Jacket', 'night-edit', 'Jackets', 139,
    'Cape-sleeve jacket in matte satin, worn open over evening pieces.',
    ['Black'], IMG.coat, IMG.laceDress),

  // ----------------------------- Essentials -----------------------------
  c(501, 'Essential Rib Top', 'essentials', 'Tops', 39,
    'Fitted ribbed top in a heavyweight cotton blend — a daily foundation piece.',
    ['Black', 'Ivory'], IMG.blouse, IMG.laceTop),
  c(502, 'Everyday Slip Dress', 'essentials', 'Dresses', 79,
    'Simple, fluid slip dress for daytime layering or worn alone.',
    ['Black', 'Dark Chocolate'], IMG.dress, IMG.blouse),
  c(503, 'Essential Tailored Trouser', 'essentials', 'Trousers', 89,
    'Straight-leg tailored trouser in a mid-weight twill.',
    ['Black'], IMG.street, IMG.cargo),
  c(504, 'Core Tank', 'essentials', 'Tops', 35,
    'Cropped core tank in soft jersey, made to be layered.',
    ['Black', 'Ivory'], IMG.laceTop, IMG.blouse),
  c(505, 'Everyday Denim', 'essentials', 'Denim', 99,
    'Straight-leg denim in a mid-wash, cut for daily wear.',
    ['Washed Grey'], IMG.laceTop, IMG.street),
  c(506, 'Soft Knit Skirt', 'essentials', 'Skirts', 69,
    'Midi skirt in a soft rib knit with a relaxed A-line fall.',
    ['Black', 'Dark Chocolate'], IMG.cargo, IMG.dress),
];

export function getCollection(slug) {
  return COLLECTIONS.find((c2) => c2.slug === slug) || null;
}

export function getProductsByCollection(slug) {
  return PRODUCTS.filter((p) => p.collectionSlug === slug);
}

export function getProduct(sku) {
  return PRODUCTS.find((p) => p.sku === sku) || null;
}

/** Looks — curated multi-piece outfits used on the Home page and /looks. */
export const LOOKS = [
  {
    slug: 'rebel-night',
    name: 'Rebel Night',
    image: IMG.hero,
    skus: ['SAT-101', 'SAT-102', 'SAT-103'],
    hotspots: [
      { sku: 'SAT-101', x: 42, y: 52 },
      { sku: 'SAT-102', x: 50, y: 78 },
      { sku: 'SAT-103', x: 60, y: 30 },
    ],
  },
  {
    slug: 'dark-city',
    name: 'Dark City',
    image: IMG.street,
    skus: ['SAT-301', 'SAT-302', 'SAT-306'],
    hotspots: [
      { sku: 'SAT-301', x: 38, y: 30 },
      { sku: 'SAT-302', x: 55, y: 75 },
      { sku: 'SAT-306', x: 62, y: 45 },
    ],
  },
  {
    slug: 'after-dark',
    name: 'After Dark',
    image: IMG.satin,
    skus: ['SAT-401', 'SAT-402'],
    hotspots: [
      { sku: 'SAT-401', x: 45, y: 55 },
      { sku: 'SAT-402', x: 55, y: 32 },
    ],
  },
  {
    slug: 'dark-feminine-edit',
    name: 'Dark Feminine',
    image: IMG.laceDress,
    skus: ['SAT-201', 'SAT-205'],
    hotspots: [
      { sku: 'SAT-201', x: 48, y: 60 },
      { sku: 'SAT-205', x: 58, y: 35 },
    ],
  },
];

export function getLook(slug) {
  return LOOKS.find((l) => l.slug === slug) || null;
}

export function getLookProducts(look) {
  return look.skus.map((sku) => getProduct(sku)).filter(Boolean);
}

/** Editorial brand stories used on the Home page. */
export const STORIES = [
  {
    slug: 'dark-rebel-city',
    title: 'The Dark Rebel City',
    text: 'Corsetry and raw denim on the streets that never quite sleep.',
    image: IMG.street,
  },
  {
    slug: 'night-edit',
    title: 'The Night Edit',
    text: 'Satin and structure, styled for the hours after dark.',
    image: IMG.satin,
  },
  {
    slug: 'dark-feminine',
    title: 'Dark Feminine',
    text: 'Lace, bodies and fitted silhouettes — softness, sharpened.',
    image: IMG.laceDress,
  },
  {
    slug: 'new-generation',
    title: 'The New Generation',
    text: 'The SATURNA universe, built for women 18–25.',
    image: IMG.blouse,
  },
];
