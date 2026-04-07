import type OpenAI from 'openai'
import { eq } from 'drizzle-orm'
import { db, pg } from '../db/index.js'
import { entitiesTable } from '../db/schema.js'
import {
  TERRIS_CHAT_MODEL,
  TERRIS_EMBEDDING_DIMENSIONS,
  TERRIS_EMBEDDING_MODEL,
  TERRIS_MAX_EMBED_INPUT_CHARS,
  TERRIS_VECTOR_SEARCH_LIMIT,
} from './constants.js'
import {
  TERRIS_SYSTEM_CATALOG_MATCH,
  buildLlmCatalog,
  terrisUserCatalogMatch,
} from './prompts.js'

export type AiSearchMethod = 'vector' | 'llm'

export type AiSearchResult = {
  results: Record<string, unknown>[]
  method: AiSearchMethod
}

/**
 * pgvector similarity search. `vec` must be a numeric embedding from our own model call — never from user text.
 */
async function searchByEmbedding(
  vec: number[],
): Promise<{ id: string; payload: Record<string, unknown> }[]> {
  const literal = `[${vec.join(',')}]`
  const rows = await pg`
    SELECT id, payload
    FROM entities
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> ${literal}::vector
    LIMIT ${TERRIS_VECTOR_SEARCH_LIMIT}
  `
  return rows as { id: string; payload: Record<string, unknown> }[]
}

async function searchByLlm(
  openai: OpenAI,
  q: string,
): Promise<Record<string, unknown>[]> {
  const rows = await db.select().from(entitiesTable)
  const catalog = buildLlmCatalog(rows)
  const completion = await openai.chat.completions.create({
    model: TERRIS_CHAT_MODEL,
    temperature: 0.1,
    messages: [
      { role: 'system', content: TERRIS_SYSTEM_CATALOG_MATCH },
      {
        role: 'user',
        content: terrisUserCatalogMatch(q, JSON.stringify(catalog)),
      },
    ],
    response_format: { type: 'json_object' },
  })

  const text = completion.choices[0]?.message?.content ?? '{"ids":[]}'
  const parsed = JSON.parse(text) as { ids?: string[] }
  const ids = parsed.ids ?? []
  const payloads: Record<string, unknown>[] = []
  for (const id of ids) {
    const row = await db
      .select()
      .from(entitiesTable)
      .where(eq(entitiesTable.id, id))
      .limit(1)
    if (row[0]) payloads.push(row[0].payload as Record<string, unknown>)
  }
  return payloads
}

/**
 * Hybrid search: embedding + pgvector when available; LLM id-pick over a capped catalog as fallback.
 */
export async function runAiEntitySearch(
  openai: OpenAI,
  q: string,
  logWarn: (err: unknown, msg: string) => void,
): Promise<AiSearchResult> {
  const embRes = await openai.embeddings.create({
    model: TERRIS_EMBEDDING_MODEL,
    input: q.slice(0, TERRIS_MAX_EMBED_INPUT_CHARS),
  })
  const vec = embRes.data[0]?.embedding
  if (!vec || vec.length !== TERRIS_EMBEDDING_DIMENSIONS) {
    throw new Error('Invalid embedding dimensions')
  }

  try {
    const rows = await searchByEmbedding(vec)
    if (rows.length > 0) {
      return {
        results: rows.map((r) => r.payload),
        method: 'vector',
      }
    }
  } catch (e) {
    logWarn(e, 'vector search failed, falling back to LLM')
  }

  const results = await searchByLlm(openai, q)
  return { results, method: 'llm' }
}
