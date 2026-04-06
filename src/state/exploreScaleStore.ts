import { create } from 'zustand'
import type { ExplorerMode } from '@/data/types/terrisEntity'

export type { ExplorerMode }

/** Camera / scene blend phase — drives cinematic cross-fades without hard cuts. */
export type ExploreTransitionState = 'idle' | 'zooming-out' | 'zooming-in'

export type ExploreVisualOpacities = {
  /** Earth atmospheric shell (glow) — fades as we pull back. */
  earthAtmosphereOpacity: number
  /** Historical + POI labels on the globe. */
  earthCityLabelsOpacity: number
  /** Orbit / body labels in planetary layout. */
  planetaryLabelsOpacity: number
  /** Milky Way / deep field backdrop in cosmic mode. */
  cosmicBackdropOpacity: number
}

type ExploreScaleState = ExploreVisualOpacities & {
  mode: ExplorerMode
  transitionState: ExploreTransitionState
  /** 0 = start of current transition segment, 1 = complete */
  transitionProgress: number
  /** When a transition starts, camera lerp endpoints (world space). */
  transitionCameraStart: [number, number, number] | null
  transitionCameraEnd: [number, number, number] | null
  /** OrbitControls disabled during scripted camera blend. */
  controlsSuspended: boolean

  setMode: (mode: ExplorerMode) => void
  setTransitionState: (s: ExploreTransitionState) => void
  setTransitionProgress: (p: number) => void
  setTransitionCamera: (
    start: [number, number, number] | null,
    end: [number, number, number] | null,
  ) => void
  setControlsSuspended: (v: boolean) => void
  setVisualOpacities: (patch: Partial<ExploreVisualOpacities>) => void
  resetTransitionCameras: () => void
}

const defaultVisuals: ExploreVisualOpacities = {
  earthAtmosphereOpacity: 1,
  earthCityLabelsOpacity: 1,
  planetaryLabelsOpacity: 0,
  cosmicBackdropOpacity: 0,
}

export const useExploreScaleStore = create<ExploreScaleState>((set) => ({
  mode: 'earth',
  transitionState: 'idle',
  transitionProgress: 0,
  transitionCameraStart: null,
  transitionCameraEnd: null,
  controlsSuspended: false,
  ...defaultVisuals,

  setMode: (mode) => set({ mode }),
  setTransitionState: (transitionState) => set({ transitionState }),
  setTransitionProgress: (transitionProgress) => set({ transitionProgress }),
  setTransitionCamera: (transitionCameraStart, transitionCameraEnd) =>
    set({ transitionCameraStart, transitionCameraEnd }),
  setControlsSuspended: (controlsSuspended) => set({ controlsSuspended }),
  setVisualOpacities: (patch) => set((s) => ({ ...s, ...patch })),
  resetTransitionCameras: () =>
    set({
      transitionCameraStart: null,
      transitionCameraEnd: null,
    }),
}))
