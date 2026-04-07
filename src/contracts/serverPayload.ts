/**
 * Shapes returned by the Terris Fastify API (`/entities`, `/search`, `/ai/search`).
 * Rows are `jsonb` in Postgres; seed data matches `HistoricalEntity` but the wire type is open.
 */
export type EntityJsonPayload = Record<string, unknown> & {
  id?: string
  name?: string
  type?: string
  description?: string
}

export type AiSearchResponse = {
  results: EntityJsonPayload[]
  method: 'vector' | 'llm'
}

export type AiSummarizeResponse = {
  text: string
  disclaimer: string
}
