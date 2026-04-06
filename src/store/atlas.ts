import { create } from 'zustand'
import { type EntityType, type HistoricalEntity, entities, isVisibleAtYear, YEAR_DEFAULT } from '@/data/historical'
import { useTerrisStore } from '@/state/useTerrisStore'

/** Updated from the Three.js globe (throttled) for overlay readouts. */
export interface GlobeViewState {
  /** Center of screen raycast on the globe (degrees). */
  centerLat: number
  centerLng: number
  /** Camera distance from globe center (world units). */
  distance: number
  /** Mirrors OrbitControls auto-rotate when nothing is selected. */
  autoRotating: boolean
}

interface AtlasState {
  currentYear: number
  selectedId: string | null
  hoveredId: string | null
  activeFilters: EntityType[]
  searchQuery: string
  reducedMotion: boolean
  globeView: GlobeViewState

  setYear: (year: number) => void
  setSelected: (id: string | null) => void
  setHovered: (id: string | null) => void
  toggleFilter: (type: EntityType) => void
  setSearchQuery: (query: string) => void
  setGlobeView: (patch: Partial<GlobeViewState>) => void
}

export const useAtlasStore = create<AtlasState>((set) => ({
  currentYear: YEAR_DEFAULT,
  selectedId: null,
  hoveredId: null,
  activeFilters: [],
  searchQuery: '',
  reducedMotion:
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,

  globeView: {
    centerLat: 0,
    centerLng: 0,
    distance: 5.2,
    autoRotating: true,
  },

  setYear: (year) => set({ currentYear: year }),
  setSelected: (id) => {
    if (id) {
      const entity = entities.find((e) => e.id === id)
      if (entity && !isVisibleAtYear(entity, useAtlasStore.getState().currentYear)) {
        const midYear = entity.yearStart === entity.yearEnd
          ? entity.yearStart
          : Math.round((entity.yearStart + entity.yearEnd) / 2)
        set({ selectedId: id, currentYear: midYear, searchQuery: '' })
        useTerrisStore.getState().setYear(midYear)
        useTerrisStore.getState().setSearchOpen(false)
        return
      }
    }
    set({ selectedId: id, searchQuery: '' })
    useTerrisStore.getState().setSearchOpen(false)
  },
  setHovered: (id) => set({ hoveredId: id }),
  toggleFilter: (type) =>
    set((state) => ({
      activeFilters: state.activeFilters.includes(type)
        ? state.activeFilters.filter((f) => f !== type)
        : [...state.activeFilters, type],
    })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setGlobeView: (patch) =>
    set((state) => ({
      globeView: { ...state.globeView, ...patch },
    })),
}))

export function useVisibleEntities(): HistoricalEntity[] {
  const year = useAtlasStore((s) => s.currentYear)
  const filters = useAtlasStore((s) => s.activeFilters)

  return entities.filter((e) => {
    if (filters.length > 0 && !filters.includes(e.type)) return false
    return isVisibleAtYear(e, year)
  })
}
