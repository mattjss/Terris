/**
 * Wikimedia Commons — Action API file metadata (`imageinfo` + `extmetadata`) normalized to Terris media.
 * Read-only, no API key. Enable via `VITE_WIKIMEDIA_COMMONS_LIVE=true`.
 */
import type { TerrisMediaItem } from '@/data/types/terrisEntity'
import { integrationFlags } from './integrationConfig'
import { fetchJson, withQuery } from './fetchHelpers'

const COMMONS_API = 'https://commons.wikimedia.org/w/api.php'

export type CommonsImageQuery = {
  search: string
  limit?: number
}

type ExtMetadataBlock = Record<string, { value?: string; source?: string } | undefined>

type CommonsImageInfoRow = {
  url?: string
  thumburl?: string
  width?: number
  height?: number
  mime?: string
  extmetadata?: ExtMetadataBlock
}

type CommonsImageInfoQueryResponse = {
  query?: {
    pages?: Record<
      string,
      {
        title?: string
        missing?: boolean
        imageinfo?: CommonsImageInfoRow[]
      }
    >
  }
}

type CommonsSearchQueryResponse = {
  query?: {
    search?: Array<{ title: string; ns: number }>
  }
}

function ensureFileTitle(title: string): string {
  const t = title.trim()
  if (t.startsWith('File:') || t.startsWith('file:')) return t
  return `File:${t}`
}

function extValue(meta: ExtMetadataBlock | undefined, key: string): string {
  const raw = meta?.[key]?.value
  return typeof raw === 'string' ? raw.trim() : ''
}

function slugPart(s: string): string {
  return s.replace(/[^\w-]+/g, '_').slice(0, 64)
}

/**
 * Turns Commons `extmetadata` + image URLs into a Terris item.
 */
export function commonsImageInfoToTerrisMedia(
  fileTitle: string,
  entityId: string,
  ii: CommonsImageInfoRow,
): TerrisMediaItem | null {
  const url = ii.url ?? ii.thumburl
  if (!url) return null

  const artist = extValue(ii.extmetadata, 'Artist')
  const credit = extValue(ii.extmetadata, 'Credit')
  const licenseShort = extValue(ii.extmetadata, 'LicenseShortName')
  const usage = extValue(ii.extmetadata, 'UsageTerms')
  const licenseUrl = extValue(ii.extmetadata, 'LicenseUrl')

  const creditLine = [artist, credit].filter(Boolean).join(' · ') || 'Wikimedia Commons contributor'
  const license = licenseShort || licenseUrl || usage || undefined

  const displayTitle = fileTitle.replace(/^File:/i, '').replace(/_/g, ' ')

  return {
    id: `${entityId}-commons-${slugPart(fileTitle)}`,
    type: 'image',
    title: displayTitle,
    sourceName: 'Wikimedia Commons',
    url,
    thumbnailUrl: ii.thumburl ?? url,
    caption: usage || `Image: ${displayTitle}`,
    credit: creditLine,
    license: license || undefined,
    isInterpretive: false,
  }
}

async function fetchCommonsImageInfoForTitle(
  fileTitle: string,
  entityId: string,
  thumbWidth: number,
): Promise<TerrisMediaItem | null> {
  const titles = ensureFileTitle(fileTitle)
  const url = withQuery(COMMONS_API, {
    action: 'query',
    format: 'json',
    titles,
    prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata',
    iiurlwidth: thumbWidth,
  })

  const data = await fetchJson<CommonsImageInfoQueryResponse>(url)
  const pages = data.query?.pages
  if (!pages) return null

  for (const p of Object.values(pages)) {
    if (!p || p.missing) continue
    const ii = p.imageinfo?.[0]
    if (!ii) continue
    return commonsImageInfoToTerrisMedia(p.title ?? titles, entityId, ii)
  }
  return null
}

/**
 * Full metadata for a single file (`File:` title or bare filename).
 */
export async function fetchCommonsFileAsTerrisMedia(
  fileTitle: string,
  entityId: string,
  options?: { thumbWidth?: number },
): Promise<TerrisMediaItem | null> {
  if (!integrationFlags.wikimediaCommonsLive) return null
  return fetchCommonsImageInfoForTitle(fileTitle, entityId, options?.thumbWidth ?? 640)
}

/**
 * `list=search` in File namespace — returns normalized titles like `File:Name.jpg`.
 */
export async function searchCommonsFileTitles(
  search: string,
  options?: { limit?: number },
): Promise<string[]> {
  if (!integrationFlags.wikimediaCommonsLive) return []
  const url = withQuery(COMMONS_API, {
    action: 'query',
    format: 'json',
    list: 'search',
    srsearch: search.trim(),
    srnamespace: 6,
    srlimit: options?.limit ?? 12,
  })
  const data = await fetchJson<CommonsSearchQueryResponse>(url)
  const rows = data.query?.search ?? []
  return rows.map((r) => r.title)
}

/**
 * Search Commons then hydrate the first N files as Terris media items.
 */
export async function fetchCommonsImagesForQuery(q: CommonsImageQuery): Promise<TerrisMediaItem[]> {
  if (!integrationFlags.wikimediaCommonsLive) return []
  const limit = Math.min(8, Math.max(1, q.limit ?? 4))
  const titles = await searchCommonsFileTitles(q.search, { limit })
  const out: TerrisMediaItem[] = []
  let i = 0
  for (const t of titles) {
    const item = await fetchCommonsFileAsTerrisMedia(t, `commons-search-${i}`, { thumbWidth: 480 })
    if (item) out.push(item)
    i += 1
    if (out.length >= limit) break
  }
  return out
}
