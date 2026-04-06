/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  /** Enable live Wikipedia REST + Action API (`wikipediaRestClient`, `wikipediaClient`). */
  readonly VITE_WIKIPEDIA_LIVE?: string
  /** Wikimedia Commons `imageinfo` / search for P18 and standalone queries. */
  readonly VITE_WIKIMEDIA_COMMONS_LIVE?: string
  /** Fetch IIIF Presentation manifests (browser; host must allow CORS). */
  readonly VITE_IIIF_LIVE?: string
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
  /** Wikidata + Wikipedia + SPARQL enrichment pipeline for mock/editorial entities. */
  readonly VITE_ENRICHMENT_LIVE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
