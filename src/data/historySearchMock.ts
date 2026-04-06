import type { TimeEraId } from '@/ui/timeEras'

export type HistorySearchCategory =
  | 'place'
  | 'empire'
  | 'event'
  | 'architecture'
  | 'person'
  | 'era'

export type HistorySearchSuggestion = {
  id: string
  label: string
  category: HistorySearchCategory
  subtitle: string
  /** Jump the timeline when chosen (mock). */
  year: number
  /** Optional link to era highlight. */
  eraId?: TimeEraId
}

/** Mock catalog for autocomplete — replace with API-backed search later. */
export const HISTORY_SEARCH_MOCK: HistorySearchSuggestion[] = [
  {
    id: 'm-rome',
    label: 'Rome',
    category: 'place',
    subtitle: 'Italian peninsula · capital of empire',
    year: 120,
  },
  {
    id: 'm-roman-empire',
    label: 'Roman Empire',
    category: 'empire',
    subtitle: 'Mediterranean · principate',
    year: 100,
  },
  {
    id: 'm-actium',
    label: 'Battle of Actium',
    category: 'event',
    subtitle: '31 BCE · naval engagement',
    year: -31,
  },
  {
    id: 'm-parthenon',
    label: 'Parthenon',
    category: 'architecture',
    subtitle: 'Athens · classical temple',
    year: -430,
  },
  {
    id: 'm-augustus',
    label: 'Augustus',
    category: 'person',
    subtitle: 'First Roman emperor',
    year: -14,
  },
  {
    id: 'm-medieval',
    label: 'Medieval era',
    category: 'era',
    subtitle: '501 – 1500 CE',
    year: 1000,
    eraId: 'medieval',
  },
  {
    id: 'm-constantinople',
    label: 'Constantinople',
    category: 'place',
    subtitle: 'Bosphorus · imperial capital',
    year: 900,
  },
  {
    id: 'm-silk',
    label: 'Silk Road',
    category: 'event',
    subtitle: 'Trans-Asian trade routes',
    year: 800,
  },
  {
    id: 'm-renaissance',
    label: 'Italian Renaissance',
    category: 'era',
    subtitle: 'Art & humanism',
    year: 1480,
    eraId: 'early_modern',
  },
  {
    id: 'm-industrial',
    label: 'Industrial Revolution',
    category: 'event',
    subtitle: 'Britain · mechanization',
    year: 1820,
    eraId: 'modern',
  },
]

export function filterHistorySuggestions(
  query: string,
  catalog: HistorySearchSuggestion[] = HISTORY_SEARCH_MOCK,
): HistorySearchSuggestion[] {
  const q = query.trim().toLowerCase()
  if (!q) return catalog.slice(0, 8)
  return catalog
    .filter(
      (s) =>
        s.label.toLowerCase().includes(q) ||
        s.subtitle.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q),
    )
    .slice(0, 10)
}
