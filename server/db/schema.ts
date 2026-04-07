import { jsonb, pgTable, text } from 'drizzle-orm/pg-core'

/**
 * `embedding vector(1536)` is added at runtime (`server/seed.ts`, migrations).
 * Kept out of Drizzle schema until drizzle-kit supports pgvector without raw SQL.
 */
export const entitiesTable = pgTable('entities', {
  id: text('id').primaryKey(),
  payload: jsonb('payload').notNull().$type<Record<string, unknown>>(),
})
