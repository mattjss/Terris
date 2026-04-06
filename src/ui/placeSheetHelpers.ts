import { formatYear, formatYearRange } from '@/data/historical'
import { entityKindGroupLabel } from '@/data/search/entityKindLabels'
import type {
  NearbyAnchorKind,
  RelatedDiscoveryGroup,
  RelatedEntityRef,
  TerrisCoords,
  TerrisEntity,
  TerrisEntityKind,
  TerrisFact,
  TerrisFactCategory,
  TerrisTimelineEvent,
} from '@/data/types/terrisEntity'

const KIND_ORDER: TerrisEntityKind[] = [
  'place',
  'empire',
  'person',
  'event',
  'landmark',
  'venue',
  'museum',
  'artwork',
  'animal',
  'planet',
  'moon',
  'mission',
  'rover',
  'spacecraft',
  'crater',
  'mountain',
  'atmosphere-feature',
  'galaxy',
  'nebula',
  'black-hole',
  'exoplanet',
  'star',
  'constellation',
  'observatory',
  'cosmic-event',
]

const DISCOVERY_GROUP_ORDER: RelatedDiscoveryGroup[] = [
  'places',
  'people',
  'events',
  'venues',
  'institutions',
  'artworks',
  'missions',
  'planets',
  'other',
]

const NEARBY_ANCHOR_ORDER: NearbyAnchorKind[] = [
  'landmark',
  'museum',
  'venue',
  'neighborhood',
  'natural-feature',
]

export const FACT_CATEGORY_ORDER: TerrisFactCategory[] = [
  'identity',
  'location',
  'significance',
  'dimensions',
  'dates',
  'institutions',
  'other',
]

export const FACT_SECTION_LABEL: Record<TerrisFactCategory, string> = {
  identity: 'Identity',
  location: 'Location & geography',
  significance: 'Historical significance',
  dimensions: 'Dimensions & specifications',
  dates: 'Dates & chronology',
  institutions: 'Institutions & people',
  other: 'Additional context',
}

const DISCOVERY_GROUP_LABEL: Record<RelatedDiscoveryGroup, string> = {
  places: 'Places & landscapes',
  people: 'People',
  events: 'Events',
  venues: 'Venues',
  institutions: 'Institutions',
  artworks: 'Art & objects',
  missions: 'Missions & spacecraft',
  planets: 'Planets & moons',
  other: 'Related',
}

const NEARBY_ANCHOR_LABEL: Record<NearbyAnchorKind, string> = {
  landmark: 'Landmarks',
  museum: 'Museums & collections',
  venue: 'Venues',
  neighborhood: 'Neighborhoods',
  'natural-feature': 'Parks & natural features',
}

export function formatEntityYearRange(entity: TerrisEntity): string {
  const { startYear, endYear } = entity
  if (startYear === null && endYear === null) return 'Year unknown'
  if (startYear !== null && endYear !== null && startYear === endYear) {
    return formatYear(startYear)
  }
  if (startYear !== null && endYear === null) {
    return `${formatYear(startYear)} – present`
  }
  if (startYear !== null && endYear !== null) {
    return formatYearRange(startYear, endYear)
  }
  if (startYear === null && endYear !== null) {
    return `until ${formatYear(endYear)}`
  }
  return 'Year unknown'
}

export function formatEntityKindLabel(kind: TerrisEntityKind): string {
  return kind
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function formatCoords(coords: TerrisCoords | null): string | null {
  if (!coords) return null
  const ns = coords.lat >= 0 ? 'N' : 'S'
  const ew = coords.lon >= 0 ? 'E' : 'W'
  return `${Math.abs(coords.lat).toFixed(4)}°${ns}, ${Math.abs(coords.lon).toFixed(4)}°${ew}`
}

/** Primary display line for a timeline row */
export function formatTimelineDateLabel(e: TerrisTimelineEvent): string {
  return e.dateLabel
}

/** @deprecated Use formatTimelineDateLabel */
export function formatTimelineWhen(e: TerrisTimelineEvent): string {
  return formatTimelineDateLabel(e)
}

export function sortTimelineChronological(entries: TerrisTimelineEvent[]): TerrisTimelineEvent[] {
  return [...entries].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year
    const ae = a.endYear ?? a.year
    const be = b.endYear ?? b.year
    return ae - be
  })
}

