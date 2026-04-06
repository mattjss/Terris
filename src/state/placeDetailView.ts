/**
 * Place Detail View — interaction model for transitioning between globe exploration
 * and a focused place experience. Transitions are phase-based for future animation.
 */

export type TerrisUiMode = 'globe' | 'place_detail'

/**
 * Lifecycle for enter/exit transitions (mock timing for now; wire to motion later).
 * - idle: globe exploration
 * - entering: user chose a place; sheet/camera work can animate in
 * - active: place detail is fully presented
 * - exiting: returning to globe; reverse animation hook
 */
export type PlaceDetailTransitionPhase =
  | 'idle'
  | 'entering'
  | 'active'
  | 'exiting'

export function isGlobeMode(mode: TerrisUiMode): boolean {
  return mode === 'globe'
}

export function isPlaceDetailMode(mode: TerrisUiMode): boolean {
  return mode === 'place_detail'
}
