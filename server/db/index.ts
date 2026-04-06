import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema.js'

const url =
  process.env.DATABASE_URL ?? 'postgres://terris:terris@127.0.0.1:5432/terris'

export const pg = postgres(url, { max: 10 })
export const db = drizzle(pg, { schema })
