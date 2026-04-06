import { create } from 'zustand'
import type { TerrisEntity } from '@/data/types/terrisEntity'
import type { JourneyPhase } from '@/journey/journeyPhaseTypes'

type JourneyPhaseState = {
  phase: JourneyPhase
  /** Entity being traveled to (cleared when study begins). */
  targetEntity: TerrisEntity | null
  setPhase: (phase: JourneyPhase) => void
  resetToBrowse: () => void
  /** Start travel leg; caller sets Terris store (selectedEntity, focus) via `beginJourneyToEntity`. */
  startTravel: (entity: TerrisEntity) => void
}

export const useJourneyPhaseStore = create<JourneyPhaseState>((set) => ({
  phase: 'browse',
  targetEntity: null,
  setPhase: (phase) => set({ phase }),
  resetToBrowse: () => set({ phase: 'browse', targetEntity: null }),
  startTravel: (entity) => set({ phase: 'travel', targetEntity: entity }),
}))

export function isJourneyTransitioning(phase: JourneyPhase): boolean {
  return phase === 'travel' || phase === 'portal' || phase === 'arrival'
}
