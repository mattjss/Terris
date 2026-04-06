/**
 * Unified Terris domain model — Earth, planetary, and cosmic hubs share one structure.
 * Wikidata-backed entities are always `mode: 'earth'`.
 */

/** Exploration scale — aligns with `useExploreScaleStore`. */
export type ExplorerMode = 'earth' | 'planetary' | 'cosmic'

export type EarthEntityKind =
  | 'place'
  | 'person'
  | 'event'
  | 'empire'
  | 'landmark'
  | 'venue'
  | 'museum'
  | 'artwork'
  | 'animal'

export type PlanetaryEntityKind =
  | 'planet'
  | 'moon'
  | 'mission'
  | 'rover'
  | 'spacecraft'
  | 'crater'
  | 'mountain'
  | 'atmosphere-feature'

export type CosmicEntityKind =
  | 'galaxy'
  | 'nebula'
  | 'black-hole'
  | 'exoplanet'
  | 'star'
  | 'constellation'
  | 'observatory'
  | 'cosmic-event'

export type TerrisEntityKind = EarthEntityKind | PlanetaryEntityKind | CosmicEntityKind

export type TerrisCoords = {
  lat: number
  lon: number
}

export type TerrisFact = {
  id: string
  label: string
  value: string
  source?: string
}

export type TerrisTimelineEntry = {
  id: string
  label: string
  startYear: number | null
  endYear: number | null
  summary?: string
}

export type TerrisMediaType = 'image' | 'video' | 'archival' | 'reconstruction'

/**
 * Editorial media asset — documentary or interpretive; license + credit required for production.
 */
export type TerrisMediaItem = {
  id: string
  type: TerrisMediaType
  title: string
  /** Publisher or API surface, e.g. “Wikimedia Commons”, “IIIF manifest”. */
  sourceName: string
  url: string
  thumbnailUrl?: string
  caption: string
  credit: string
  /** SPDX or human-readable, e.g. “CC BY-SA 4.0”, “Public domain”. */
  license?: string
  isInterpretive: boolean
}

export type RelatedEntityRef = {
  id: string
  mode: ExplorerMode
  kind: TerrisEntityKind
  name: string
  role?: string
}

type TerrisEntityCommon = {
  id: string
  name: string
  coords: TerrisCoords | null
  /** Primary placename for display (may match `name` for simple places). */
  placeName: string | null
  /** Region / state / province label when applicable. */
  regionName: string | null
  /** Sovereign country or equivalent. */
  countryName: string | null
  startYear: number | null
  endYear: number | null
  summary: string
  fullDescription: string
  facts: TerrisFact[]
  timeline: TerrisTimelineEntry[]
  relatedEntities: RelatedEntityRef[]
  nearby: RelatedEntityRef[]
  media: TerrisMediaItem[]
  sources?: {
    wikidataId?: string
    wikipediaTitle?: string
    mapillarySequenceId?: string
  }
}

export type TerrisEntity =
  | (TerrisEntityCommon & { mode: 'earth'; type: EarthEntityKind })
  | (TerrisEntityCommon & { mode: 'planetary'; type: PlanetaryEntityKind })
  | (TerrisEntityCommon & { mode: 'cosmic'; type: CosmicEntityKind })

export type Place = TerrisEntity & { mode: 'earth'; type: 'place' }
export type Person = TerrisEntity & { mode: 'earth'; type: 'person' }
export type Event = TerrisEntity & { mode: 'earth'; type: 'event' }
export type Landmark = TerrisEntity & { mode: 'earth'; type: 'landmark' }
export type Venue = TerrisEntity & { mode: 'earth'; type: 'venue' }
export type Empire = TerrisEntity & { mode: 'earth'; type: 'empire' }
export type Artwork = TerrisEntity & { mode: 'earth'; type: 'artwork' }
export type Animal = TerrisEntity & { mode: 'earth'; type: 'animal' }

export type TerrisEntityByKind =
  | Place
  | Person
  | Event
  | Landmark
  | Venue
  | Empire
  | Artwork
  | Animal
