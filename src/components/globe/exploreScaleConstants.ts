/**
 * Thresholds for scale exploration (world-space camera distance from globe center).
 * Aligned with `GlobeScene` OrbitControls and `GlobeViewState.distance`.
 */

/** Begin cinematic pull-back toward planetary context (Earth mode, zooming out). */
export const EARTH_TO_PLANETARY_DISTANCE = 8.15

/** While in planetary mode, zoom out past this to enter cosmic / galactic context. */
export const PLANETARY_TO_COSMIC_DISTANCE = 46

/** In planetary mode, zoom in closer than this to initiate return to Earth mode. */
export const PLANETARY_TO_EARTH_DISTANCE = 12.5

/** In cosmic mode, zoom in past this to drop back to planetary framing. */
export const COSMIC_TO_PLANETARY_DISTANCE = 38

/** Scripted transition duration (seconds) for mode changes. */
/** Seconds — keep in sync with `EXPLORE_UI_MS_*` in `exploreUiMotion.ts` (derived). */
export const EXPLORE_TRANSITION_DURATION_EARTH_PLANETARY = 1.35
export const EXPLORE_TRANSITION_DURATION_PLANETARY_COSMIC = 1.65

/** Camera distance after Earth → planetary transition completes (same radial direction). */
export const PLANETARY_VIEW_CAMERA_DISTANCE = 15.8

/** Camera distance anchor for cosmic overview (same controls target). */
export const COSMIC_VIEW_CAMERA_DISTANCE = 78
