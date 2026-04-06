import { create } from 'zustand'
import type { ExplorerMode } from '@/state/exploreScaleStore'
import type { TerrisEntity } from '@/data/types/terrisEntity'
import type {
  PlaceDetailTransitionPhase,
  TerrisUiMode,
} from '@/state/placeDetailView'
import {
  type TimeEraId,
  clampYearToTimeline,
  getEraMidYear,
  getMacroEraById,
} from '@/ui/timeEras'
import {
  SEARCH_PLACEHOLDER_COSMIC,
  SEARCH_PLACEHOLDER_EARTH,
  SEARCH_PLACEHOLDER_PLANETARY,
} from '@/data/search/searchPlaceholders'
import { getPathwayById } from '@/data/learning/seedPathways'
import type { LearningPathwaySheetTab } from '@/data/learning/pathwayTypes'
import { useExploreScaleStore } from '@/state/exploreScaleStore'
import { getMockEntityById } from '@/data/services/entityService'
import { TIMELINE_YEAR_MAX, TIMELINE_YEAR_MIN } from '@/ui/Timeline'
import type { ContentDepth } from '@/state/educationalContextTypes'

export type HoveredCoords = { lat: number; lon: number }

function placeholderForMode(mode: ExplorerMode): string {
  if (mode === 'planetary') return SEARCH_PLACEHOLDER_PLANETARY
  if (mode === 'cosmic') return SEARCH_PLACEHOLDER_COSMIC
  return SEARCH_PLACEHOLDER_EARTH
}

