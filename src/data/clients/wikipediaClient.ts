/**
 * English Wikipedia — REST summaries + MediaWiki Action API page images, normalized to Terris media.
 * Read-only, no API key. Enable via `VITE_WIKIPEDIA_LIVE=true`.
 */
import type { WikipediaPageSummary, WikipediaPageImagesQueryResponse } from '@/data/types/wikipedia'
import type { TerrisMediaItem } from '@/data/types/terrisEntity'
import { integrationFlags } from './integrationConfig'
import { fetchJson, withQuery } from './fetchHelpers'
import { getWikipediaSummary, searchWikipedia } from './wikipediaRestClient'

const ACTION_BASE = 'https://en.wikipedia.org/w/api.php'

export { getWikipediaSummary, searchWikipedia }

/** Same as `getWikipediaSummary` — explicit name for media pipelines. */
export async function fetchWikipediaPageSummary(title: string): Promise<WikipediaPageSummary> {
  return getWikipediaSummary(title)
}

/**
 * First matching article title from `list=search` (namespace 0), or null.
 */
export async function resolveWikipediaTitleFromSearch(query: string): Promise<string | null> {
  const res = await searchWikipedia(query.trim())
  const first = res.query?.search?.[0]?.title
  return first ?? null
}

function slugIdPart(title: string): string {
  return title.replace(/[^\w-]+/g, '_').slice(0, 80)
}

/**
 * REST summary `thumbnail` → Terris media (used when Action API pageimages is unavailable).
 */
export function wikipediaSummaryThumbnailToTerrisMedia(
  summary: WikipediaPageSummary,
  entityId: string,
): TerrisMediaItem | null {
  const th = summary.thumbnail
  if (!th?.source) return null
  const display = summary.displaytitle || summary.title
  return {
    id: `${entityId}-wp-thumb`,
    type: 'image',
    title: display,
    sourceName: 'Wikipedia (REST summary)',
    url: th.source,
    thumbnailUrl: th.source,
    caption: summary.extract?.trim().slice(0, 280) ?? 'Lead image from Wikipedia.',
    credit: 'Wikimedia / Wikipedia contributors',
    license: undefined,
    isInterpretive: false,
  }
}

type PageImageRow = {
  pageid?: number
  title?: string
  missing?: string
  thumbnail?: { source: string; width: number; height: number }
  pageimage?: string
}

function pageImageQueryToTerrisItem(
  page: PageImageRow,
  entityId: string,
  titleHint: string,
): TerrisMediaItem | null {
  const th = page.thumbnail
  if (!th?.source) return null
  const label = page.title ?? titleHint
  return {
    id: `${entityId}-wp-pageimage-${slugIdPart(label)}`,
    type: 'image',
    title: label.replace(/_/g, ' '),
    sourceName: 'Wikipedia (pageimages)',
    url: th.source,
    thumbnailUrl: th.source,
    caption: page.pageimage
      ? `Representative image: ${page.pageimage.replace(/_/g, ' ')}`
      : 'Lead image from Wikipedia.',
    credit: 'Wikimedia / Wikipedia contributors',
    license: undefined,
    isInterpretive: false,
  }
}

export type FetchWikipediaPageImagesOptions = {
  /** Requested max width for `pithumbsize` (default 1280). */
  thumbSize?: number
}

/**
 * Fetches `prop=pageimages` for a **canonical article title** (underscores ok).
 * Returns one item when the page has a representative image.
 */
export async function fetchWikipediaPageImagesAsTerrisMedia(
  articleTitle: string,
  entityId: string,
  options?: FetchWikipediaPageImagesOptions,
): Promise<TerrisMediaItem[]> {
  if (!integrationFlags.wikipediaLive) return []

  const enc = articleTitle.replace(/ /g, '_')
  const url = withQuery(ACTION_BASE, {
    action: 'query',
    format: 'json',
    titles: enc,
    prop: 'pageimages',
    piprop: 'thumbnail|name',
    pithumbsize: options?.thumbSize ?? 1280,
  })

  const data = await fetchJson<WikipediaPageImagesQueryResponse>(url)
  const pages = data.query?.pages
  if (!pages) return []

  const out: TerrisMediaItem[] = []
  for (const p of Object.values(pages)) {
    if (!p || p.missing) continue
    const item = pageImageQueryToTerrisItem(p, entityId, articleTitle)
    if (item) out.push(item)
  }
  return out
}

/**
 * Summary extract + best available lead image (prefers `pageimages` over REST thumbnail alone).
 */
export async function fetchWikipediaSummaryAndLeadMedia(
  articleTitle: string,
  entityId: string,
): Promise<{ summary: WikipediaPageSummary; media: TerrisMediaItem[] }> {
  const summary = await fetchWikipediaPageSummary(articleTitle)
  const fromPage = await fetchWikipediaPageImagesAsTerrisMedia(articleTitle, entityId)
  if (fromPage.length > 0) {
    return { summary, media: fromPage }
  }
  const fromRest = wikipediaSummaryThumbnailToTerrisMedia(summary, entityId)
  return { summary, media: fromRest ? [fromRest] : [] }
}
