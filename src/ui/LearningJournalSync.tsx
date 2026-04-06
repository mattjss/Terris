import { useEffect } from 'react'
import { useExploreScaleStore } from '@/state/exploreScaleStore'
import { useLearningJournalStore } from '@/state/useLearningJournalStore'
import { useTerrisStore } from '@/state/useTerrisStore'

/**
 * Keeps session snapshot + recent history aligned with exploration state.
 * Mount once near the app root.
 */
export function LearningJournalSync() {
  const hydrated = useLearningJournalStore((s) => s.hydrated)
  const syncSessionSnapshot = useLearningJournalStore((s) => s.syncSessionSnapshot)
  const recordRecentEntity = useLearningJournalStore((s) => s.recordRecentEntity)

  const selectedEntity = useTerrisStore((s) => s.selectedEntity)
  const guidedPathwayId = useTerrisStore((s) => s.guidedPathwayId)
  const guidedStepIndex = useTerrisStore((s) => s.guidedStepIndex)
  const year = useTerrisStore((s) => s.year)
  const exploreMode = useExploreScaleStore((s) => s.mode)

  useEffect(() => {
    if (!hydrated) return
    syncSessionSnapshot({
      lastEntityId: selectedEntity?.id ?? null,
      lastPathwayId: guidedPathwayId,
      lastPathwayStepIndex: guidedStepIndex,
      lastMode: exploreMode,
      lastYear: year,
    })
  }, [
    hydrated,
    selectedEntity?.id,
    guidedPathwayId,
    guidedStepIndex,
    year,
    exploreMode,
    syncSessionSnapshot,
  ])

  useEffect(() => {
    if (!hydrated) return
    const id = selectedEntity?.id
    if (!id) return
    recordRecentEntity(id)
  }, [hydrated, selectedEntity?.id, recordRecentEntity])

  return null
}
