import { useMemo } from 'react'
import {
  DEFAULT_METADATA_COMPACT,
  EMPTY_PLACE_SHEET_TEASER,
  resolvePlaceSheetTabs,
} from '@/config/terrisPresentationConfig'
import { useTerrisStore } from '@/state/useTerrisStore'
import type { PlaceSheetTabId } from '@/ui/placeSheetTypes'

/**
 * Derives place-sheet tabs and density from content depth (single presentation model).
 */
export function useEducationalContext() {
  const contentDepth = useTerrisStore((s) => s.contentDepth)

  const visiblePlaceSheetTabs: PlaceSheetTabId[] = useMemo(
    () => resolvePlaceSheetTabs(contentDepth),
    [contentDepth],
  )

  const metadataCompact = DEFAULT_METADATA_COMPACT && contentDepth !== 'deep'

  const overviewShowsFullStory = contentDepth !== 'quick'

  return {
    emptyPlaceTeaser: EMPTY_PLACE_SHEET_TEASER,
    visiblePlaceSheetTabs,
    metadataCompact,
    overviewShowsFullStory,
  }
}
