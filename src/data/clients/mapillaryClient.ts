/**
 * Mapillary — street-level imagery (Graph API v4).
 *
 * **Placeholder:** No network calls until `VITE_MAPILLARY_LIVE=true` and a token strategy exists.
 * Wire `fetchMapillarySequencesInBBox` to:
 * `GET https://graph.mapillary.com/images?bbox=...&fields=...` (requires OAuth client token).
 *
 * Terris uses this layer for “Real Imagery” / street context next to Wikimedia stills.
 */
import { integrationFlags } from './integrationConfig'

export type MapillaryBBox = {
  west: number
  south: number
  east: number
  north: number
}

export type MapillaryImageStub = {
  id: string
  thumbUrl: string
  capturedAt?: string
  lat: number
  lon: number
}

export type MapillaryStubResponse = {
  images: MapillaryImageStub[]
  sequenceIds: string[]
}

const EMPTY: MapillaryStubResponse = {
  images: [],
  sequenceIds: [],
}

/**
 * Placeholder bbox query — returns empty until Mapillary is configured.
 */
export async function fetchMapillaryImagesInBBox(
  _bbox: MapillaryBBox,
): Promise<MapillaryStubResponse> {
  if (!integrationFlags.mapillaryLive) {
    return EMPTY
  }
  void _bbox
  return EMPTY
}
