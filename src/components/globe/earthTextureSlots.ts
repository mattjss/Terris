/**
 * Earth texture stack — single place to swap assets for production (NASA Blue Marble, GEBCO, etc.).
 *
 * ## Slot reference
 *
 * | Slot | Purpose | Current | Production |
 * |------|---------|---------|------------|
 * | `dayColor` | Day albedo (land + shallow water tone) | three.js `earth_atmos_2048.jpg` | [NASA Visible Earth — Blue Marble](https://visibleearth.nasa.gov/collection/1484/blue-marble) or 8K tiled texture |
 * | `topography` | Relief / bathymetry shading (grayscale height or merged land/ocean bump) | **Same as `normal`** until a dedicated asset exists | GEBCO grid or blended DEM + bathymetry raster |
 * | `normal` | Surface micro-normal for lighting variation | three.js `earth_normal_2048.jpg` | Derived from DEM or higher-res normal bake |
 * | `nightLights` | City lights (night side) | three.js `earth_lights_2048.png` | VIIRS Black Marble or similar |
 * | `specularOcean` | Ocean reflectivity mask (roughness inverse) | three.js `earth_specular_2048.jpg` | Water mask + glint tuning |
 * | `clouds` | Alpha cloud texture on separate shell | three.js `earth_clouds_1024.png` | EUMETSAT / MODIS-style cloud albedo (separate layer) |
 *
 * ## Local assets
 *
 * Drop files under `public/textures/earth/` and set env or replace URLs below, e.g.
 * `import.meta.env.BASE_URL + 'textures/earth/blue_marble_8k.jpg'`.
 *
 * Shaders read these via uniform names in `earthShaders.ts` — keep slot names stable when swapping.
 */
const THREE_JS_EXAMPLES =
  'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets'

/** All remote URLs used by the Earth + cloud materials (offline: mirror to `/public`). */
export const EARTH_TEXTURE_URLS = {
  dayColor: `${THREE_JS_EXAMPLES}/earth_atmos_2048.jpg`,
  /** Placeholder: use dedicated bathymetry/topography when available; currently mirrors normal for shader mix. */
  topography: `${THREE_JS_EXAMPLES}/earth_normal_2048.jpg`,
  normal: `${THREE_JS_EXAMPLES}/earth_normal_2048.jpg`,
  nightLights: `${THREE_JS_EXAMPLES}/earth_lights_2048.png`,
  specularOcean: `${THREE_JS_EXAMPLES}/earth_specular_2048.jpg`,
  clouds: `${THREE_JS_EXAMPLES}/earth_clouds_1024.png`,
} as const

export type EarthTextureUrlKey = keyof typeof EARTH_TEXTURE_URLS

/** Sun direction in world space — kept in sync with `GlobeLights` key light. */
export const EARTH_SUN_DIRECTION = { x: 5.2, y: 2.4, z: 3.6 } as const
