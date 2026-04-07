import type { FastifyInstance } from 'fastify'
import OpenAI from 'openai'
import { eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { entitiesTable } from '../db/schema.js'
import { runAiEntitySearch } from '../ai/searchService.js'
import { runAtlasSummarize } from '../ai/summarizeService.js'

export function registerRoutes(fastify: FastifyInstance): void {
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
        return await runAiEntitySearch(openai, q, (e, msg) =>
          fastify.log.warn(e, msg),
        )
      } catch (e) {
        fastify.log.error(e)
        return reply.code(500).send({ error: 'AI search failed' })
      }
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
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

      try {
        return await runAtlasSummarize(openai, req.body ?? {})
      } catch (e) {
        fastify.log.error(e)
        return reply.code(500).send({ error: 'Summarize failed' })
      }
    },
  )
}
