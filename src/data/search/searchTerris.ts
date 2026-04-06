import type {
  ExplorerMode,
  TerrisEntity,
  TerrisEntityKind,
} from '@/data/types/terrisEntity'
import { MOCK_ENTITY_CATALOG } from '@/data/services/entityService'
import { entityKindGroupLabel } from '@/data/search/entityKindLabels'

function haystackForSearch(e: TerrisEntity): string {
  return [
    e.name,
    e.summary,
    e.type,
    e.fullDescription,
    e.placeName,
    e.regionName,
    e.countryName,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

function compareSearchRank(a: TerrisEntity, b: TerrisEntity, q: string): number {
  if (!q) return a.name.localeCompare(b.name)
  const qa = q.toLowerCase()
  const aStart = a.name.toLowerCase().startsWith(qa) ? 0 : 1
  const bStart = b.name.toLowerCase().startsWith(qa) ? 0 : 1
  if (aStart !== bStart) return aStart - bStart
  const aWord = a.name.toLowerCase().includes(` ${qa}`) ? 0 : 1
  const bWord = b.name.toLowerCase().includes(` ${qa}`) ? 0 : 1
  if (aWord !== bWord) return aWord - bWord
  return a.name.localeCompare(b.name)
}

/**
 * Empty query: browse entities in the current explore mode.
 * With text: search the full mock catalog across Earth / planetary / cosmic (discovery).
 */
export function searchTerrisEntities(
  mode: ExplorerMode,
  query: string,
): TerrisEntity[] {
  const q = query.trim().toLowerCase()
  const all = Object.values(MOCK_ENTITY_CATALOG)
  if (!q) {
    return all.filter((e) => e.mode === mode).sort((a, b) => a.name.localeCompare(b.name))
  }
  const matched = all.filter((e) => haystackForSearch(e).includes(q))
  matched.sort((a, b) => compareSearchRank(a, b, q))
  return matched
}

export type GroupedSearchResults = {
  type: TerrisEntityKind
  label: string
  items: TerrisEntity[]
}[]

export function groupSearchResultsByType(entities: TerrisEntity[]): GroupedSearchResults {
  const map = new Map<TerrisEntityKind, TerrisEntity[]>()
  for (const e of entities) {
    const list = map.get(e.type) ?? []
    list.push(e)
    map.set(e.type, list)
  }
  const types = [...map.keys()].sort((a, b) =>
    entityKindGroupLabel(a).localeCompare(entityKindGroupLabel(b)),
  )
  return types.map((type) => ({
    type,
    label: entityKindGroupLabel(type),
    items: map.get(type)!,
  }))
}
