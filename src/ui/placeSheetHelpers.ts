import { formatYear, formatYearRange } from '@/data/historical'
import { entityKindGroupLabel } from '@/data/search/entityKindLabels'
import type {
  RelatedEntityRef,
  TerrisCoords,
  TerrisEntity,
  TerrisEntityKind,
  TerrisTimelineEntry,
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

export function formatTimelineWhen(e: TerrisTimelineEntry): string {
  const { startYear, endYear } = e
  if (startYear !== null && endYear !== null) {
    if (startYear === endYear) return formatYear(startYear)
    return `${formatYear(startYear)} – ${formatYear(endYear)}`
  }
  if (startYear !== null) return formatYear(startYear)
  if (endYear !== null) return formatYear(endYear)
  return 'Date unknown'
}

export function sortTimelineChronological(entries: TerrisTimelineEntry[]): TerrisTimelineEntry[] {
  return [...entries].sort((a, b) => {
    const ay = a.startYear ?? a.endYear ?? Number.NEGATIVE_INFINITY
    const by = b.startYear ?? b.endYear ?? Number.NEGATIVE_INFINITY
    if (ay !== by) return ay - by
    const ae = a.endYear ?? Number.POSITIVE_INFINITY
    const be = b.endYear ?? Number.POSITIVE_INFINITY
    return ae - be
  })
}

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

/**
 * Prefer explicit `nearby`; otherwise derive walkable anchors from related hubs.
 */
export function resolveNearbyRefs(entity: TerrisEntity): RelatedEntityRef[] {
  if (entity.nearby.length > 0) return entity.nearby
  return entity.relatedEntities.filter(
    (r) => r.kind === 'landmark' || r.kind === 'venue',
  )
}
