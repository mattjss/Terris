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

/** Grouped dossier facts — rendered in editorial sections. */
export type TerrisFactCategory =
  | 'identity'
  | 'location'
  | 'significance'
  | 'dimensions'
  | 'dates'
  | 'institutions'
  | 'other'

export type TerrisFact = {
  id: string
  label: string
  value: string
  category: TerrisFactCategory
  /** Attribution line (e.g. “City of Boston”, “MLB records”) */
  sourceName?: string
}

/**
 * Normalized timeline row for educational dossiers.
 * `year` is the primary sort key (range start for ranges).
 */
export type TerrisTimelineEventType = 'point' | 'range' | 'era'

export type TerrisTimelineEvent = {
  id: string
  title: string
  /** Human-readable date or span, e.g. “1773 · Dec 16” or “1840–1920” */
  dateLabel: string
  /** Sort / map anchor (start year, or single year) */
  year: number
  type: TerrisTimelineEventType
  summary?: string
  relatedEntityIds?: string[]
  /** Inclusive end for ranges and eras */
  endYear?: number | null
}

/** @deprecated Use TerrisTimelineEvent — alias retained for imports */
export type TerrisTimelineEntry = TerrisTimelineEvent

export type TerrisMediaType = 'image' | 'video' | 'archival' | 'reconstruction'

/**
 * Structured fields for AI-assisted or modeled still reconstructions (`type: 'reconstruction'`, `isInterpretive: true`).
 * Not used for documentary photography.
 */
export type TerrisReconstructionMeta = {
  /** Prompt or spec sent to the image model (or internal brief). */
  prompt: string
  /** Human-readable era anchor, e.g. “Augustan Rome, 1st c. CE”. */
  historicalPeriod: string
  /** Editorial confidence tier, e.g. “Illustrative — not surveyed”. */
  confidenceLabel: string
  /** What learners should treat as uncertain or hypothetical. */
  interpretationNotes: string
  /** Citations to archaeology, texts, or maps the scene draws from. */
  sourceBasis: string
  /** Optional key into `promptTemplates` library. */
  promptTemplateId?: string
}

/**
 * Placeholder / future pipeline for short interpretive clips (5–15s). Provider not wired in yet.
 */
export type TerrisInterpretiveVideoStatus =
  | 'placeholder'
  | 'queued'
  | 'processing'
  | 'failed'
  | 'ready'

export type TerrisInterpretiveVideoMeta = {
  targetDurationSeconds: { min: number; max: number }
  generationStatus: TerrisInterpretiveVideoStatus
  /** What the clip is meant to show (educational framing). */
  description: string
  /** Optional: epistemic limits (weather, lighting, crowd size, etc.). */
  whatIsUncertain?: string
}

/**
 * Editorial media asset — documentary or interpretive; license + credit required for production.
 */
export type TerrisMediaItem = {
  id: string
  type: TerrisMediaType
  title: string
  /** Publisher or API surface, e.g. “Wikimedia Commons”, “IIIF manifest”. */
  sourceName: string
  /** Empty when `interpretiveVideoMeta` is placeholder-only (no file yet). */
  url: string
  thumbnailUrl?: string
  caption: string
  credit: string
  /** SPDX or human-readable, e.g. “CC BY-SA 4.0”, “Public domain”. */
  license?: string
  /** Must be true for reconstructions and interpretive video; never imply documentary truth. */
  isInterpretive: boolean
  /** Required for `type: 'reconstruction'` in production data; still renders + context. */
  reconstructionMeta?: TerrisReconstructionMeta
  /** Short interpretive clip metadata; `generationStatus: 'ready'` implies `url` points to playable video. */
  interpretiveVideoMeta?: TerrisInterpretiveVideoMeta
}

/** Discovery grouping for related entities (maps from kind + optional override). */
export type RelatedDiscoveryGroup =
  | 'places'
  | 'people'
  | 'events'
  | 'venues'
  | 'institutions'
  | 'artworks'
  | 'missions'
  | 'planets'
  | 'other'

export type NearbyAnchorKind =
  | 'landmark'
  | 'museum'
  | 'venue'
  | 'neighborhood'
  | 'natural-feature'

export type RelatedEntityRef = {
  id: string
  mode: ExplorerMode
  kind: TerrisEntityKind
  name: string
  role?: string
  /** When set, overrides default kind→group mapping for the Related tab */
  group?: RelatedDiscoveryGroup
  /** When present on `nearby[]` entries, drives Nearby section grouping */
  anchorKind?: NearbyAnchorKind
}

/** Tracks live vs mock enrichment without replacing editorial entity ids. */
export type TerrisEnrichmentMeta = {
  status: 'mock' | 'live' | 'mixed'
  /** Some steps failed; UI may still show partial live rows. */
  partial?: boolean
  warnings?: string[]
  attemptedAt?: string
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
  timeline: TerrisTimelineEvent[]
  relatedEntities: RelatedEntityRef[]
  /** Nearby anchors; use `anchorKind` when present for grouping */
  nearby: RelatedEntityRef[]
  media: TerrisMediaItem[]
  sources?: {
    wikidataId?: string
    wikipediaTitle?: string
    mapillarySequenceId?: string
    /** Open-knowledge enrichment run metadata (Wikidata / Wikipedia / SPARQL). */
    enrichment?: TerrisEnrichmentMeta
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
