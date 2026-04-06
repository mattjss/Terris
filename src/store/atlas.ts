import { create } from 'zustand'
import { type EntityType, type HistoricalEntity, entities, isVisibleAtYear, YEAR_DEFAULT } from '@/data/historical'

interface AtlasState {
  currentYear: number
  selectedId: string | null
  hoveredId: string | null
  activeFilters: EntityType[]
  searchQuery: string
  searchOpen: boolean
  reducedMotion: boolean

  setYear: (year: number) => void
  setSelected: (id: string | null) => void
  setHovered: (id: string | null) => void
  toggleFilter: (type: EntityType) => void
  setSearchQuery: (query: string) => void
  setSearchOpen: (open: boolean) => void
}

export const useAtlasStore = create<AtlasState>((set) => ({
  currentYear: YEAR_DEFAULT,
  selectedId: null,
  hoveredId: null,
  activeFilters: [],
  searchQuery: '',
  searchOpen: false,
  reducedMotion:
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,

  setYear: (year) => set({ currentYear: year }),
  setSelected: (id) => {
    if (id) {
      const entity = entities.find((e) => e.id === id)
      if (entity && !isVisibleAtYear(entity, useAtlasStore.getState().currentYear)) {
        const midYear = entity.yearStart === entity.yearEnd
          ? entity.yearStart
          : Math.round((entity.yearStart + entity.yearEnd) / 2)
        set({ selectedId: id, currentYear: midYear, searchOpen: false, searchQuery: '' })
        return
      }
    }
    set({ selectedId: id, searchOpen: false, searchQuery: '' })
  },
  setHovered: (id) => set({ hoveredId: id }),
  toggleFilter: (type) =>
    set((state) => ({
      activeFilters: state.activeFilters.includes(type)
        ? state.activeFilters.filter((f) => f !== type)
        : [...state.activeFilters, type],
    })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchOpen: (open) => set({ searchOpen: open }),
}))

export function useVisibleEntities(): HistoricalEntity[] {
  const year = useAtlasStore((s) => s.currentYear)
  const filters = useAtlasStore((s) => s.activeFilters)

  return entities.filter((e) => {
    if (filters.length > 0 && !filters.includes(e.type)) return false
    return isVisibleAtYear(e, year)
  })
}
