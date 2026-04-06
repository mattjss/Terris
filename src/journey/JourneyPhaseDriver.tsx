import { useEffect } from 'react'
import { useTerrisStore } from '@/state/useTerrisStore'
import {
  JOURNEY_ARRIVAL_MS,
  JOURNEY_PORTAL_MS,
  JOURNEY_TRAVEL_MS,
} from '@/journey/journeyPhaseTypes'
import { useJourneyPhaseStore } from '@/state/useJourneyPhaseStore'

/**
 * Advances browse → travel → portal → arrival → study on timers.
 * `enterPlaceDetail` runs once at the end (study). Reduced motion is handled in `beginJourneyToEntity` (immediate study).
 */
export function JourneyPhaseDriver() {
  const phase = useJourneyPhaseStore((s) => s.phase)
  const setPhase = useJourneyPhaseStore((s) => s.setPhase)
  const targetEntity = useJourneyPhaseStore((s) => s.targetEntity)
  const enterPlaceDetail = useTerrisStore((s) => s.enterPlaceDetail)

  useEffect(() => {
    if (phase !== 'travel' || !targetEntity) return
    const t1 = window.setTimeout(() => setPhase('portal'), JOURNEY_TRAVEL_MS)
    return () => window.clearTimeout(t1)
  }, [phase, targetEntity, setPhase])

  useEffect(() => {
    if (phase !== 'portal') return
    const t = window.setTimeout(() => setPhase('arrival'), JOURNEY_PORTAL_MS)
    return () => window.clearTimeout(t)
  }, [phase, setPhase])

  useEffect(() => {
    if (phase !== 'arrival') return
    const entity = targetEntity ?? useTerrisStore.getState().selectedEntity
    if (!entity) {
      useJourneyPhaseStore.getState().resetToBrowse()
      return
    }
    const t = window.setTimeout(() => {
      enterPlaceDetail(entity)
    }, JOURNEY_ARRIVAL_MS)
    return () => window.clearTimeout(t)
  }, [phase, targetEntity, enterPlaceDetail])
  return null
}
