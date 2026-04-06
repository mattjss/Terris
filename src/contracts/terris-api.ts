/**
 * Terris HTTP API contract (v1) — globe-first exploration, search, timeline, grounded AI.
 * Backend not implemented per this file alone; types align future Fastify routes + React Query.
 *
 * Base path: `/api/v1` (proxy from Vite in dev). Future external provenance: `sourcesMerged` hints.
 */

import type { EntityKind, TerrisEntity } from '@/domain/entities'

// ─── Shared HTTP ───────────────────────────────────────────────────────────

export const API_V1_PREFIX = '/api/v1' as const

/** RFC 7807 Problem Details (+ Terris extensions) */
export interface ProblemDetails {
  type: string
  title: string
  status: number
  detail?: string
  instance?: string
  /** Machine-readable code, e.g. SEARCH_TIMEOUT */
  code?: string
  /** Field-level validation (400) */
  errors?: Array<{ path: string; message: string }>
}

/** Provenance slice for merged upstreams (Wikidata, Wikipedia, OSM, etc.) — future-filled */
export type UpstreamSource = 'terris' | 'wikidata' | 'wikipedia' | 'openstreetmap'

export interface ResponseMeta {
  requestId: string
  tookMs: number
  /** Which upstreams contributed to this response (for debugging & UI “sources”) */
  sourcesUsed?: UpstreamSource[]
}

export interface CursorPage {
  nextCursor?: string | null
  /** True when more results exist */
  hasMore: boolean
}

// ─── GET /api/v1/health ────────────────────────────────────────────────────
/** `GET /api/v1/health` */
export interface HealthResponse {
  ok: boolean
  version: string
  db: 'up' | 'degraded' | 'down'
}

// ─── GET /api/v1/search ─────────────────────────────────────────────────────
/**
 * Hybrid search: keyword + metadata filters; server may combine FTS, vector, and structured filters.
 * Globe-first: optional `bbox` scopes results to the visible viewport.
 */
export interface SearchQueryParams {
  /** Free text */
  q?: string
  /** Subset of entity kinds; omit = all searchable kinds */
  kinds?: EntityKind[]
  /** Timeline: filter entities overlapping this year (inclusive) */
  year?: number
  /**
   * Viewport in WGS84: west,south,east,north — matches globe frustum.
   * Optional; when set, boosts or restricts hits intersecting the box.
   */
  bbox?: [west: number, south: number, east: number, north: number]
  limit?: number
  cursor?: string
}

export interface SearchHit {
  id: string
  kind: EntityKind
  label: string
  slug: string
  summary?: string
  /** Best point or centroid for globe focus */
  centroid?: { lon: number; lat: number }
  /** Relevance 0–1 when semantic/vector involved */
  score?: number
}

export interface SearchResponse extends CursorPage {
  items: SearchHit[]
  meta: ResponseMeta
  /** Optional facets for narrowing (e.g. kind counts) */
  facets?: Partial<Record<EntityKind, number>>
  /** Echo or normalized query for UI chips */
  queryEcho?: { q?: string; year?: number; kinds?: EntityKind[] }
}

// ─── GET /api/v1/explore ────────────────────────────────────────────────────
/**
 * Explore by geography: center+radius or bbox, combined with timeline year for “what’s here then”.
 * Powers globe pick and “entities near this point”.
 */
export interface ExploreQueryParams {
  /** If bbox omitted: center + radiusM (meters) */
  lat?: number
  lng?: number
  radiusM?: number
  bbox?: [west: number, south: number, east: number, north: number]
  year?: number
  kinds?: EntityKind[]
  limit?: number
}

export interface ExploreHit {
  id: string
  kind: EntityKind
  label: string
  slug: string
  centroid: { lon: number; lat: number }
  /** Distance from lat/lng when center search used */
  distanceM?: number
}

/** Globe viewport sync: same bbox + year as explore for linked UI controls */
export interface GlobeViewportSyncPayload {
  bbox: [number, number, number, number]
  year: number | null
  /** Optional zoom / normalization hint for the globe camera */
  zoomHint?: number
}

export interface ExploreResponse {
  items: ExploreHit[]
  /** For aligning timeline scrubber with globe */
  globeViewport: GlobeViewportSyncPayload
  meta: ResponseMeta
}

// ─── GET /api/v1/entities/:id ────────────────────────────────────────────────
/** Path param: `id` */
export type EntityDetailResponse = TerrisEntity & {
  meta: ResponseMeta
}

