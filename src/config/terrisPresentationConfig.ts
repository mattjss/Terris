import type { ContentDepth } from '@/state/educationalContextTypes'
import type { PlaceSheetTabId } from '@/ui/placeSheetTypes'

const ALL_TABS: PlaceSheetTabId[] = [
  'overview',
  'timeline',
  'facts',
  'media',
  'related',
  'nearby',
  'reconstruction',
]

const STANDARD_QUICK_TABS: PlaceSheetTabId[] = ['overview', 'related', 'nearby']

const PLACE_SHEET_TABS = {
  quick: STANDARD_QUICK_TABS,
  standard: ALL_TABS,
  deep: ALL_TABS,
}

/** Single search field — all scales (Earth / planetary / cosmic) in one flow. */
export const TERRIS_UNIFIED_SEARCH_PLACEHOLDER =
  'Search places, people, stories, and worlds…'

/** Legacy Earth-only line; prefer `TERRIS_UNIFIED_SEARCH_PLACEHOLDER`. */
export const TERRIS_SEARCH_BAR_HINT_EARTH = TERRIS_UNIFIED_SEARCH_PLACEHOLDER

/** Curated starter prompts for the search panel (labels + query text). */
export const SEARCH_STARTER_PROMPTS: readonly { label: string; query: string }[] = [
  { label: 'Ancient Rome', query: 'Rome' },
  { label: 'Pyramids', query: 'Pyramid' },
  { label: 'Apollo 11', query: 'Apollo' },
  { label: 'Boston', query: 'Boston' },
  { label: 'Mars', query: 'Mars' },
] as const

/** Copy when no entity is selected in the place sheet. */
export const EMPTY_PLACE_SHEET_TEASER =
  'Choose a marker or search result to open a multimedia atlas dossier—sources, timeline, and interpretive views.'

/** When true, hide Kind / Mode / coarse coords in entity metadata (unless depth is deep). */
export const DEFAULT_METADATA_COMPACT = false

export function resolvePlaceSheetTabs(depth: ContentDepth): PlaceSheetTabId[] {
  const { quick, standard, deep } = PLACE_SHEET_TABS
  if (depth === 'quick') return quick
  if (depth === 'standard') return standard
  return deep
}
