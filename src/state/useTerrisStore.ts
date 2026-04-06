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
import {
  applyContextModeDefaults,
  DEFAULT_TEACHER_GUIDE,
} from '@/config/contextModeConfig'
import type {
  AgeRange,
  ContentDepth,
  ContextMode,
  ReadingLevel,
  TeacherGuideState,
} from '@/state/educationalContextTypes'

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

  /** Product context: classroom / family / exhibit (see `contextModeConfig.ts`). */
  contextMode: ContextMode
  setContextMode: (mode: ContextMode) => void
  readingLevel: ReadingLevel
  setReadingLevel: (level: ReadingLevel) => void
  ageRange: AgeRange | null
  setAgeRange: (range: AgeRange | null) => void
  sessionGoal: string | null
  setSessionGoal: (goal: string | null) => void
  /** Kiosk / exhibit: restrict secondary navigation (layers, shortcuts). */
  lockedNavigation: boolean
  setLockedNavigation: (locked: boolean) => void
  contentDepth: ContentDepth
  setContentDepth: (depth: ContentDepth) => void

  teacherGuide: TeacherGuideState
  setTeacherGuide: (patch: Partial<TeacherGuideState>) => void
  resetTeacherGuide: () => void

  /** Monotonic clock for kiosk idle detection (ms since epoch). */
  lastUserInteractionAt: number
  bumpUserInteraction: () => void
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

  contextMode: 'standard',
  setContextMode: (mode) =>
    set((s) => {
      const d = applyContextModeDefaults(mode)
      const enteringTeacher = mode === 'teacher' && s.contextMode !== 'teacher'
      return {
        contextMode: mode,
        readingLevel: d.readingLevel,
        ageRange: d.ageRange,
        contentDepth: d.contentDepth,
        lockedNavigation: d.lockedNavigation,
        teacherGuide: enteringTeacher ? DEFAULT_TEACHER_GUIDE : s.teacherGuide,
      }
    }),
  readingLevel: 'adult',
  setReadingLevel: (readingLevel) => set({ readingLevel }),
  ageRange: null,
  setAgeRange: (ageRange) => set({ ageRange }),
  sessionGoal: null,
  setSessionGoal: (sessionGoal) => set({ sessionGoal }),
  lockedNavigation: false,
  setLockedNavigation: (lockedNavigation) => set({ lockedNavigation }),
  contentDepth: 'standard',
  setContentDepth: (contentDepth) => set({ contentDepth }),

  teacherGuide: DEFAULT_TEACHER_GUIDE,
  setTeacherGuide: (patch) =>
    set((s) => ({ teacherGuide: { ...s.teacherGuide, ...patch } })),
  resetTeacherGuide: () => set({ teacherGuide: DEFAULT_TEACHER_GUIDE }),

  lastUserInteractionAt: Date.now(),
  bumpUserInteraction: () => set({ lastUserInteractionAt: Date.now() }),
}))
