/**
 * English Wikipedia — Action API `prop=extracts` for longer plain-text bodies than REST `/page/summary`.
 * Complements `wikipediaRestClient` and `wikipediaClient` lead media.
 */
import { integrationFlags } from './integrationConfig'
import { fetchJson, withQuery } from './fetchHelpers'

const ACTION = 'https://en.wikipedia.org/w/api.php'

type ExtractsQueryResponse = {
  query?: {
    pages?: Record<
      string,
      {
        pageid?: number
        title?: string
        missing?: boolean
        extract?: string
      }
    >
  }
}

/**
 * First section intro only — fast, stable length (~1–3 paragraphs).
 */
export async function fetchWikipediaExtractIntroPlain(title: string): Promise<string | null> {
  if (!integrationFlags.wikipediaLive) return null
  const enc = title.replace(/ /g, '_')
  const url = withQuery(ACTION, {
    action: 'query',
    format: 'json',
    titles: enc,
    prop: 'extracts',
    explaintext: '1',
    exintro: '1',
  })
  const data = await fetchJson<ExtractsQueryResponse>(url)
  const pages = data.query?.pages
  if (!pages) return null
  const p = Object.values(pages)[0]
  if (!p || p.missing || !p.extract?.trim()) return null
  return p.extract.trim()
}

/**
 * Multi-section plain extract up to `maxChars` (default 12k). Falls back to intro-only on error.
 */
export async function fetchWikipediaExtractExtendedPlain(
  title: string,
  maxChars = 12000,
): Promise<string | null> {
  if (!integrationFlags.wikipediaLive) return null
  const enc = title.replace(/ /g, '_')
  const url = withQuery(ACTION, {
    action: 'query',
    format: 'json',
    titles: enc,
    prop: 'extracts',
    explaintext: '1',
    exintro: '0',
    exlimit: '1',
    exchars: String(maxChars),
  })
  const data = await fetchJson<ExtractsQueryResponse>(url)
  const pages = data.query?.pages
  if (!pages) return null
  const p = Object.values(pages)[0]
  if (!p || p.missing || !p.extract?.trim()) return null
  return p.extract.trim()
}

/**
 * Prefer extended text; if too short vs `minChars`, retry intro-only and return longer string.
 */
export async function fetchWikipediaExtractBestEffort(
  title: string,
  options?: { minChars?: number; maxChars?: number },
): Promise<string | null> {
  const minChars = options?.minChars ?? 400
  const maxChars = options?.maxChars ?? 12000
  const extended = await fetchWikipediaExtractExtendedPlain(title, maxChars)
  if (extended && extended.length >= minChars) return extended
  const intro = await fetchWikipediaExtractIntroPlain(title)
  const candidates = [extended, intro].filter(Boolean) as string[]
  if (candidates.length === 0) return null
  return candidates.reduce((a, b) => (a.length >= b.length ? a : b))
}
