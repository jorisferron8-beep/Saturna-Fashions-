/**
 * Deterministic "reviews" for a SKU — stable across renders/filters instead
 * of re-randomizing, so a piece always shows the same rating. Ratings skew
 * high (4.2–5.0), matching how boutique storefronts read in practice.
 */
function seededRandom(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return () => {
    h = (h * 1664525 + 1013904223) >>> 0;
    return h / 4294967296;
  };
}

export function getReviewStats(sku) {
  const rand = seededRandom(sku);
  const rating = Math.round((4.2 + rand() * 0.8) * 10) / 10;
  const count = Math.floor(9 + rand() * 210);
  return { rating, count };
}
