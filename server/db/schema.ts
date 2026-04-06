import { jsonb, pgTable, text } from 'drizzle-orm/pg-core'

export const entitiesTable = pgTable('entities', {
  id: text('id').primaryKey(),
  payload: jsonb('payload').notNull().$type<Record<string, unknown>>(),
})
