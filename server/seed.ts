import 'dotenv/config'
import { entities } from '../src/data/historical.ts'
import { db, pg } from './db/index.js'
import { entitiesTable } from './db/schema.js'
import { sql as drizzleSql } from 'drizzle-orm'
import OpenAI from 'openai'

async function main() {
  await db.execute(drizzleSql.raw('CREATE EXTENSION IF NOT EXISTS vector'))
  await db.execute(
    drizzleSql.raw(
      'ALTER TABLE entities ADD COLUMN IF NOT EXISTS embedding vector(1536)',
    ),
  )

  await db.delete(entitiesTable)

  const rows = entities.map((e) => ({
    id: e.id,
    payload: JSON.parse(JSON.stringify(e)) as Record<string, unknown>,
  }))

  await db.insert(entitiesTable).values(rows)

  const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null

  if (openai) {
    for (const e of entities) {
      const text = `${e.name}. ${e.description}\n${e.details?.map((d) => `${d.label}: ${d.value}`).join('\n') ?? ''}`
      const res = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text.slice(0, 8000),
      })
      const embedding = res.data[0]?.embedding
      if (embedding?.length === 1536) {
        const literal = `[${embedding.join(',')}]`
        await db.execute(
          drizzleSql.raw(
            `UPDATE entities SET embedding = '${literal.replace(/'/g, "''")}'::vector WHERE id = '${e.id.replace(/'/g, "''")}'`,
          ),
        )
      }
    }
  }

  console.log(`Seeded ${entities.length} entities`)
  await pg.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
