import { useEffect, useState } from 'react'
import { integrationFlags } from '@/data/clients/integrationConfig'
import { enrichTerrisEntity } from '@/data/services/entityEnrichmentService'
import type { TerrisEntity } from '@/data/types/terrisEntity'

/** Delay before surfacing loading UI — keeps fast responses feeling instant. */
const LOADING_REVEAL_MS = 220

/**
 * Async enrichment for the place sheet — keeps the last resolved entity aligned with `TerrisEntity.id`.
 * When live enrichment is off, returns the base entity synchronously (no loading).
 */
export function useEnrichedEntity(selected: TerrisEntity | null): {
  /** Base mock/editorial row while loading, then merged result. */
  entity: TerrisEntity | null
  /** True only after a short delay while work is still in flight — avoids spinner flash. */
  enrichmentLoading: boolean
  enrichmentError: string | null
} {
  const [enriched, setEnriched] = useState<TerrisEntity | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingVisible, setLoadingVisible] = useState(false)

  useEffect(() => {
    if (!selected) {
      setEnriched(null)
      setLoading(false)
      setError(null)
      setLoadingVisible(false)
      return
    }

    if (!integrationFlags.enrichmentLive) {
      setEnriched(null)
      setLoading(false)
      setError(null)
      setLoadingVisible(false)
      return
    }

    let cancelled = false
    setEnriched(null)
    setLoading(true)
    setLoadingVisible(false)
    setError(null)

    const revealTimer = window.setTimeout(() => {
      if (!cancelled) setLoadingVisible(true)
    }, LOADING_REVEAL_MS)

    enrichTerrisEntity(selected)
      .then((e) => {
        if (!cancelled) {
          window.clearTimeout(revealTimer)
          setEnriched(e)
          setLoading(false)
          setLoadingVisible(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          window.clearTimeout(revealTimer)
          setEnriched(selected)
          setError(String(err))
          setLoading(false)
          setLoadingVisible(false)
        }
      })

    return () => {
      cancelled = true
      window.clearTimeout(revealTimer)
    }
  }, [selected?.id])

  const entity = enriched ?? selected
  return {
    entity,
    enrichmentLoading:
      integrationFlags.enrichmentLive && Boolean(selected) && loading && loadingVisible,
    enrichmentError: error,
  }
}
