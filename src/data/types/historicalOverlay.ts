/**
 * Optional future historical boundaries / routes / sites as GeoJSON overlays.
 * Data may come from your own static files, government open data, or Wikimedia Commons — not Cesium ion.
 */

import type { FeatureCollection } from 'geojson'

export type HistoricalOverlayCategory =
  | 'boundary'
  | 'route'
  | 'site'
  | 'event'
  | 'other'

/** Registry entry so the app can lazy-load overlays by id. */
export type HistoricalOverlayDescriptor = {
  id: string
  name: string
  category: HistoricalOverlayCategory
  /** Year range the overlay is relevant to (for filtering). */
  yearStart?: number
  yearEnd?: number
  /** Absolute URL or `/public` path to a `.geojson` file you ship. */
  geojsonUrl: string
  /** Short credit / license note. */
  attribution: string
}

export type HistoricalOverlayBundle = {
  descriptor: HistoricalOverlayDescriptor
  data: FeatureCollection
}
