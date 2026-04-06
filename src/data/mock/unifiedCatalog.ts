import type { TerrisEntity } from '@/data/types/terrisEntity'
import { MOCK_ENTITY_CATALOG as BOSTON_CATALOG } from '@/data/mock/bostonEntityHub'
import { EXPLORE_MOCK_CATALOG } from '@/data/mock/exploreMockEntities'

/** Boston editorial hubs + planetary/cosmic explore mocks. */
export const UNIFIED_MOCK_ENTITY_CATALOG: Record<string, TerrisEntity> = {
  ...BOSTON_CATALOG,
  ...EXPLORE_MOCK_CATALOG,
}
