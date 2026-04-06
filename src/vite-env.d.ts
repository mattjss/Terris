/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  /** Enable live Wikipedia REST + Action API (see `src/data/clients/wikipediaRestClient.ts`). */
  readonly VITE_WIKIPEDIA_LIVE?: string
  /** Enable live Wikidata `w/api.php` calls. */
  readonly VITE_WIKIDATA_LIVE?: string
  /** Enable live Wikidata Query Service SPARQL (`query.wikidata.org`). */
  readonly VITE_WIKIDATA_SPARQL_LIVE?: string
  /** Reserved — Mapillary Graph API when token flow exists. */
  readonly VITE_MAPILLARY_LIVE?: string
  /** Fetch Natural Earth GeoJSON from network instead of mock polygons. */
  readonly VITE_NATURAL_EARTH_LIVE?: string
  /** Load historical overlay URLs from `geojsonUrl` instead of placeholder geometry. */
  readonly VITE_HISTORICAL_GEOJSON_LIVE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
