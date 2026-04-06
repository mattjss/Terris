import { useMemo } from 'react'
import { buildRecommendations, flattenRecommendations } from '@/data/recommendations/buildRecommendations'
import type { TerrisRecommendation } from '@/data/recommendations/recommendationTypes'
import { useTerrisStore } from '@/state/useTerrisStore'
import type { TerrisEntity } from '@/data/types/terrisEntity'

function useRecommendationContext(entity: TerrisEntity) {
  const guidedPathwayId = useTerrisStore((s) => s.guidedPathwayId)
  const guidedStepIndex = useTerrisStore((s) => s.guidedStepIndex)
  return useMemo(
    () => ({
      entity: { id: entity.id },
      guidedPathwayId,
      guidedStepIndex,
    }),
    [entity.id, guidedPathwayId, guidedStepIndex],
  )
}

function RecommendationCard({
  rec,
  onOpen,
}: {
  rec: TerrisRecommendation
  onOpen: () => void
}) {
  return (
    <button type="button" className="terris-rec-card" onClick={onOpen}>
      <span className="terris-rec-card__title">{rec.title}</span>
      <span className="terris-rec-card__reason">{rec.reason}</span>
    </button>
  )
}

export type EntityRecommendationsProps = {
  entity: TerrisEntity
  onOpenEntity?: (entityId: string) => void
}

/** Grouped “museum guide” suggestions on the entity overview */
export function EntityRecommendations({ entity, onOpenEntity }: EntityRecommendationsProps) {
  const ctx = useRecommendationContext(entity)
  const sections = useMemo(() => buildRecommendations(ctx), [ctx])

  if (!onOpenEntity) return null

  if (sections.length === 0) {
    return (
      <div
        className="terris-recs terris-recs--empty"
        role="region"
        aria-label="Suggestions for what to explore next"
      >
        <h3 className="terris-recs__heading">Continue exploring</h3>
        <p className="terris-recs__empty-copy">
          Nothing new to suggest from this place yet — spin the globe or open search to find another
          story.
        </p>
      </div>
    )
  }

  return (
    <div className="terris-recs" role="region" aria-label="Suggestions for what to explore next">
      <h3 className="terris-recs__heading">Continue exploring</h3>
      <p className="terris-recs__lede">
        Gentle suggestions — each line explains why it appears. Skip anything; wander freely.
      </p>
      <div className="terris-recs__sections">
        {sections.map((section) => (
          <section key={section.category} className="terris-recs__section">
            <h4 className="terris-recs__section-title">{section.label}</h4>
            <ul className="terris-recs__list">
              {section.items.map((item) => (
                <li key={item.id}>
                  <RecommendationCard
                    rec={item}
                    onOpen={() => onOpenEntity(item.entityId)}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}

export type CompactContinueExploringProps = {
  entity: TerrisEntity
  onOpenEntity?: (entityId: string) => void
  max?: number
}

/** Narrow strip for guided mode — avoids repeating “next in pathway” */
export function CompactContinueExploring({
  entity,
  onOpenEntity,
  max = 2,
}: CompactContinueExploringProps) {
  const ctx = useRecommendationContext(entity)
  const items = useMemo(() => {
    const sections = buildRecommendations(ctx)
    return flattenRecommendations(sections, {
      max,
      excludeCategories: ['next_in_pathway'],
    })
  }, [ctx, max])

  if (!onOpenEntity) return null

  if (items.length === 0) {
    return (
      <div
        className="terris-recs terris-recs--compact terris-recs--compact-empty"
        role="region"
        aria-label="More to explore"
      >
        <p className="terris-recs__compact-empty-copy">No side trips from this pin yet.</p>
      </div>
    )
  }

  return (
    <div className="terris-recs terris-recs--compact" role="region" aria-label="More to explore">
      <h4 className="terris-recs__compact-heading">You might also open</h4>
      <ul className="terris-recs__compact-list">
        {items.map((item) => (
          <li key={item.id}>
            <RecommendationCard rec={item} onOpen={() => onOpenEntity(item.entityId)} />
          </li>
        ))}
      </ul>
    </div>
  )
}
