import { GLOBE_RADIUS } from '@/data/historical'

/** World-space center of the globe group (matches `GlobeScene` group position). */
export const GLOBE_WORLD_CENTER = { x: 0.1, y: -0.05, z: 0 }

/**
 * Future atlas layers (Three.js only):
 * - Bathymetry / topography: second mesh or displacement map from GEBCO / Blue Marble height.
 * - Animated clouds: scroll `cloudMap` UVs or second cloud band.
 * - Labels: `CSS2DRenderer` or instanced billboards for toponyms at zoom thresholds.
 */
export { GLOBE_RADIUS }
