/**
 * Product context modes — how Terris behaves for classrooms, families, and exhibits.
 * Distinct from exploration scale (earth / planetary / cosmic).
 */

export type ContextMode = 'standard' | 'teacher' | 'family' | 'kiosk'

/** Reading level influences copy tone and default content density. */
export type ReadingLevel = 'elementary' | 'middle' | 'high' | 'adult'

/** Audience age span for family mode and filtering hints. */
export type AgeRange = {
  min: number
  max: number
}

/**
 * Content depth — same components, different information architecture.
 * - quick: hero + summary + light connections
 * - standard: full tab set at editorial default
 * - deep: full tabs + extended metadata and interpretive layers surfaced
 */
export type ContentDepth = 'quick' | 'standard' | 'deep'

export type TeacherGuideState = {
  /** Session learning objective shown to the class. */
  learningObjective: string
  /** Discussion prompt for the current stop. */
  discussionPrompt: string
  /** Optional anchor entity for the lesson (place / event). */
  anchorEntityId: string | null
  /** Optional time focus for the lesson. */
  anchorYear: number | null
  /** Step index within an optional guided pathway (0-based). */
  pathwayStepIndex: number
  /** Total steps when using a pathway preset (0 = no preset). */
  pathwayTotalSteps: number
}
