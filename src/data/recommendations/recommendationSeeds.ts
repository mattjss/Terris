import type { RecommendationCategory, TerrisRecommendation } from '@/data/recommendations/recommendationTypes'

type Seed = Omit<TerrisRecommendation, 'id'> & { id?: string }

/**
 * Editorial, explainable rules for specific hubs — layered under graph-based rules in the engine.
 * Keys are source entity ids.
 */
export const RECOMMENDATION_SEEDS: Record<string, Seed[]> = {
  'terris-hub-boston': [
    {
      title: 'Boston Tea Party',
      entityId: 'terris-event-tea-party',
      reason: 'Harbor politics connects to the city’s Revolutionary arc — good follow-up after the overview.',
      category: 'continue_story',
      priority: 82,
      mode: 'earth',
      year: 1773,
    },
    {
      title: 'Silk Road (Afro-Eurasian exchange)',
      entityId: 'terris-empire-silk-road',
      reason: 'Step outward from one port city to long-distance networks — useful contrast to local scale.',
      category: 'go_broader',
      priority: 58,
      mode: 'earth',
      year: 200,
    },
  ],
  'terris-venue-fenway': [
    {
      title: 'Boston',
      entityId: 'terris-hub-boston',
      reason: 'See the ballpark as one layer in a larger civic and coastal story.',
      category: 'go_broader',
      priority: 72,
      mode: 'earth',
      year: 1912,
    },
    {
      title: 'Boston Tea Party',
      entityId: 'terris-event-tea-party',
      reason: 'Pair modern ritual (the ballpark) with an earlier civic drama in the same harbor city.',
      category: 'continue_story',
      priority: 68,
      mode: 'earth',
      year: 1773,
    },
  ],
  'terris-place-rome': [
    {
      title: 'Silk Road',
      entityId: 'terris-empire-silk-road',
      reason: 'Rome often sat at the western end of luxury trade routes — a geographic contrast to the Forum.',
      category: 'go_broader',
      priority: 62,
      mode: 'earth',
      year: 120,
    },
    {
      title: 'Mars',
      entityId: 'terris-planet-mars',
      reason: 'From ancient stone cities to planetary geology — change scale on purpose when learners are ready.',
      category: 'go_broader',
      priority: 48,
      mode: 'planetary',
    },
  ],
  'terris-planet-mars': [
    {
      title: 'Europa',
      entityId: 'terris-moon-europa',
      reason: 'Compare dry desert geology to an ice moon — both reshape how we ask “where could life be?”',
      category: 'go_deeper',
      priority: 76,
      mode: 'planetary',
    },
    {
      title: 'Milky Way',
      entityId: 'terris-galaxy-milky-way',
      reason: 'Pull back to the galaxy that holds the Sun — useful after focusing on one planet.',
      category: 'go_broader',
      priority: 64,
      mode: 'cosmic',
    },
    {
      title: 'Voyager 1',
      entityId: 'terris-spacecraft-voyager1',
      reason: 'Robotic missions show how thin bridges are between worlds — engineering as narrative.',
      category: 'similar_discoveries',
      priority: 70,
      mode: 'planetary',
    },
  ],
  'terris-galaxy-milky-way': [
    {
      title: 'Andromeda Galaxy',
      entityId: 'terris-galaxy-andromeda',
      reason: 'The nearest large spiral — a natural pair for thinking about scale and future merger.',
      category: 'go_deeper',
      priority: 78,
      mode: 'cosmic',
    },
    {
      title: 'Voyager 1',
      entityId: 'terris-spacecraft-voyager1',
      reason: 'A human-made object that left the planetary neighborhood — bridges stars and craft.',
      category: 'similar_discoveries',
      priority: 60,
      mode: 'planetary',
    },
  ],
}

function seedId(sourceId: string, category: RecommendationCategory, targetId: string): string {
  return `seed-${sourceId}-${category}-${targetId}`
}

/** Normalize seeds to full recommendations with stable ids */
export function expandSeedsForEntity(sourceEntityId: string): TerrisRecommendation[] {
  const raw = RECOMMENDATION_SEEDS[sourceEntityId]
  if (!raw) return []
  return raw.map((s) => ({
    ...s,
    id: s.id ?? seedId(sourceEntityId, s.category, s.entityId),
  }))
}
