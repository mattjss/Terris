/**
 * Entity hydration — chooses mock catalog, then Wikidata + Wikipedia, with Mapillary hooks later.
 */
import {
  mergeWikipediaSummaryIntoTerrisEntity,
  wikidataStubToTerrisEntity,
} from '@/data/adapters'
import { getWikidataEntities } from '@/data/clients/wikidataRestClient'
import { getWikipediaSummary } from '@/data/clients/wikipediaRestClient'
import type { TerrisEntity } from '@/data/types/terrisEntity'
import { TERRIS_ENTITY_BOSTON } from '@/data/mock/bostonEntityHub'
import { UNIFIED_MOCK_ENTITY_CATALOG } from '@/data/mock/unifiedCatalog'

export const MOCK_ENTITY_CATALOG: Record<string, TerrisEntity> =
  UNIFIED_MOCK_ENTITY_CATALOG

export function getMockEntityById(id: string): TerrisEntity | undefined {
  return MOCK_ENTITY_CATALOG[id]
}

export function getBostonExampleHub(): TerrisEntity {
  return TERRIS_ENTITY_BOSTON
}

export function listMockEntityIds(): string[] {
  return Object.keys(MOCK_ENTITY_CATALOG)
}

/**
 * Resolve an entity: Terris editorial ids hit the mock catalog first; `Q…` ids fetch Wikidata/Wikipedia.
 */
export async function hydrateTerrisEntity(id: string): Promise<TerrisEntity> {
  const mock = MOCK_ENTITY_CATALOG[id]
  if (mock) return mock
  if (id.startsWith('Q')) return fetchTerrisEntityFromWikidata(id)
  throw new Error(`Unknown entity id (no mock, not a Wikidata Q-id): ${id}`)
}

/**
 * Live path: `wbgetentities` → adapter → optional Wikipedia summary via `sitelinks.enwiki`.
 */
export async function fetchTerrisEntityFromWikidata(qid: string): Promise<TerrisEntity> {
  const res = await getWikidataEntities([qid])
  const stub = res.entities?.[qid]
  if (!stub) {
    throw new Error(`Wikidata returned no entity for ${qid}`)
  }
  let entity = wikidataStubToTerrisEntity(stub)
  const title = stub.sitelinks?.enwiki?.title
  if (title) {
    const summary = await getWikipediaSummary(title)
    entity = mergeWikipediaSummaryIntoTerrisEntity(entity, summary)
  }
  return entity
}

export { BOSTON_HUB_ID } from '@/data/mock/bostonEntityHub'
