/**
 * Terris canonical domain model — globe UI, APIs, and future AI grounding.
 *
 * Notes:
 * - `TerrisEntity` is a discriminated union; narrow on `kind`.
 * - All concrete entities share `EntityCommon` (time, sources, relationships, optional geo).
 * - Store BCE years as negative numbers in `YearEndpoint` or use ISO 8601 with agreement on extensions.
 * - `GroundingContext` is optional; fill for retrieve-then-generate and citation UI later.
 */

/** ─── Time ─────────────────────────────────────────────────────────────── */

export type TimeGranularity =
  | 'instant'
  | 'day'
  | 'month'
  | 'year'
  | 'decade'
  | 'century'
  | 'millennium'
  | 'range_unknown'

export type TimeConfidence = 'exact' | 'approximate' | 'debated'

/** Single calendar instant; extend with more `kind`s if you add specialized calendars. */
export type HistoricalInstant =
  | { kind: 'iso8601'; value: string }
  | { kind: 'year'; year: number; label?: string }

export interface TimeRange {
  /** Inclusive start */
  start: HistoricalInstant
  /** Inclusive end; omit or use null for ongoing / unknown / point-in-time when paired with `instant` */
  end: HistoricalInstant | null
  granularity: TimeGranularity
  confidence?: TimeConfidence
  /** Human-readable qualifier, e.g. "c. 1200", "Spring 1945" */
  displayLabel?: string
}

/** ─── Geography ──────────────────────────────────────────────────────────── */

/** WGS84 lon/lat in degrees */
export type LonLat = readonly [longitude: number, latitude: number]

/**
 * Canonical geometry for the globe: point, polygon rings, axis-aligned bounds, or link to a Region.
 * Client may hold simplified rings; server can store full-resolution separately.
 */
export type GeoReference =
  | {
      kind: 'point'
      coordinates: LonLat
      /** e.g. capital, battlefield centroid */
      label?: string
    }
  | {
      kind: 'polygon'
      /** Outer ring first; holes follow GeoJSON convention */
      rings: LonLat[][]
      /** Optional precomputed bbox for culling */
      bounds?: GeoBounds
    }
  | {
      kind: 'bounds'
      bounds: GeoBounds
    }
  | {
      kind: 'region'
      /** FK to a `Region` entity id when geometry is delegated */
      regionId: string
      /** Optional override or fallback for quick globe fit */
      bounds?: GeoBounds
    }

export interface GeoBounds {
  west: number
  south: number
  east: number
  north: number
}

/** ─── Provenance & identity ──────────────────────────────────────────────── */

export type ExternalSystem =
  | 'wikidata'
  | 'wikipedia'
  | 'openstreetmap'
  | 'natural_earth'
  | 'manual'
  | 'terris'
  | (string & {})

export interface SourceReference {
  id: string
  system: ExternalSystem
  /** External stable id, e.g. Q-number, page title, OSM id */
  recordId?: string
  url?: string
  title?: string
  license?: string
  retrievedAt?: string
  /** Opaque pointer for snapshot/chunk storage (AI + audit) */
  snapshotRef?: string
}

export type EntityKind =
  | 'place'
  | 'empire'
  | 'person'
  | 'architecture'
  | 'landmark'
  | 'event'
  | 'era'
  | 'culture'
  | 'religion'
  | 'trade_route'
  | 'region'

export interface EntityReference {
  id: string
  kind: EntityKind
  label: string
  slug?: string
}

export type RelationRole =
  | 'part_of'
  | 'contains'
  | 'located_in'
  | 'capital_of'
  | 'participant'
  | 'subject'
  | 'object'
  | 'successor_of'
  | 'predecessor_of'
  | 'associated_with'
  | 'influenced_by'
  | 'conflict_with'
  | 'route_endpoint'
  | 'custom'

export interface EntityRelationship {
  id: string
  role: RelationRole
  /** Custom predicate when role is too coarse */
  predicate?: string
  target: EntityReference
  /** Relationship may be shorter than entity lifespan */
  time?: TimeRange | null
  notes?: string
  sources?: SourceReference[]
}

