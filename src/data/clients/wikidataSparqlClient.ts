/**
 * Wikidata Query Service — SPARQL endpoint (public, no API key).
 * POST or GET `https://query.wikidata.org/sparql` with `format=json`.
 *
 * Use for graph traversals, batch coordinate lookups, and “related entity” discovery.
 * Enable live queries via `VITE_WIKIDATA_SPARQL_LIVE=true`.
 */
import type { SparqlResults } from '@/data/types/sparql'
import { integrationFlags } from './integrationConfig'
import { fetchJson, withQuery } from './fetchHelpers'

const SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql'

const MOCK_SPARQL: SparqlResults = {
  head: { vars: ['item', 'itemLabel'] },
  results: {
    bindings: [
      {
        item: { type: 'uri', value: 'http://www.wikidata.org/entity/Q100' },
        itemLabel: { type: 'literal', value: 'Boston', 'xml:lang': 'en' },
      },
    ],
  },
}

async function querySparqlLive(query: string): Promise<SparqlResults> {
  const url = withQuery(SPARQL_ENDPOINT, {
    query,
    format: 'json',
  })
  return fetchJson<SparqlResults>(url)
}

/**
 * Run a SPARQL query and return JSON bindings.
 * Keep queries parameterized server-side in production to avoid injection; here the caller owns the string.
 */
export async function queryWikidataSparql(sparql: string): Promise<SparqlResults> {
  if (!integrationFlags.wikidataSparqlLive) {
    return MOCK_SPARQL
  }
  return querySparqlLive(sparql)
}
