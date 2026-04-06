/**
 * Placeholder: Wikipedia pageimages / REST helpers for lead image beyond summary thumbnail.
 * Wire to `action=query&prop=pageimages` or REST page media when `VITE_WIKIPEDIA_LIVE=true`.
 */
import type { TerrisMediaItem } from '@/data/types/terrisEntity'

export type WikipediaLeadImageRequest = {
  title: string
  width?: number
}

/** Returns null until implemented — use `mergeWikipediaSummaryIntoTerrisEntity` thumb meanwhile. */
export async function fetchWikipediaLeadImagePlaceholder(
  _req: WikipediaLeadImageRequest,
): Promise<TerrisMediaItem | null> {
  return null
}
