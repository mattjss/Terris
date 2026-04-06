/**
 * Placeholder: Wikimedia Commons search, file metadata, structured data for thumbnails and licenses.
 * Future: `api.php?action=query&list=search` + `extmetadata` for credit/license normalization.
 */
import type { TerrisMediaItem } from '@/data/types/terrisEntity'

export type CommonsImageQuery = {
  search: string
  limit?: number
}

export async function fetchCommonsImagesPlaceholder(
  _q: CommonsImageQuery,
): Promise<TerrisMediaItem[]> {
  return []
}
