/**
 * Natural Earth public-domain vector data (no API key).
 * GeoJSON is typically loaded from GitHub raw URLs or packaged static assets.
 * @see https://www.naturalearthdata.com/
 */

import type { TerrisFeatureCollection } from './geojson'

/** Common 1:110m / 1:50m layer slugs used in Terris loaders. */
export type NaturalEarthLayerId =
  | 'ne_110m_land'
  | 'ne_110m_ocean'
  | 'ne_110m_admin_0_countries'
  | 'ne_50m_land'
  | 'ne_50m_admin_0_countries'

export type NaturalEarthLoadOptions = {
  /** When true, `naturalEarthClient` returns bundled mock GeoJSON. */
  useMock?: boolean
  /** Override default public URL (e.g. self-hosted mirror). */
  baseUrl?: string
}

export type NaturalEarthResult = {
  layer: NaturalEarthLayerId
  data: TerrisFeatureCollection
}
