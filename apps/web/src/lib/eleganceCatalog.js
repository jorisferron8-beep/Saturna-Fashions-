/**
 * SATURNA ELEGANCE — curated concept collection (30 pieces).
 *
 * Feminine, premium, slightly dark elegance — European luxury fashion ×
 * modern feminine × dark elegance. Each piece carries a SKU, name,
 * description, category, USD price, available colours, sizes and stock.
 *
 * Prices are stored in USD cents so the Geo-Market engine can convert them
 * per active market (USD / COP / HKD / CNY) via `formatFromUsdCents`.
 */

const IMG = {
  hero: 'https://images.hostinger.com/91787ea9-ba3a-417c-87a1-0d3af9c58453.png',
  corset: 'https://images.hostinger.com/02e3bbba-48aa-4210-9cb0-dfbdeef528c1.png',
  bodysuit: 'https://images.hostinger.com/c5ddec00-736a-4b01-8b00-f0067dae1b9d.png',
  top: 'https://images.hostinger.com/8b72d940-9897-438a-a277-204b32d31e32.png',
  dress: 'https://images.hostinger.com/cfff4c26-1f2d-4223-ba7b-154e1fb56a58.png',
  skirt: 'https://images.hostinger.com/acb56771-5b00-46b1-86ad-447130394d85.png',
  trousers: 'https://images.hostinger.com/600bd536-7087-4c9e-9370-8ece0d96eb62.png',
  blazer: 'https://images.hostinger.com/5b7ab067-0c21-40d8-81c0-131208f39906.png',
  jacket: 'https://images.hostinger.com/ad03fb92-e6ee-45bd-8b6c-35ce124cbc04.png',
  evening: 'https://images.hostinger.com/b81313a4-8273-4089-98fd-b2934fc4efec.png',
};

const CATEGORY_IMAGE = {
  Corsets: IMG.corset,
  Bodysuits: IMG.bodysuit,
  Tops: IMG.top,
  Dresses: IMG.dress,
  Skirts: IMG.skirt,
  Trousers: IMG.trousers,
  Blazers: IMG.blazer,
  Jackets: IMG.jacket,
  'Evening Wear': IMG.evening,
  Signature: IMG.dress,
};

export const ELEGANCE_CATEGORIES = [
  'Dresses',
  'Corsets',
  'Bodysuits',
  'Tops',
  'Skirts',
  'Trousers',
  'Blazers',
  'Jackets',
  'Evening Wear',
  'Signature',
];

export const ELEGANCE_GROUPS = [
  { id: 'new', label: 'New Arrivals' },
  { id: 'essentials', label: 'Essentials' },
  { id: 'evening', label: 'Evening' },
  { id: 'signature', label: 'Signature' },
];

const ALL_SIZES = ['XS', 'S', 'M', 'L'];

const p = (n, name, category, group, priceUsd, description, colors, stock) => ({
  sku: `SAT-ELE-${String(n).padStart(3, '0')}`,
  name,
  category,
  group,
  priceInCents: priceUsd * 100,
  description,
  colors,
  sizes: ALL_SIZES,
  stock,
  image: CATEGORY_IMAGE[category],
});

