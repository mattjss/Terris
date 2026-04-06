/**
 * Wikidata Query Service — SPARQL JSON response (`format=json`).
 * https://www.wikidata.org/wiki/Wikidata:SPARQL_query_service
 */

export type SparqlBindingValue = {
  type: string
  value: string
  datatype?: string
  'xml:lang'?: string
}

export type SparqlBinding = Record<string, SparqlBindingValue>

export type SparqlResults = {
  head: { vars: string[] }
  results: {
    bindings: SparqlBinding[]
  }
}
