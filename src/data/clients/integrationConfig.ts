/**
 * Feature flags for live (network) data integrations.
 *
 * Defaults are **false** so builds and first-run work without external services.
 * Enable per-integration in `.env`:
 *
 *   VITE_WIKIPEDIA_LIVE=true
 *   VITE_WIKIDATA_LIVE=true
 *   VITE_NATURAL_EARTH_LIVE=true
 *   VITE_HISTORICAL_GEOJSON_LIVE=true
 *
 * All sources listed here are **free**; no Mapbox, Cesium ion, or paid APIs.
 */
export const integrationFlags = {
  wikipediaLive: import.meta.env.VITE_WIKIPEDIA_LIVE === 'true',
  wikidataLive: import.meta.env.VITE_WIKIDATA_LIVE === 'true',
  /** Wikidata Query Service SPARQL (`query.wikidata.org`). */
  wikidataSparqlLive: import.meta.env.VITE_WIKIDATA_SPARQL_LIVE === 'true',
  /** Mapillary Graph API — placeholder until keys and scopes are configured. */
  mapillaryLive: import.meta.env.VITE_MAPILLARY_LIVE === 'true',
  naturalEarthLive: import.meta.env.VITE_NATURAL_EARTH_LIVE === 'true',
  historicalGeojsonLive: import.meta.env.VITE_HISTORICAL_GEOJSON_LIVE === 'true',
} as const
