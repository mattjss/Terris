/**
 * Wikipedia lead image via `prop=pageimages` — higher-resolution alternative to REST summary thumbnail alone.
 */
import type { TerrisMediaItem } from '@/data/types/terrisEntity'
import { fetchWikipediaPageImagesAsTerrisMedia } from './wikipediaClient'

export type WikipediaLeadImageRequest = {
  title: string
  width?: number
}

/**
 * Returns the representative page image when live Wikipedia mode is enabled; otherwise null.
 */
export async function fetchWikipediaLeadImage(
  req: WikipediaLeadImageRequest,
): Promise<TerrisMediaItem | null> {
  const items = await fetchWikipediaPageImagesAsTerrisMedia(
    req.title,
    `wp-lead-${req.title.replace(/[^\w-]+/g, '_').slice(0, 48)}`,
    { thumbSize: req.width ?? 1280 },
  )
  return items[0] ?? null
}

/** @deprecated Use `fetchWikipediaLeadImage` */
export async function fetchWikipediaLeadImagePlaceholder(
  req: WikipediaLeadImageRequest,
): Promise<TerrisMediaItem | null> {
  return fetchWikipediaLeadImage(req)
}
