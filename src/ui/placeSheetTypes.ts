import type { TerrisEntity } from '@/data/types/terrisEntity'

/** Primary navigation for the entity detail sheet. */
export type PlaceSheetTabId =
  | 'overview'
  | 'timeline'
  | 'facts'
  | 'media'
  | 'related'
  | 'nearby'
  | 'reconstruction'

export const PLACE_SHEET_TABS: readonly { id: PlaceSheetTabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'facts', label: 'Facts' },
  { id: 'media', label: 'Media' },
  { id: 'related', label: 'Related' },
  { id: 'nearby', label: 'Nearby' },
  { id: 'reconstruction', label: 'Reconstruction' },
] as const

export type PlaceSheetProps = {
  entity: TerrisEntity | null
  onClose?: () => void
  onFocusGlobe?: () => void
  onJumpToEra?: () => void
  /** Optional: focus another entity from Related / Nearby (same mock catalog ids). */
  onOpenRelatedEntity?: (entityId: string) => void
  className?: string
}