export const useTerrisStore = create<{
  year: number
  setYear: (year: number) => void
  hoveredCoords: HoveredCoords | null
  setHoveredCoords: (coords: HoveredCoords | null) => void

  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
  /** Mirrors explore scale for search UX (synced from `useExploreScaleStore` in App). */
  searchMode: ExplorerMode
  setSearchMode: (mode: ExplorerMode) => void
  searchPlaceholder: string
  setSearchPlaceholder: (text: string) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  searchResults: TerrisEntity[]
  setSearchResults: (results: TerrisEntity[]) => void
  selectedSearchResultId: string | null
  setSelectedSearchResultId: (id: string | null) => void

  /** High-level shell: globe exploration vs focused place detail (see `placeDetailView.ts`). */
  uiMode: TerrisUiMode
  /** Fine-grained transition step for future motion design. */
  placeDetailTransitionPhase: PlaceDetailTransitionPhase
  /** Enter focused entity sheet; Earth hubs request globe focus when coords exist. */
  enterPlaceDetail: (entity: TerrisEntity) => void
  /** Leave place detail and return to globe exploration. */
  exitPlaceDetail: () => void
  selectedEntity: TerrisEntity | null
  /** Low-level selection; prefer enterPlaceDetail / exitPlaceDetail for UI flows. */
  setSelectedEntity: (entity: TerrisEntity | null) => void
  /** Monotonic id so GlobeScene can react to repeated focus on the same coordinates. */
  globeFocusRequestId: number
  globeFocusTarget: { lat: number; lon: number } | null
  requestGlobeFocus: (lat: number, lon: number) => void
  /** @deprecated Use searchQuery — retained for HistoricalSearchBar until migrated. */
  historySearchQuery: string
  setHistorySearchQuery: (q: string) => void
  /** Time minimap: broad eras vs focused sub-periods within one macro era. */
  timeMinimapScope: 'macro' | 'local'
  timeMinimapMacroId: TimeEraId | null
  openTimeMinimapLocal: (macroId: TimeEraId) => void
  closeTimeMinimapLocal: () => void
  setTimeMinimapMacroId: (id: TimeEraId | null) => void

  /** Place sheet tab density — quick / standard / deep. */
  contentDepth: ContentDepth
  setContentDepth: (depth: ContentDepth) => void

  /** Monotonic clock for kiosk idle detection (ms since epoch). */
  lastUserInteractionAt: number
  bumpUserInteraction: () => void

  /** Guided learning pathway (optional; free exploration always available). */
  guidedPathwayId: string | null
  guidedStepIndex: number
  /** One-shot tab focus when applying a step — consumed by PlaceSheet. */
  guidedSheetTabHint: LearningPathwaySheetTab | null
  startGuidedPathway: (pathwayId: string) => void
  exitGuidedMode: () => void
  goToGuidedStep: (index: number) => void
  advanceGuidedStep: () => void
  previousGuidedStep: () => void
  setGuidedSheetTabHint: (tab: LearningPathwaySheetTab | null) => void
  /** Restore a pathway at a specific step (e.g. “continue where you left off”). */
  restoreGuidedPathway: (pathwayId: string, stepIndex: number) => void
}>((set, get) => ({
  year: 100,
  setYear: (year) => set({ year }),
  hoveredCoords: null,
  setHoveredCoords: (coords) => set({ hoveredCoords: coords }),

  searchOpen: false,
  setSearchOpen: (open) => set({ searchOpen: open }),
  searchMode: 'earth',
  setSearchMode: (mode) =>
    set({
      searchMode: mode,
      searchPlaceholder: placeholderForMode(mode),
    }),
  searchPlaceholder: placeholderForMode('earth'),
  setSearchPlaceholder: (text) => set({ searchPlaceholder: text }),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  searchResults: [],
  setSearchResults: (results) => set({ searchResults: results }),
  selectedSearchResultId: null,
  setSelectedSearchResultId: (id) => set({ selectedSearchResultId: id }),

  uiMode: 'globe',
  placeDetailTransitionPhase: 'idle',
  enterPlaceDetail: (entity) => {
    set({
      uiMode: 'place_detail',
      placeDetailTransitionPhase: 'entering',
      selectedEntity: entity,
      lastUserInteractionAt: Date.now(),
    })
    if (entity.mode === 'earth' && entity.coords) {
      get().requestGlobeFocus(entity.coords.lat, entity.coords.lon)
    }
    queueMicrotask(() => set({ placeDetailTransitionPhase: 'active' }))
  },
  exitPlaceDetail: () => {
    if (get().uiMode !== 'place_detail') {
      set({ selectedEntity: null, placeDetailTransitionPhase: 'idle' })
      return
    }
    set({ placeDetailTransitionPhase: 'exiting' })
    queueMicrotask(() =>
      set({
        uiMode: 'globe',
        selectedEntity: null,
        placeDetailTransitionPhase: 'idle',
      }),
    )
  },
  selectedEntity: null,
  setSelectedEntity: (entity) => {
    if (entity === null) {
      get().exitPlaceDetail()
    } else {
      get().enterPlaceDetail(entity)
    }
  },
  globeFocusRequestId: 0,
  globeFocusTarget: null,
  requestGlobeFocus: (lat, lon) =>
    set((s) => ({
      globeFocusRequestId: s.globeFocusRequestId + 1,
      globeFocusTarget: { lat, lon },
    })),
  historySearchQuery: '',
  setHistorySearchQuery: (q) => set({ historySearchQuery: q }),
  timeMinimapScope: 'macro',
  timeMinimapMacroId: null,
  openTimeMinimapLocal: (macroId) =>
    set((s) => {
      const era = getMacroEraById(macroId)
      if (!era) return {}
      let y = clampYearToTimeline(s.year)
      if (y < era.start || y > era.end) y = getEraMidYear(era)
      return {
        year: y,
        timeMinimapScope: 'local',
        timeMinimapMacroId: macroId,
      }
    }),
  closeTimeMinimapLocal: () =>
    set({ timeMinimapScope: 'macro', timeMinimapMacroId: null }),
  setTimeMinimapMacroId: (id) => set({ timeMinimapMacroId: id }),

  contentDepth: 'standard',
  setContentDepth: (contentDepth) => set({ contentDepth }),

  lastUserInteractionAt: Date.now(),
  bumpUserInteraction: () => set({ lastUserInteractionAt: Date.now() }),

  guidedPathwayId: null,
  guidedStepIndex: 0,
  guidedSheetTabHint: null,

  setGuidedSheetTabHint: (guidedSheetTabHint) => set({ guidedSheetTabHint }),

  exitGuidedMode: () =>
    set({
      guidedPathwayId: null,
      guidedStepIndex: 0,
      guidedSheetTabHint: null,
    }),

  startGuidedPathway: (pathwayId) => {
    const pathway = getPathwayById(pathwayId)
    if (!pathway || pathway.steps.length === 0) return
    set({ guidedPathwayId: pathwayId, guidedStepIndex: 0 })
    applyGuidedStepAtIndex(pathwayId, 0)
  },

  goToGuidedStep: (index) => {
    const id = get().guidedPathwayId
    if (!id) return
    const pathway = getPathwayById(id)
    if (!pathway || index < 0 || index >= pathway.steps.length) return
    set({ guidedStepIndex: index })
    applyGuidedStepAtIndex(id, index)
  },

  advanceGuidedStep: () => {
    const { guidedPathwayId: id, guidedStepIndex: i } = get()
    if (!id) return
    const pathway = getPathwayById(id)
    if (!pathway) return
    const next = Math.min(i + 1, pathway.steps.length - 1)
    if (next === i) return
    set({ guidedStepIndex: next })
    applyGuidedStepAtIndex(id, next)
  },

  previousGuidedStep: () => {
    const { guidedPathwayId: id, guidedStepIndex: i } = get()
    if (!id) return
    const prev = Math.max(0, i - 1)
    if (prev === i) return
    set({ guidedStepIndex: prev })
    applyGuidedStepAtIndex(id, prev)
  },

  restoreGuidedPathway: (pathwayId, stepIndex) => {
    const pathway = getPathwayById(pathwayId)
    if (!pathway || stepIndex < 0 || stepIndex >= pathway.steps.length) return
    set({ guidedPathwayId: pathwayId, guidedStepIndex: stepIndex })
    applyGuidedStepAtIndex(pathwayId, stepIndex)
  },
}))

function applyGuidedStepAtIndex(pathwayId: string, stepIndex: number) {
  const pathway = getPathwayById(pathwayId)
  const step = pathway?.steps[stepIndex]
  if (!step) return

  const entity = getMockEntityById(step.entityId)
  if (!entity) return

  const y =
    step.year === undefined
      ? undefined
      : Math.max(TIMELINE_YEAR_MIN, Math.min(TIMELINE_YEAR_MAX, step.year))

  useExploreScaleStore.getState().setMode(step.mode)
  useTerrisStore.setState({
    searchMode: step.mode,
    searchPlaceholder: placeholderForMode(step.mode),
    guidedSheetTabHint: step.sheetTab ?? null,
    ...(y !== undefined ? { year: y } : {}),
  })
  useTerrisStore.getState().enterPlaceDetail(entity)
  useTerrisStore.getState().bumpUserInteraction()
}
