/**
 * Wikidata — two read surfaces:
 * - **MediaWiki Action API** (`w/api.php`): `wbsearchentities`, `wbgetentities` (broad browser support).
 * - **Wikibase REST API** (`/w/rest.php/wikibase/v0/…`): item-oriented JSON (use for structured statements).
 *
 * Both are read-only and keyless for public Wikidata. Enable live fetches via `VITE_WIKIDATA_LIVE=true`.
 */
import type {
  WikidataEntityId,
  WikidataGetEntitiesResponse,
  WikidataSearchResponse,
} from '@/data/types/wikidata'
import type { WikibaseRestEntityDocument } from '@/data/types/wikibaseRest'
import { integrationFlags } from './integrationConfig'
import { fetchJson, withQuery } from './fetchHelpers'

const ACTION_API = 'https://www.wikidata.org/w/api.php'
const WIKIBASE_REST_ITEM = 'https://www.wikidata.org/w/rest.php/wikibase/v0/entities/items'

const MOCK_SEARCH: WikidataSearchResponse = {
  search: [
    {
      id: 'Q220',
      title: 'Q220',
      label: 'Rome',
      description: 'capital city of Italy',
      language: 'en',
    },
  ],
}

const MOCK_ENTITY: WikidataGetEntitiesResponse = {
  entities: {
    Q220: {
      id: 'Q220',
      type: 'item',
      labels: { en: { language: 'en', value: 'Rome' } },
      descriptions: { en: { language: 'en', value: 'capital city of Italy' } },
    },
  },
}

async function searchEntitiesLive(query: string): Promise<WikidataSearchResponse> {
  const url = withQuery(ACTION_API, {
    action: 'wbsearchentities',
    search: query,
    language: 'en',
    format: 'json',
    limit: 12,
  })
  return fetchJson<WikidataSearchResponse>(url)
}

async function getEntitiesLive(ids: WikidataEntityId[]): Promise<WikidataGetEntitiesResponse> {
  const url = withQuery(ACTION_API, {
    action: 'wbgetentities',
    ids: ids.join('|'),
    format: 'json',
    languages: 'en',
    props: 'labels|descriptions|claims|sitelinks',
  })
  return fetchJson<WikidataGetEntitiesResponse>(url)
}

async function getWikibaseItemRestLive(
  id: WikidataEntityId,
): Promise<WikibaseRestEntityDocument> {
  const url = `${WIKIBASE_REST_ITEM}/${encodeURIComponent(id)}`
  return fetchJson<WikibaseRestEntityDocument>(url)
}

const MOCK_WIKIBASE_REST: WikibaseRestEntityDocument = {
  id: 'Q220',
  type: 'item',
  labels: { en: { language: 'en', value: 'Rome' } },
  descriptions: { en: { language: 'en', value: 'capital city of Italy' } },
  statements: {},
}

export async function searchWikidataEntities(query: string): Promise<WikidataSearchResponse> {
  if (!integrationFlags.wikidataLive) {
    return MOCK_SEARCH
  }
  return searchEntitiesLive(query)
}

export async function getWikidataEntities(
  ids: WikidataEntityId[],
): Promise<WikidataGetEntitiesResponse> {
  if (!integrationFlags.wikidataLive) {
    return MOCK_ENTITY
  }
  return getEntitiesLive(ids)
}

/**
 * Wikibase REST item document (labels, descriptions, statements).
 * Prefer this when you need typed statement payloads; pair with `wikidataToTerrisEntity`.
 */
export async function getWikidataItemWikibaseRest(
  id: WikidataEntityId,
): Promise<WikibaseRestEntityDocument> {
  if (!integrationFlags.wikidataLive) {
    return { ...MOCK_WIKIBASE_REST, id }
  }
  return getWikibaseItemRestLive(id)
}
