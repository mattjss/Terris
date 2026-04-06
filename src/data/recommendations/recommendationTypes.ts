import type { ExplorerMode } from '@/data/types/terrisEntity'

/** Grouped sections in the entity sheet / guided UI */
export type RecommendationCategory =
  | 'next_in_pathway'
  | 'continue_story'
  | 'nearby'
  | 'related_people'
  | 'related_events'
  | 'similar_discoveries'
  | 'go_deeper'
  | 'go_broader'

export type TerrisRecommendation = {
  id: string
  title: string
  entityId: string
  /** Short, explainable “why” — museum-guide tone */
  reason: string
  category: RecommendationCategory
  /** Higher = surfaced first; ties broken by category order */
  priority: number
  mode: ExplorerMode
  /** Optional timeline nudge when opening the target */
  year?: number
  /** When suggested as part of a guided journey */
  pathwayId?: string
}

export type RecommendationSection = {
  category: RecommendationCategory
  /** Human-readable section heading */
  label: string
  items: TerrisRecommendation[]
}

export type RecommendationContext = {
  entity: { id: string }
  guidedPathwayId: string | null
  guidedStepIndex: number
}
