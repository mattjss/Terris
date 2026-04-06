/**
 * Free / open-data sources planned for Terris (Three.js globe + API).
 * No commercial map tile providers — geometry and labels come from public datasets
 * (Natural Earth GeoJSON, Wikidata, Wikipedia excerpts, OSM-derived extracts, etc.).
 *
 * Server-side ingestion and client hooks should attach provenance matching
 * `UpstreamSource` in `@/contracts/terris-api`.
 */

export const OPEN_DATA_REGISTRY = {
  naturalEarth: {
    id: 'natural-earth' as const,
    label: 'Natural Earth',
    format: 'geojson' as const,
    note: 'Admin boundaries, coastlines, cultural vectors (local or cached GeoJSON).',
  },
  wikidata: {
    id: 'wikidata' as const,
    label: 'Wikidata',
    format: 'sparql' as const,
    note: 'Entity IDs, coordinates, labels, time-bounded statements.',
  },
  wikipedia: {
    id: 'wikipedia' as const,
    label: 'Wikipedia',
    format: 'rest' as const,
    note: 'Summaries and canonical URLs (e.g. REST API / cached).',
  },
  openStreetMap: {
    id: 'openstreetmap' as const,
    label: 'OpenStreetMap (derived)',
    format: 'geojson' as const,
    note: 'Planet extracts / Overpass-style GeoJSON — respect license & attribution.',
  },
} as const
