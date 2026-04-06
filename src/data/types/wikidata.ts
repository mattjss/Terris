/**
 * Types for Wikidata’s MediaWiki API (`wbsearchentities`, `wbgetentities`).
 * SPARQL (`query.wikidata.org`) can be added later with separate types.
 */

/** Wikidata item/property id, e.g. `Q42`. */
export type WikidataEntityId = string

export type WikidataSearchHit = {
  id: WikidataEntityId
  title: string
  /** Often same as title for items. */
  label?: string
  description?: string
  /** Language code of the label/description above. */
  language?: string
  match?: { type: string; language: string; text: string }
}

export type WikidataSearchResponse = {
  search?: WikidataSearchHit[]
  'search-continue'?: number
  success?: number
}

/** Subset of `wbgetentities` claims — expand as Terris needs more predicates. */
export type WikidataEntityStub = {
  id: WikidataEntityId
  type?: string
  labels?: Record<string, { language: string; value: string }>
  descriptions?: Record<string, { language: string; value: string }>
  claims?: Record<string, unknown>
  /** Interwiki / Wikipedia title bridge (when requested via `props`). */
  sitelinks?: Record<string, { site: string; title: string }>
}

export type WikidataGetEntitiesResponse = {
  entities?: Record<string, WikidataEntityStub>
}
