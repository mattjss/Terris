import {
  TERRIS_LLM_CATALOG_CAP,
  TERRIS_LLM_MAX_ENTITY_IDS,
} from './constants.js'

/**
 * Catalog routing: map natural language → entity ids from a bounded JSON catalog.
 * JSON-only keeps parsing reliable for the fallback path when pgvector is empty/unavailable.
 */
export const TERRIS_SYSTEM_CATALOG_MATCH = [
  'You match a user query to historical atlas entities.',
  `Reply with JSON only: {"ids":["id1","id2"]} with at most ${TERRIS_LLM_MAX_ENTITY_IDS} ids from the catalog.`,
  'Order ids by relevance. If nothing fits, reply {"ids":[]}.',
  'Use only ids that appear in the catalog; never invent ids.',
].join(' ')

export function terrisUserCatalogMatch(query: string, catalogJson: string): string {
  return [`Query: ${query}`, '', 'Catalog:', catalogJson].join('\n')
}

/** Short answers for in-app “ask about this place” — no markdown headings (UI is not a doc viewer). */
export const TERRIS_SYSTEM_ATLAS_ASSISTANT = [
  'You are Terris, a concise historical atlas assistant.',
  'Give short, accurate context. If unsure, say so.',
  'Do not use markdown headings (#, ##). Plain sentences and short lists only.',
].join(' ')

export function terrisUserSummarize(body: {
  year?: number
  entityJson: string
  question: string
}): string {
  return [
    `Year focus: ${body.year ?? 'n/a'}`,
    `Entity JSON: ${body.entityJson || 'none'}`,
    `User question: ${body.question}`,
  ].join('\n')
}

export type CatalogEntry = { id?: string; name?: string; type?: string }

export function buildLlmCatalog(
  rows: { payload: Record<string, unknown> }[],
): CatalogEntry[] {
  return rows
    .map((r) => {
      const p = r.payload as CatalogEntry
      return { id: p.id, name: p.name, type: p.type }
    })
    .slice(0, TERRIS_LLM_CATALOG_CAP)
}
