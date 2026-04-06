import type { ExplorerMode } from '@/data/types/terrisEntity'

/** Curated learning journey — editorial, not a rigid quiz. */
export type LearningPathwayTheme =
  | 'history'
  | 'geography'
  | 'science'
  | 'culture'
  | 'space'

export type LearningPathwayAgeRange = '8-12' | '13-17' | 'adult' | 'all'

/**
 * Optional sheet tab to open when landing on a step (overview, media, timeline, …).
 * Mirrors `PlaceSheetTabId` without importing UI from data layer.
 */
export type LearningPathwaySheetTab =
  | 'overview'
  | 'timeline'
  | 'facts'
  | 'media'
  | 'related'
  | 'nearby'
  | 'reconstruction'

export type LearningPathwayStep = {
  id: string
  title: string
  /** Mock catalog id or known Terris / Wikidata id */
  entityId: string
  mode: ExplorerMode
  /** One-line learning outcome */
  goal: string
  /** Short prompt shown in the guided dock */
  prompt: string
  /** Optional timeline anchor when the step benefits from a specific year */
  year?: number
  /** Open the place sheet to this tab when possible */
  sheetTab?: LearningPathwaySheetTab
  /** Extra hint (e.g. “skim interpretive vs documentary in Media”) */
  mediaFocus?: string
}

export type LearningPathway = {
  id: string
  title: string
  description: string
  ageRange: LearningPathwayAgeRange
  /** Primary exploration scale for the journey */
  mode: ExplorerMode
  theme: LearningPathwayTheme
  /** Human-readable, e.g. "20–30 min" */
  estimatedDuration: string
  steps: LearningPathwayStep[]
}
