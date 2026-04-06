/**
 * Terris data clients — Wikipedia REST, Wikidata (Action + Wikibase REST + SPARQL), Mapillary placeholder,
 * Natural Earth, optional historical GeoJSON.
 *
 * Defaults are **mock** until `VITE_*_LIVE=true` in `.env`. Mapillary requires a future token strategy.
 */
export { integrationFlags } from './integrationConfig'
export { HttpError, fetchJson, withQuery } from './fetchHelpers'

export { getWikipediaSummary, searchWikipedia } from './wikipediaRestClient'
export {
  searchWikidataEntities,
  getWikidataEntities,
  getWikidataItemWikibaseRest,
} from './wikidataRestClient'
export { queryWikidataSparql } from './wikidataSparqlClient'
export {
  fetchMapillaryImagesInBBox,
  type MapillaryBBox,
  type MapillaryImageStub,
  type MapillaryStubResponse,
} from './mapillaryClient'

export { loadNaturalEarthLayer } from './naturalEarthClient'
export {
  loadHistoricalOverlay,
  EXAMPLE_HISTORICAL_OVERLAYS,
} from './historicalGeojsonClient'

/** Placeholder ingestion — replace with live API calls when credentials and quotas are ready. */
export {
  fetchWikipediaLeadImagePlaceholder,
  type WikipediaLeadImageRequest,
} from './wikipediaLeadImageClient'
export {
  fetchCommonsImagesPlaceholder,
  type CommonsImageQuery,
} from './wikimediaCommonsClient'
export {
  fetchIiifManifestPlaceholder,
  fetchIiifImageInfoPlaceholder,
  type IiifManifestRef,
} from './iiifClient'
export {
  requestAiReconstructionPlaceholder,
  type AiReconstructionRequest,
} from './aiReconstructionClient'
export {
  requestAiShortVideoPlaceholder,
  type AiShortVideoRequest,
} from './aiShortVideoClient'
