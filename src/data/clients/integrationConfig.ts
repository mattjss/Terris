/**
 * Feature flags for live (network) data integrations.
 *
 * Defaults are **false** so builds and first-run work without external services.
 * Enable per-integration in `.env`:
 *
 *   VITE_WIKIPEDIA_LIVE=true
 *   VITE_WIKIMEDIA_COMMONS_LIVE=true
 *   VITE_IIIF_LIVE=true
 *   VITE_WIKIDATA_LIVE=true
 *   VITE_NATURAL_EARTH_LIVE=true
 *   VITE_HISTORICAL_GEOJSON_LIVE=true
 *   VITE_ENRICHMENT_LIVE=true
 *
 * All sources listed here are **free**; no Mapbox, Cesium ion, or paid APIs.
 */
export const integrationFlags = {
  /**
   * Orchestrated Wikidata + Wikipedia extracts + SPARQL for editorial entity dossiers.
   * Requires `VITE_WIKIDATA_LIVE` (and usually `VITE_WIKIPEDIA_LIVE`) for meaningful output.
   */
  enrichmentLive: import.meta.env.VITE_ENRICHMENT_LIVE === 'true',
  wikipediaLive: import.meta.env.VITE_WIKIPEDIA_LIVE === 'true',
  /** Commons `imageinfo` + search — defaults off like other live integrations. */
  wikimediaCommonsLive: import.meta.env.VITE_WIKIMEDIA_COMMONS_LIVE === 'true',
  /** Fetch and parse IIIF Presentation manifests in the browser. */
  iiifLive: import.meta.env.VITE_IIIF_LIVE === 'true',
  wikidataLive: import.meta.env.VITE_WIKIDATA_LIVE === 'true',
  /** Wikidata Query Service SPARQL (`query.wikidata.org`). */
  wikidataSparqlLive: import.meta.env.VITE_WIKIDATA_SPARQL_LIVE === 'true',
  /** Mapillary Graph API — placeholder until keys and scopes are configured. */
  mapillaryLive: import.meta.env.VITE_MAPILLARY_LIVE === 'true',
  naturalEarthLive: import.meta.env.VITE_NATURAL_EARTH_LIVE === 'true',
  historicalGeojsonLive: import.meta.env.VITE_HISTORICAL_GEOJSON_LIVE === 'true',
} as const
