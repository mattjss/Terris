/**
 * Remote Earth textures (three.js examples) — swap for local `/public/textures/...` for offline builds.
 * Future: NASA Blue Marble / GEBCO bathymetry tiles, IIIF manifests for archival stills.
 */
const RAW =
  'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets'

export const EARTH_TEXTURE_URLS = {
  dayColor: `${RAW}/earth_atmos_2048.jpg`,
  nightLights: `${RAW}/earth_lights_2048.png`,
  specular: `${RAW}/earth_specular_2048.jpg`,
  normal: `${RAW}/earth_normal_2048.jpg`,
  clouds: `${RAW}/earth_clouds_1024.png`,
} as const

/** Matches `GlobeScene` key light direction (normalized in shader). */
export const EARTH_SUN_DIRECTION = { x: 5.2, y: 2.4, z: 3.6 } as const
