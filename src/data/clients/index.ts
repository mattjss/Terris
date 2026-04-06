/**
 * Terris data clients — Wikipedia REST, Wikidata (Action + Wikibase REST + SPARQL), Mapillary placeholder,
 * Natural Earth, optional historical GeoJSON.
 *
 * Defaults are **mock** until `VITE_*_LIVE=true` in `.env`. Mapillary requires a future token strategy.
 */
export { integrationFlags } from './integrationConfig'
export { HttpError, fetchJson, withQuery } from './fetchHelpers'

export {
  getWikipediaSummary,
  searchWikipedia,
  fetchWikipediaPageSummary,
  fetchWikipediaPageImagesAsTerrisMedia,
  fetchWikipediaSummaryAndLeadMedia,
  resolveWikipediaTitleFromSearch,
  wikipediaSummaryThumbnailToTerrisMedia,
} from './wikipediaClient'
export {
  searchWikidataEntities,
  getWikidataEntities,
  getWikidataEntityForEnrichment,
  getWikidataItemWikibaseRest,
} from './wikidataRestClient'
export {
  queryWikidataSparql,
  queryVenuesLandmarksForCity,
  queryDatedEventsForPlace,
  queryPeopleBornInPlace,
  queryPartsOrLocatedIn,
  queryTimelineDatesForItem,
  queryMissionsForPlanet,
} from './wikidataSparqlClient'
export {
  fetchWikipediaExtractIntroPlain,
  fetchWikipediaExtractExtendedPlain,
  fetchWikipediaExtractBestEffort,
} from './mediawikiExtractsClient'
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

export {
  fetchWikipediaLeadImage,
  fetchWikipediaLeadImagePlaceholder,
  type WikipediaLeadImageRequest,
} from './wikipediaLeadImageClient'
export {
  fetchCommonsFileAsTerrisMedia,
  searchCommonsFileTitles,
  fetchCommonsImagesForQuery,
  commonsImageInfoToTerrisMedia,
  type CommonsImageQuery,
} from './wikimediaCommonsClient'
export {
  fetchIiifManifestTerrisMedia,
  parseIiifManifestToTerrisMedia,
  iiifLabelToString,
  fetchIiifManifestPlaceholder,
  fetchIiifImageInfoPlaceholder,
  type IiifManifestRef,
} from './iiifClient'
export {
  requestAiReconstructionPlaceholder,
  type AiReconstructionRequest,
} from './aiReconstructionClient'
export {
  INTERPRETIVE_CLIP_DURATION_SECONDS,
  buildInterpretiveVideoPlaceholder,
  interpretiveVideoMetaOrDefault,
  isInterpretiveVideoPending,
  requestInterpretiveEducationalClip,
  type InterpretiveVideoGenerationRequest,
} from './interpretiveVideoArchitecture'
export {
  requestAiShortVideoPlaceholder,
  type AiShortVideoRequest,
} from './aiShortVideoClient'
