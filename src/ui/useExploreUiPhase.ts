import { useMemo } from 'react'
import {
  useExploreScaleStore,
  type ExplorerMode,
  type ExploreTransitionState,
} from '@/state/exploreScaleStore'
import {
  midTransitionOpacityDip,
  smoothstep01,
} from '@/ui/exploreUiMotion'

export type ExploreUiPhase = {
  mode: ExplorerMode
  transitionState: ExploreTransitionState
  transitionProgress: number

  /** Opacities for stacked placeholder lines (sum ≤ 1; crossfade). */
  searchLineOpacityEarth: number
  searchLineOpacityPlanetary: number
  searchLineOpacityCosmic: number

  /** Whole search control opacity (slight dip mid-transition). */
  searchBarOpacity: number

  /** 1 = full Earth time minimap; 0 = hidden. */
  earthTimeRailWeight: number

  /** 1 = planetary / cosmic contextual bottom shell. */
  planetaryBottomShellWeight: number

  /** Chip label crossfade during Earth → Planetary (timeline readout → “Planetary view”). */
  bottomChipPlanetaryLabelWeight: number

  /** Earth layer row labels (People, Places, …). */
  layerEarthOpacity: number

  /** Planetary layer row labels (Surface, Atmosphere, …). */
  layerPlanetaryOpacity: number

  /** True while Earth place sheet should run exit motion. */
  shouldDismissEarthPlaceSheet: boolean
}

function phaseWeights(
  mode: 'earth' | 'planetary' | 'cosmic',
  transitionState: 'idle' | 'zooming-out' | 'zooming-in',
  p: number,
): Omit<
  ExploreUiPhase,
  'mode' | 'transitionState' | 'transitionProgress' | 'shouldDismissEarthPlaceSheet'
> {
  const idle = transitionState === 'idle'
  const earthToPlanetary = transitionState === 'zooming-out' && mode === 'earth'
  const planetaryToEarth = transitionState === 'zooming-in' && mode === 'planetary'
  const planetaryToCosmic = transitionState === 'zooming-out' && mode === 'planetary'
  const cosmicToPlanetary = transitionState === 'zooming-in' && mode === 'cosmic'

  let searchLineOpacityEarth = 0
  let searchLineOpacityPlanetary = 0
  let searchLineOpacityCosmic = 0

  if (mode === 'earth' && idle) {
    searchLineOpacityEarth = 1
  } else if (mode === 'planetary' && idle) {
    searchLineOpacityPlanetary = 1
  } else if (mode === 'cosmic' && idle) {
    searchLineOpacityCosmic = 1
  } else if (earthToPlanetary) {
    const t = smoothstep01((p - 0.7) / 0.3)
    searchLineOpacityEarth = 1 - t
    searchLineOpacityPlanetary = t
  } else if (planetaryToEarth) {
    const t = smoothstep01((p - 0.7) / 0.3)
    searchLineOpacityEarth = t
    searchLineOpacityPlanetary = 1 - t
  } else if (planetaryToCosmic) {
    const t = smoothstep01((p - 0.7) / 0.3)
    searchLineOpacityPlanetary = 1 - t
    searchLineOpacityCosmic = t
  } else if (cosmicToPlanetary) {
    const t = smoothstep01((p - 0.7) / 0.3)
    searchLineOpacityCosmic = 1 - t
    searchLineOpacityPlanetary = t
  } else {
    if (mode === 'earth') searchLineOpacityEarth = 1
    else if (mode === 'planetary') searchLineOpacityPlanetary = 1
    else searchLineOpacityCosmic = 1
  }

  let searchBarOpacity = 1
  if (
    transitionState !== 'idle' &&
    (earthToPlanetary || planetaryToEarth || planetaryToCosmic || cosmicToPlanetary)
  ) {
    searchBarOpacity = midTransitionOpacityDip(p, 0.11)
  }

  let earthTimeRailWeight = 0
  let planetaryBottomShellWeight = 0
  let bottomChipPlanetaryLabelWeight = 0

  if (mode === 'earth' && idle) {
    earthTimeRailWeight = 1
    bottomChipPlanetaryLabelWeight = 0
  } else if (mode === 'planetary' && idle) {
    planetaryBottomShellWeight = 1
    bottomChipPlanetaryLabelWeight = 1
  } else if (mode === 'cosmic' && idle) {
    planetaryBottomShellWeight = 1
    bottomChipPlanetaryLabelWeight = 1
  } else if (earthToPlanetary) {
    earthTimeRailWeight = 1 - smoothstep01((p - 0.12) / 0.58)
    planetaryBottomShellWeight = smoothstep01((p - 0.18) / 0.62)
    bottomChipPlanetaryLabelWeight = smoothstep01((p - 0.1) / 0.55)
  } else if (planetaryToEarth) {
    earthTimeRailWeight = smoothstep01((p - 0.22) / 0.58)
    planetaryBottomShellWeight = 1 - smoothstep01((p - 0.15) / 0.6)
    bottomChipPlanetaryLabelWeight = 1 - smoothstep01((p - 0.2) / 0.55)
  } else if (planetaryToCosmic) {
    planetaryBottomShellWeight = 1
    bottomChipPlanetaryLabelWeight = 1
  } else if (cosmicToPlanetary) {
    planetaryBottomShellWeight = 1
    bottomChipPlanetaryLabelWeight = 1
  } else {
    if (mode === 'earth') earthTimeRailWeight = 1
    else {
      planetaryBottomShellWeight = 1
      bottomChipPlanetaryLabelWeight = 1
    }
  }

  let layerEarthOpacity = 0
  let layerPlanetaryOpacity = 0

  if (mode === 'earth' && idle) {
    layerEarthOpacity = 1
  } else if ((mode === 'planetary' || mode === 'cosmic') && idle) {
    layerPlanetaryOpacity = 1
  } else if (earthToPlanetary) {
    layerEarthOpacity = 1 - smoothstep01((p - 0.04) / 0.38)
    layerPlanetaryOpacity = smoothstep01((p - 0.26) / 0.58)
  } else if (planetaryToEarth) {
    layerEarthOpacity = smoothstep01((p - 0.28) / 0.58)
    layerPlanetaryOpacity = 1 - smoothstep01((p - 0.12) / 0.48)
  } else if (planetaryToCosmic || cosmicToPlanetary) {
    layerPlanetaryOpacity = 1
  } else {
    if (mode === 'earth') layerEarthOpacity = 1
    else layerPlanetaryOpacity = 1
  }

  return {
    searchLineOpacityEarth,
    searchLineOpacityPlanetary,
    searchLineOpacityCosmic,
    searchBarOpacity,
    earthTimeRailWeight,
    planetaryBottomShellWeight,
    bottomChipPlanetaryLabelWeight,
    layerEarthOpacity,
    layerPlanetaryOpacity,
  }
}

/**
 * Derives soft UI weights from `useExploreScaleStore` for Earth ↔ Planetary (and cosmic) continuity.
 */
export function useExploreUiPhase(): ExploreUiPhase {
  const mode = useExploreScaleStore((s) => s.mode)
  const transitionState = useExploreScaleStore((s) => s.transitionState)
  const transitionProgress = useExploreScaleStore((s) => s.transitionProgress)

  return useMemo(() => {
    const w = phaseWeights(mode, transitionState, transitionProgress)
    const shouldDismissEarthPlaceSheet =
      transitionState === 'zooming-out' && mode === 'earth'

    return {
      mode,
      transitionState,
      transitionProgress,
      shouldDismissEarthPlaceSheet,
      ...w,
    }
  }, [mode, transitionState, transitionProgress])
}
