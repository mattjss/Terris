/**
 * Shared GeoJSON-related types for Terris map/globe layers.
 * Uses the standard `geojson` package typings (RFC 7946).
 */
import type { FeatureCollection } from 'geojson'

export type { FeatureCollection, Feature, Geometry } from 'geojson'

/** Metadata we attach when loading third-party GeoJSON (Natural Earth, historical overlays). */
export type GeoJsonSourceMeta = {
  /** Human-readable credit line (required for Natural Earth and most open data). */
  attribution: string
  /** Original download URL or file path, for debugging. */
  sourceUrl?: string
  /** When the snapshot was fetched or published. */
  retrievedAt?: string
}

export type TerrisFeatureCollection = FeatureCollection & {
  terris?: GeoJsonSourceMeta
}