export function groupFactsByCategory(
  facts: TerrisFact[],
): { category: TerrisFactCategory; label: string; items: TerrisFact[] }[] {
  const map = new Map<TerrisFactCategory, TerrisFact[]>()
  for (const f of facts) {
    const list = map.get(f.category) ?? []
    list.push(f)
    map.set(f.category, list)
  }
  return FACT_CATEGORY_ORDER.filter((c) => map.has(c)).map((category) => ({
    category,
    label: FACT_SECTION_LABEL[category],
    items: map.get(category)!,
  }))
}

function kindToDiscoveryGroup(kind: TerrisEntityKind): RelatedDiscoveryGroup {
  switch (kind) {
    case 'place':
    case 'empire':
    case 'landmark':
      return 'places'
    case 'person':
      return 'people'
    case 'event':
      return 'events'
    case 'venue':
      return 'venues'
    case 'museum':
      return 'institutions'
    case 'artwork':
      return 'artworks'
    case 'mission':
    case 'rover':
    case 'spacecraft':
      return 'missions'
    case 'planet':
    case 'moon':
      return 'planets'
    default:
      return 'other'
  }
}

export function resolveRelatedGroup(ref: RelatedEntityRef): RelatedDiscoveryGroup {
  return ref.group ?? kindToDiscoveryGroup(ref.kind)
}

export function groupRelatedByDiscoveryGroup(
  refs: RelatedEntityRef[],
): { group: RelatedDiscoveryGroup; label: string; items: RelatedEntityRef[] }[] {
  const map = new Map<RelatedDiscoveryGroup, RelatedEntityRef[]>()
  for (const r of refs) {
    const g = resolveRelatedGroup(r)
    const list = map.get(g) ?? []
    list.push(r)
    map.set(g, list)
  }
  return DISCOVERY_GROUP_ORDER.filter((g) => map.has(g)).map((group) => ({
    group,
    label: DISCOVERY_GROUP_LABEL[group],
    items: map.get(group)!,
  }))
}

/** Legacy: group strictly by entity kind */
export function groupRelatedByKind(
  refs: RelatedEntityRef[],
): { kind: TerrisEntityKind; label: string; items: RelatedEntityRef[] }[] {
  const map = new Map<TerrisEntityKind, RelatedEntityRef[]>()
  for (const r of refs) {
    const list = map.get(r.kind) ?? []
    list.push(r)
    map.set(r.kind, list)
  }
  return KIND_ORDER.filter((k) => map.has(k)).map((kind) => ({
    kind,
    label: entityKindGroupLabel(kind),
    items: map.get(kind)!,
  }))
}

function inferNearbyAnchor(ref: RelatedEntityRef): NearbyAnchorKind {
  if (ref.anchorKind) return ref.anchorKind
  switch (ref.kind) {
    case 'landmark':
      return 'landmark'
    case 'museum':
      return 'museum'
    case 'venue':
      return 'venue'
    case 'place':
      return 'neighborhood'
    default:
      return 'landmark'
  }
}

export function groupNearbyByAnchor(
  refs: RelatedEntityRef[],
): { anchor: NearbyAnchorKind; label: string; items: RelatedEntityRef[] }[] {
  const map = new Map<NearbyAnchorKind, RelatedEntityRef[]>()
  for (const r of refs) {
    const a = inferNearbyAnchor(r)
    const list = map.get(a) ?? []
    list.push(r)
    map.set(a, list)
  }
  return NEARBY_ANCHOR_ORDER.filter((k) => map.has(k)).map((anchor) => ({
    anchor,
    label: NEARBY_ANCHOR_LABEL[anchor],
    items: map.get(anchor)!,
  }))
}

/**
 * Prefer explicit `nearby`; otherwise derive walkable anchors from related hubs.
 */
export function resolveNearbyRefs(entity: TerrisEntity): RelatedEntityRef[] {
  if (entity.nearby.length > 0) return entity.nearby
  return entity.relatedEntities.filter(
    (r) => r.kind === 'landmark' || r.kind === 'venue',
  )
}
