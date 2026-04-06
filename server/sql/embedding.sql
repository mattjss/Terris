-- Run after drizzle-kit push: adds pgvector column for semantic search
ALTER TABLE entities ADD COLUMN IF NOT EXISTS embedding vector(1536);
