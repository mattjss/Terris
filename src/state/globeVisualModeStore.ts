import { create } from 'zustand'
import { globeVisualBlendRef } from '@/state/globeVisualBlendRef'

const STORAGE_KEY = 'terris-globe-visual-mode'

export type GlobeVisualMode = 'atlas' | 'explorer'

function loadStoredMode(): GlobeVisualMode {
  if (typeof localStorage === 'undefined') return 'explorer'
  const v = localStorage.getItem(STORAGE_KEY)
  if (v === 'explorer' || v === 'atlas') return v
  /** Beauty-first default for new installs — returning users keep an explicit saved choice. */
  return 'explorer'
}

type GlobeVisualModeState = {
  mode: GlobeVisualMode
  setMode: (mode: GlobeVisualMode) => void
}

export const useGlobeVisualModeStore = create<GlobeVisualModeState>((set) => ({
  mode: typeof window !== 'undefined' ? loadStoredMode() : 'explorer',
  setMode: (mode) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, mode)
    }
    set({ mode })
  },
}))

/** Align blend ref with saved mode on app boot (before first `GlobeVisualBlendDriver` frame). */
export function hydrateGlobeVisualBlendRef(): void {
  globeVisualBlendRef.current = loadStoredMode() === 'explorer' ? 1 : 0
}
