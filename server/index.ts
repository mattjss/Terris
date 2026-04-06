import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { eq } from 'drizzle-orm'
import OpenAI from 'openai'
import { db, pg } from './db/index.js'
import { entitiesTable } from './db/schema.js'

const port = Number(process.env.PORT || 3001) || 3001

const fastify = Fastify({ logger: true })
await fastify.register(cors, { origin: true })

fastify.get('/health', async () => ({ ok: true }))

fastify.get('/entities', async (_req, reply) => {
  try {
    const rows = await db.select().from(entitiesTable)
    return rows.map((r) => r.payload)
  } catch {
    return reply.code(503).send({ error: 'Database unavailable' })
  }
})

fastify.get<{ Params: { id: string } }>(
  '/entities/:id',
  async (req, reply) => {
    try {
      const row = await db
        .select()
        .from(entitiesTable)
        .where(eq(entitiesTable.id, req.params.id))
        .limit(1)
      if (!row[0]) return reply.code(404).send({ error: 'Not found' })
      return row[0].payload
    } catch {
      return reply.code(503).send({ error: 'Database unavailable' })
    }
  },
)

fastify.get('/search', async (req, reply) => {
  const q = (req.query as { q?: string }).q?.toLowerCase().trim() ?? ''
  if (!q) return []
  try {
    const rows = await db.select().from(entitiesTable)
    const out: unknown[] = []
    for (const r of rows) {
      const p = r.payload as { name?: string; description?: string }
      const n = (p.name ?? '').toLowerCase()
      const d = (p.description ?? '').toLowerCase()
      if (n.includes(q) || d.includes(q)) out.push(r.payload)
      if (out.length >= 40) break
    }
    return out
  } catch {
    return reply.code(503).send({ error: 'Database unavailable' })
  }
})

fastify.post<{ Body: { q?: string } }>(
  '/ai/search',
  async (req, reply) => {
    const q = req.body?.q?.trim()
    if (!q) return reply.code(400).send({ error: 'Missing q' })

    if (!process.env.OPENAI_API_KEY) {
      return reply
        .code(503)
        .send({ error: 'OPENAI_API_KEY not configured on server' })
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    try {
      const embRes = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: q.slice(0, 8000),
      })
      const vec = embRes.data[0]?.embedding
      if (!vec || vec.length !== 1536) {
        throw new Error('Bad embedding')
      }
      const literal = `[${vec.join(',')}]`
      const rows = await pg.unsafe(
        `SELECT id, payload FROM entities WHERE embedding IS NOT NULL ORDER BY embedding <=> '${literal.replace(/'/g, "''")}'::vector LIMIT 15`,
      ) as { id: string; payload: Record<string, unknown> }[]
      if (rows.length > 0) {
        return { results: rows.map((r) => r.payload), method: 'vector' as const }
      }
    } catch (e) {
      fastify.log.warn(e, 'vector search failed, falling back to LLM')
    }

    const rows = await db.select().from(entitiesTable)
    const catalog = rows
      .map((r) => {
        const p = r.payload as { id?: string; name?: string; type?: string }
        return { id: p.id, name: p.name, type: p.type }
      })
      .slice(0, 120)

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.1,
      messages: [
        {
          role: 'system',
          content: `You help match a user query to historical atlas entity ids. Reply with JSON only: {"ids":["id1","id2"]} max 8 ids from the catalog. If nothing fits, {"ids":[]}.`,
        },
        {
          role: 'user',
          content: `Query: ${q}\n\nCatalog:\n${JSON.stringify(catalog)}`,
        },
      ],
      response_format: { type: 'json_object' },
    })

    const text = completion.choices[0]?.message?.content ?? '{"ids":[]}'
    const parsed = JSON.parse(text) as { ids?: string[] }
    const ids = parsed.ids ?? []
    const payloads = []
    for (const id of ids) {
      const row = await db
        .select()
        .from(entitiesTable)
        .where(eq(entitiesTable.id, id))
        .limit(1)
      if (row[0]) payloads.push(row[0].payload)
    }
    return { results: payloads, method: 'llm' as const }
  },
)

fastify.post<{ Body: { entityId?: string; year?: number; q?: string } }>(
  '/ai/summarize',
  async (req, reply) => {
    if (!process.env.OPENAI_API_KEY) {
      return reply
        .code(503)
        .send({ error: 'OPENAI_API_KEY not configured on server' })
    }
    const { entityId, year, q } = req.body ?? {}
    let context = ''
    if (entityId) {
      const row = await db
        .select()
        .from(entitiesTable)
        .where(eq(entitiesTable.id, entityId))
        .limit(1)
      if (row[0]) {
        context = JSON.stringify(row[0].payload)
      }
    }
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content:
            'You are Terris, a concise historical atlas assistant. Give short, accurate context. If unsure, say so. No markdown headings.',
        },
        {
          role: 'user',
          content: `Year focus: ${year ?? 'n/a'}\nEntity JSON: ${context || 'none'}\nUser question: ${q ?? 'Summarize this place or era.'}`,
        },
      ],
    })
    const text = completion.choices[0]?.message?.content ?? ''
    return { text, disclaimer: 'Generated — verify with sources.' }
  },
)

try {
  await fastify.listen({ port, host: '0.0.0.0' })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
