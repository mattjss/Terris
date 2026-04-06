/**
 * Optional historical GeoJSON overlays (boundaries, trade routes, battle sites, etc.).
 *
 * ## Future live integration (plug in here)
 * - Ship static `.geojson` under `public/historical/` and load with `fetch('/historical/....geojson')`.
 * - Or host on any static file server / open data portal (no Cesium ion, no Mapbox).
 * - Keep `HistoricalOverlayDescriptor` in a small registry JSON so the UI can list layers
 *   without importing huge files up front.
 *
 * ## Mock
 * Returns one placeholder polygon + metadata until live mode is enabled and URLs resolve.
 */
import type { FeatureCollection } from 'geojson'
import type {
  HistoricalOverlayBundle,
  HistoricalOverlayDescriptor,
} from '@/data/types/historicalOverlay'
import { integrationFlags } from './integrationConfig'
import { fetchJson } from './fetchHelpers'

/** Default row for `EXAMPLE_HISTORICAL_OVERLAYS` — not used when callers pass their own descriptor. */
const MOCK_DESCRIPTOR: HistoricalOverlayDescriptor = {
  id: 'mock-historical-region',
  name: 'Mock historical region',
  category: 'boundary',
  yearStart: -500,
  yearEnd: 500,
  geojsonUrl: '/historical/mock-region.geojson',
  attribution: 'Mock data — replace with a real open dataset.',
}

const MOCK_GEOJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { label: 'Mock boundary' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [10, 40],
            [20, 40],
            [20, 48],
            [10, 48],
            [10, 40],
          ],
        ],
      },
    },
  ],
}

export async function loadHistoricalOverlay(
  descriptor: HistoricalOverlayDescriptor,
  options?: { useMock?: boolean },
): Promise<HistoricalOverlayBundle> {
  const useMock = options?.useMock ?? !integrationFlags.historicalGeojsonLive
  if (useMock) {
    return {
      descriptor,
      data: MOCK_GEOJSON,
    }
  }

  const data = await fetchJson<FeatureCollection>(descriptor.geojsonUrl)
  return { descriptor, data }
}

/** Example registry — extend or replace with `import registry from './overlays.json'`. */
export const EXAMPLE_HISTORICAL_OVERLAYS: HistoricalOverlayDescriptor[] = [MOCK_DESCRIPTOR]