// ─── GET /api/v1/entities/:id/related ──────────────────────────────────────
export interface RelatedQueryParams {
  /** Context year: filter edges/related that apply at this time */
  year?: number
  kinds?: EntityKind[]
  limit?: number
}

export interface RelatedEdge {
  id: string
  relation: string
  target: { id: string; kind: EntityKind; label: string; slug: string }
}

export interface RelatedResponse {
  entityId: string
  items: TerrisEntity[]
  edges?: RelatedEdge[]
  meta: ResponseMeta
}

// ─── GET /api/v1/timeline ──────────────────────────────────────────────────
/**
 * Timeline state for a focused entity OR region (mutually exclusive preferred).
 * Drives main timeline scrubber (ticks, bounds, suggested focus year).
 */
export interface TimelineQueryParams {
  entityId?: string
  regionId?: string
  fromYear?: number
  toYear?: number
  /** Bucket size for tick marks */
  granularity?: 'year' | 'decade' | 'century'
}

export interface TimelineTick {
  year: number
  label?: string
  /** Entity ids active or notable at this tick */
  highlightIds?: string[]
}

export interface TimelineResponse {
  focus: {
    entityId?: string
    regionId?: string
    /** Suggested scrubber position */
    focusYear: number
    range: { startYear: number; endYear: number }
  }
  ticks: TimelineTick[]
  /** Entities whose span overlaps the visible range (for chips / legend) */
  overlappingPreview?: Array<{ id: string; kind: EntityKind; label: string }>
  meta: ResponseMeta
}

// ─── POST /api/v1/ai/ask ────────────────────────────────────────────────────
/**
 * Grounded Q&A: scope to selected entity + time; server retrieves chunks then generates.
 * Future: merge citation snippets from Wikipedia/Wikidata via `groundingSources`.
 */
export interface AiAskRequest {
  question: string
  /** Required for grounding: which entity the user is “in” */
  entityId: string
  /** Timeline context; defaults to entity’s span or current UI year */
  year?: number
  timeRange?: { startYear: number; endYear: number }
  /** Idempotent client id for retries */
  clientMessageId?: string
}

export interface AiCitation {
  sourceId: string
  system: UpstreamSource | string
  title?: string
  url?: string
  excerpt: string
}

export interface AiAskResponse {
  answer: string
  citations: AiCitation[]
  disclaimer: string
  scope: { entityId: string; year?: number }
  meta: ResponseMeta
}

// ─── UI state helpers (client) ─────────────────────────────────────────────

export type AsyncStatus = 'idle' | 'loading' | 'success'

/** Standard empty: valid 200 with no rows */
export interface EmptyPayload {
  reason: 'no_match' | 'out_of_viewport' | 'before_data' | 'filtered_out'
  message: string
  suggestions?: string[]
}

export type SearchViewState =
  | { status: 'idle' }
  | { status: 'loading'; query: SearchQueryParams }
  | { status: 'success'; data: SearchResponse; empty: boolean; emptyPayload?: EmptyPayload }
  | { status: 'error'; problem: ProblemDetails }

export type ExploreViewState =
  | { status: 'idle' }
  | { status: 'loading'; params: ExploreQueryParams }
  | { status: 'success'; data: ExploreResponse; empty: boolean; emptyPayload?: EmptyPayload }
  | { status: 'error'; problem: ProblemDetails }

export type EntityDetailViewState =
  | { status: 'idle' }
  | { status: 'loading'; id: string }
  | { status: 'success'; data: EntityDetailResponse }
  | { status: 'error'; problem: ProblemDetails; notFound?: boolean }

export type RelatedViewState =
  | { status: 'idle' }
  | { status: 'loading'; entityId: string }
  | { status: 'success'; data: RelatedResponse; empty: boolean; emptyPayload?: EmptyPayload }
  | { status: 'error'; problem: ProblemDetails }

export type TimelineViewState =
  | { status: 'idle' }
  | { status: 'loading'; params: TimelineQueryParams }
  | { status: 'success'; data: TimelineResponse; empty: boolean; emptyPayload?: EmptyPayload }
  | { status: 'error'; problem: ProblemDetails }

export type AiAskViewState =
  | { status: 'idle' }
  | { status: 'loading'; body: AiAskRequest }
  | { status: 'success'; data: AiAskResponse }
  | { status: 'error'; problem: ProblemDetails }

/**
 * Endpoint map (methods + path patterns)
 * - GET  /api/v1/health
 * - GET  /api/v1/search
 * - GET  /api/v1/explore
 * - GET  /api/v1/entities/:id
 * - GET  /api/v1/entities/:id/related
 * - GET  /api/v1/timeline
 * - POST /api/v1/ai/ask
 */
