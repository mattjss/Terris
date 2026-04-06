export type {
  RecommendationCategory,
  TerrisRecommendation,
  RecommendationSection,
  RecommendationContext,
} from '@/data/recommendations/recommendationTypes'

export {
  buildRecommendations,
  flattenRecommendations,
  RECOMMENDATION_SECTION_ORDER,
  RECOMMENDATION_SECTION_LABELS,
} from '@/data/recommendations/buildRecommendations'

export { RECOMMENDATION_SEEDS, expandSeedsForEntity } from '@/data/recommendations/recommendationSeeds'
