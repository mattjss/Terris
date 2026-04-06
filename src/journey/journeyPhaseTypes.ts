/**
 * Terris signature rhythm: browse → travel → portal → arrival → study.
 * `browse` and `study` are stable; middle three are sequential transitions.
 */
export type JourneyPhase = 'browse' | 'travel' | 'portal' | 'arrival' | 'study'

/** Durations (ms) — tuned for premium, not cinematic length. */
export const JOURNEY_TRAVEL_MS = 820
export const JOURNEY_PORTAL_MS = 700
export const JOURNEY_ARRIVAL_MS = 260
