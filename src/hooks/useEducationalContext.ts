import { useMemo } from 'react'
import { CONTEXT_MODE_PROFILES, resolvePlaceSheetTabs } from '@/config/contextModeConfig'
import { useTerrisStore } from '@/state/useTerrisStore'
import type { PlaceSheetTabId } from '@/ui/placeSheetTypes'

/**
 * Derives presentation flags from context mode + content depth (single shell, adaptive chrome).
 */
export function useEducationalContext() {
  const contextMode = useTerrisStore((s) => s.contextMode)
  const contentDepth = useTerrisStore((s) => s.contentDepth)
  const readingLevel = useTerrisStore((s) => s.readingLevel)
  const lockedNavigation = useTerrisStore((s) => s.lockedNavigation)

  const profile = CONTEXT_MODE_PROFILES[contextMode]

  const visiblePlaceSheetTabs: PlaceSheetTabId[] = useMemo(
    () => resolvePlaceSheetTabs(contextMode, contentDepth),
    [contextMode, contentDepth],
  )

  const metadataCompact =
    profile.metadataCompact && contentDepth !== 'deep'

  const overviewShowsFullStory = contentDepth !== 'quick'

  return {
    contextMode,
    contentDepth,
    readingLevel,
    lockedNavigation,
    profile,
    visiblePlaceSheetTabs,
    metadataCompact,
    overviewShowsFullStory,
  }
}