export const ELEGANCE_PRODUCTS = [
  p(1, 'Noir Élan Corset', 'Corsets', 'new', 89,
    'A structured black satin corset with discreet metallic boning that sculpts the silhouette — engineered presence for the woman who enters a room and stays.',
    ['Black', 'Burgundy'], 14),
  p(2, 'Velvet Eclipse Bodysuit', 'Bodysuits', 'new', 79,
    'Black velvet bodysuit with lace paneling and a refined metallic zipper. A single piece that defines the line from shoulder to hip.',
    ['Black', 'Dark Chocolate'], 11),
  p(3, 'Luna Lace Top', 'Tops', 'new', 59,
    'Chantilly lace top with satin trim — translucent, architectural, quietly sensual. The foundation of a dark elegant wardrobe.',
    ['Black', 'Ivory'], 18),
  p(4, 'Midnight Muse Crop Top', 'Tops', 'new', 49,
    'A cropped satin top with a clean neckline and structured hem. Minimalist proportion for layering or standing alone.',
    ['Black', 'Burgundy'], 22),
  p(5, 'Éclipse Satin Blouse', 'Tops', 'new', 69,
    'Fluid satin blouse with a draped cowl and matte hardware buttons. Office-dark elegance that transitions into night.',
    ['Black', 'Ivory'], 16),
  p(6, 'Nocturne Tailored Jacket', 'Jackets', 'new', 129,
    'A sharply tailored jacket in wool blend with metallic button detailing. Structure with a softened, feminine shoulder.',
    ['Black'], 9),
  p(7, 'Venus Draped Dress', 'Dresses', 'new', 119,
    'A draped black satin midi dress with a cowl neckline that falls in a single fluid line. Quiet drama for the evening.',
    ['Black', 'Burgundy'], 12),
  p(8, 'Obsidian Slip Dress', 'Dresses', 'new', 109,
    'A bias-cut slip dress in heavy satin — the simplest, most decisive silhouette in the collection.',
    ['Black', 'Ivory'], 15),

  p(9, 'Luna Velvet Mini Dress', 'Dresses', 'essentials', 129,
    'A velvet mini dress with a sculpted neckline. Tactile depth and a shortened line for after-dark confidence.',
    ['Black', 'Burgundy'], 10),
  p(10, 'Eternal Noir Maxi Dress', 'Dresses', 'essentials', 149,
    'A floor-grazing black maxi dress in matte crepe with a high slit. Presence without ornament.',
    ['Black'], 8),
  p(11, 'Seraphine Satin Skirt', 'Skirts', 'essentials', 79,
    'A high-slit satin skirt that moves with the body. Fluid fabric, precise cut, discreet waist finish.',
    ['Black', 'Ivory'], 17),
  p(12, 'Shadow Pleated Skirt', 'Skirts', 'essentials', 69,
    'A pleated skirt with a matte surface and a quiet metallic waist detail. Movement as expression.',
    ['Black', 'Dark Chocolate'], 19),
  p(13, 'Celeste High-Waist Trousers', 'Trousers', 'essentials', 89,
    'High-waisted tailored trousers in structured wool. A long, clean line and a sharp feminine silhouette.',
    ['Black', 'Ivory'], 13),
  p(14, 'Noir Signature Blazer', 'Blazers', 'essentials', 139,
    'The signature blazer — structured, single-breasted, with metallic buttons. The cornerstone of the dark tailored wardrobe.',
    ['Black', 'Burgundy'], 7),
  p(15, 'Aurelia Satin Camisole', 'Tops', 'essentials', 55,
    'A satin camisole with adjustable straps and a soft drape. The essential luxury layer.',
    ['Black', 'Ivory', 'Burgundy'], 24),
  p(16, 'Raven Lace Bodysuit', 'Bodysuits', 'essentials', 75,
    'A lace bodysuit with a high neck and sheer sleeves. Sensual architecture that holds its shape.',
    ['Black'], 12),

  p(17, 'Selene Off-Shoulder Top', 'Tops', 'evening', 65,
    'An off-shoulder top in matte jersey with a clean banded neckline. The collarbone as a statement.',
    ['Black', 'Ivory'], 16),
  p(18, 'Divine Mesh Long Sleeve Top', 'Tops', 'evening', 59,
    'A long-sleeve mesh top with a second-skin fit — layering as revelation, restraint as elegance.',
    ['Black'], 20),
  p(19, 'Midnight Velvet Corset Top', 'Corsets', 'evening', 95,
    'A velvet corset top with structured boning and a discreet back zipper. Tactile, sculpted, decisive.',
    ['Black', 'Burgundy'], 9),
  p(20, 'Eclipse Structured Mini Dress', 'Dresses', 'evening', 119,
    'A structured mini dress with architectural seaming and matte hardware. Form held firmly in place.',
    ['Black'], 11),
  p(21, 'Noir Femme Leather Jacket', 'Jackets', 'evening', 159,
    'A premium leather jacket with refined metallic hardware and a cropped feminine line. Armored elegance.',
    ['Black', 'Dark Chocolate'], 6),
  p(22, 'Luna Tailored Vest', 'Blazers', 'evening', 79,
    'A tailored vest with a narrow lapel and matte buttons. The blazer, distilled to its essential line.',
    ['Black', 'Burgundy'], 14),
  p(23, 'Satin Shadow Wrap Dress', 'Dresses', 'evening', 125,
    'A wrap dress in fluid satin with a deep neckline and a self-tie waist. Adjustable, draped, quietly powerful.',
    ['Black', 'Ivory'], 10),
  p(24, 'Elysia Lace Evening Dress', 'Evening Wear', 'evening', 159,
    'A lace evening dress with a lined bodice and a sheer hem. Haute-couture detailing for the ceremonial night.',
    ['Black', 'Burgundy'], 5),

  p(25, 'Venus Sculpted Top', 'Tops', 'signature', 69,
    'A sculpted top with asymmetric seaming and a structured shoulder. The body, redrawn.',
    ['Black', 'Ivory'], 13),
  p(26, 'Nocturne Wide-Leg Pants', 'Trousers', 'signature', 89,
    'Wide-leg trousers in flowing crepe with a high waist. Volume as elegance, movement as signature.',
    ['Black', 'Ivory'], 12),
  p(27, 'Eclipse Velvet Blazer', 'Blazers', 'signature', 145,
    'A velvet blazer with a single button and a soft structured shoulder. Tactile authority.',
    ['Black', 'Burgundy'], 7),
  p(28, 'Serenity Satin Jumpsuit', 'Evening Wear', 'signature', 139,
    'A satin jumpsuit with a draped neckline and a defined waist — the one-piece evening statement.',
    ['Black', 'Ivory'], 8),
  p(29, 'Saturna Signature Black Dress', 'Signature', 'signature', 169,
    'The signature black dress of the maison — a sculpted silhouette in heavy satin with a discreet hardware detail at the waist. The definitive SATURNA piece.',
    ['Black'], 6),
  p(30, 'Lunar Goddess Evening Gown', 'Evening Wear', 'signature', 199,
    'A floor-length velvet evening gown with subtle lace detailing and a sweeping train. The culmination of the collection.',
    ['Black', 'Burgundy'], 4),
];

export const ELEGANCE_HERO_IMAGE = IMG.hero;
