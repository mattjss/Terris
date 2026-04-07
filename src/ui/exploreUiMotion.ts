import {
  EXPLORE_TRANSITION_DURATION_EARTH_PLANETARY,
  EXPLORE_TRANSITION_DURATION_PLANETARY_COSMIC,
} from '@/components/globe/exploreScaleConstants'

export {
  SEARCH_PLACEHOLDER_COSMIC,
  SEARCH_PLACEHOLDER_EARTH,
  SEARCH_PLACEHOLDER_PLANETARY,
} from '@/data/search/searchPlaceholders'

/**
 * Shared UI motion for explore scale transitions (aligned with scene choreography).
 * Calm, premium: one easing family, no overshoot, no spring.
 */

/** Primary ease — matches TimeMinimap playhead / scene bridge. */
export const EXPLORE_UI_EASE_CSS = 'cubic-bezier(0.22, 1, 0.36, 1)'

/** Matches `EXPLORE_TRANSITION_DURATION_EARTH_PLANETARY` (seconds → ms). */
export const EXPLORE_UI_MS_EARTH_PLANETARY = Math.round(
  EXPLORE_TRANSITION_DURATION_EARTH_PLANETARY * 1000,
)

/** Matches planetary ↔ cosmic camera bridge. */
export const EXPLORE_UI_MS_PLANETARY_COSMIC = Math.round(
  EXPLORE_TRANSITION_DURATION_PLANETARY_COSMIC * 1000,
)

/** Short layer for sheet / micro cross-fades (ms). */
export const EXPLORE_UI_MS_SHORT = 420

/** Build a CSS transition string for one or more properties. */
export function exploreUiTransition(
  properties: string,
  durationMs: number = EXPLORE_UI_MS_EARTH_PLANETARY,
): string {
  const props = properties.split(',').map((p) => p.trim())
  return props.map((p) => `${p} ${durationMs}ms ${EXPLORE_UI_EASE_CSS}`).join(', ')
}

export function smoothstep01(t: number): number {
  const x = Math.max(0, Math.min(1, t))
  return x * x * (3 - 2 * x)
}

/** Slight opacity dip mid-blend (bell curve on 0…1). */
export function midTransitionOpacityDip(progress01: number, amount = 0.1): number {
  const p = Math.max(0, Math.min(1, progress01))
  return 1 - amount * (4 * p * (1 - p))
}
