/**
 * SATURNA editorial photography for the flagship pages (Home, Collections,
 * Looks, Piece). Twelve real shoot images, each assigned to specific
 * collections/pieces below rather than looped generically — kept as
 * individually named exports so callers pick a deliberate photo instead of
 * reusing whichever one happens to be "first".
 */
const BASE = '/photoshoot';

export const PHOTOS = {
  // Original five
  streetLuxeBomber: `${BASE}/street-luxe-bomber.jpg`,
  darkCityCrosswalk: `${BASE}/dark-city-crosswalk.jpg`,
  darkRebelCorset: `${BASE}/dark-rebel-corset.jpg`,
  nightEditBodysuit: `${BASE}/night-edit-bodysuit.jpg`,
  afterDarkRooftop: `${BASE}/after-dark-rooftop.jpg`,
  // Second batch
  rebelRomperAlley: `${BASE}/rebel-romper-alley.jpg`,
  streetLuxeDaylight: `${BASE}/street-luxe-daylight.jpg`,
  darkFeminineLaceStudio: `${BASE}/dark-feminine-lace-studio.jpg`,
  streetLuxeCargoNight: `${BASE}/street-luxe-cargo-night.jpg`,
  darkRebelHalterStudio: `${BASE}/dark-rebel-halter-studio.jpg`,
  darkRebelDuoSaturna: `${BASE}/dark-rebel-duo-saturna.jpg`,
  darkRebelCargoStanding: `${BASE}/dark-rebel-cargo-standing.jpg`,
};

export const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUzMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMEEwQTBBIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzVBMTgyNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlNBVFVSTkE8L3RleHQ+PC9zdmc+';