/** ─── AI grounding (optional, forward-compatible) ───────────────────────── */

export interface CitationSpan {
  sourceId: string
  start: number
  end: number
}

export interface GroundingContext {
  /** Vector / FTS row ids tied to this entity or its text */
  chunkIds?: string[]
  embeddingIds?: string[]
  /** Spans into canonical or imported text for UI citations */
  citationSpans?: CitationSpan[]
  /** Extra retrieval keys without polluting core fields */
  tags?: string[]
}

/** ─── Shared entity core ─────────────────────────────────────────────────── */

export interface EntityCommon {
  id: string
  slug: string
  label: string
  summary?: string
  /** Narrative body; keep separate from `summary` for RAG chunking */
  description?: string
  /** Every entity is time-aware; use null only for genuinely timeless abstractions (rare) */
  time: TimeRange | null
  sources: SourceReference[]
  relationships: EntityRelationship[]
  geography?: GeoReference | null
  /** Loose extension point for imports and migrations */
  metadata?: Record<string, unknown>
  grounding?: GroundingContext
}

/** ─── Typed entities ─────────────────────────────────────────────────────── */

export interface Place extends EntityCommon {
  kind: 'place'
  placeKind?: 'settlement' | 'region_label' | 'natural' | 'archaeological_site' | 'other'
  alsoKnownAs?: string[]
}

export interface Empire extends EntityCommon {
  kind: 'empire'
  government?: string
  alsoKnownAs?: string[]
}

export interface Person extends EntityCommon {
  kind: 'person'
  birth?: HistoricalInstant | null
  death?: HistoricalInstant | null
  alsoKnownAs?: string[]
  roles?: string[]
}

export interface Architecture extends EntityCommon {
  kind: 'architecture'
  style?: string[]
  architect?: EntityReference[]
  alsoKnownAs?: string[]
}

export interface Landmark extends EntityCommon {
  kind: 'landmark'
  landmarkKind?: 'monument' | 'battlefield' | 'ruin' | 'natural' | 'other'
  alsoKnownAs?: string[]
}

export interface Event extends EntityCommon {
  kind: 'event'
  eventKind?: 'battle' | 'treaty' | 'discovery' | 'revolution' | 'other'
  /** Optional finer location than polygon centroid */
  primaryLocation?: GeoReference
}

export interface Era extends EntityCommon {
  kind: 'era'
  /** Eras often bound other entities via relationships + time overlap */
  theme?: string
}

export interface Culture extends EntityCommon {
  kind: 'culture'
  ethnoLinguistic?: string[]
  alsoKnownAs?: string[]
}

export interface Religion extends EntityCommon {
  kind: 'religion'
  branch?: string
  alsoKnownAs?: string[]
}

export interface TradeRoute extends EntityCommon {
  kind: 'trade_route'
  /** Path geometry; may duplicate or complement `geography` for polyline-specific tools */
  path?: LonLat[]
  terminals?: EntityReference[]
}

export interface Region extends EntityCommon {
  kind: 'region'
  regionKind?: 'political' | 'geographic' | 'historical' | 'cultural' | 'other'
  /** Higher-res geometry often lives here when other entities use `regionId` */
  boundary?: Extract<GeoReference, { kind: 'polygon' } | { kind: 'bounds' }>
}

/** Unified discriminant for the globe and list/search surfaces */
export type TerrisEntity =
  | Place
  | Empire
  | Person
  | Architecture
  | Landmark
  | Event
  | Era
  | Culture
  | Religion
  | TradeRoute
  | Region

/** Type guard helpers (optional use) */
export const ENTITY_KINDS: readonly EntityKind[] = [
  'place',
  'empire',
  'person',
  'architecture',
  'landmark',
  'event',
  'era',
  'culture',
  'religion',
  'trade_route',
  'region',
] as const
