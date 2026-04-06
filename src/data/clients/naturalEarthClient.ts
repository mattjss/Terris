/**
 * Natural Earth — public-domain vector data (no API key, no “map SDK”).
 *
 * ## Live integration (plug in here)
 * GeoJSON is published on GitHub (nvkelso/natural-earth-vector). Example canonical URLs:
 * - `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson`
 * - `.../ne_110m_ocean.geojson`
 * - `.../ne_110m_admin_0_countries.geojson`
 *
 * For production, consider **vendoring** large files into `/public/geo/natural-earth/` to avoid
 * CDN rate limits and to pin versions. The loader below stays the same — only `resolveNaturalEarthUrl`.
 *
 * ## Mock
 * Returns a tiny valid `FeatureCollection` (two polygons) so globe/map code can run offline.
 */
import type { FeatureCollection } from 'geojson'
import type { NaturalEarthLayerId, NaturalEarthResult } from '@/data/types/naturalEarth'
import { integrationFlags } from './integrationConfig'
import { fetchJson } from './fetchHelpers'

const GITHUB_RAW_BASE =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson'

const LAYER_FILES: Record<NaturalEarthLayerId, string> = {
  ne_110m_land: 'ne_110m_land.geojson',
  ne_110m_ocean: 'ne_110m_ocean.geojson',
  ne_110m_admin_0_countries: 'ne_110m_admin_0_countries.geojson',
  ne_50m_land: 'ne_50m_land.geojson',
  ne_50m_admin_0_countries: 'ne_50m_admin_0_countries.geojson',
}

function resolveNaturalEarthUrl(layer: NaturalEarthLayerId, baseUrl: string): string {
  const file = LAYER_FILES[layer]
  return `${baseUrl.replace(/\/$/, '')}/${file}`
}

const MOCK_LAND: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Mock land A' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-30, -10],
            [40, -10],
            [40, 30],
            [-30, 30],
            [-30, -10],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Mock land B' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [50, 0],
            [90, 0],
            [90, 40],
            [50, 40],
            [50, 0],
          ],
        ],
      },
    },
  ],
}

export async function loadNaturalEarthLayer(
  layer: NaturalEarthLayerId,
  options?: { useMock?: boolean; baseUrl?: string },
): Promise<NaturalEarthResult> {
  const useMock = options?.useMock ?? !integrationFlags.naturalEarthLive
  if (useMock) {
    return {
      layer,
      data: {
        ...MOCK_LAND,
        terris: {
          attribution: 'Mock Natural Earth substitute (offline)',
        },
      },
    }
  }

  const base = options?.baseUrl ?? GITHUB_RAW_BASE
  const url = resolveNaturalEarthUrl(layer, base)
  const data = await fetchJson<FeatureCollection>(url)
  return {
    layer,
    data: {
      ...data,
      terris: {
        attribution: 'Natural Earth — public domain',
        sourceUrl: url,
      },
    },
  }
}
