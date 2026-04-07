/** OpenAI model ids — single place to swap versions. */
export const TERRIS_EMBEDDING_MODEL = 'text-embedding-3-small' as const
export const TERRIS_CHAT_MODEL = 'gpt-4o-mini' as const

export const TERRIS_EMBEDDING_DIMENSIONS = 1536

/** Input caps */
export const TERRIS_MAX_EMBED_INPUT_CHARS = 8000
export const TERRIS_VECTOR_SEARCH_LIMIT = 15
export const TERRIS_LLM_CATALOG_CAP = 120
export const TERRIS_LLM_MAX_ENTITY_IDS = 8
