import { getPathwayById } from '@/data/learning/seedPathways'
import { expandSeedsForEntity } from '@/data/recommendations/recommendationSeeds'
import type {
  RecommendationCategory,
  RecommendationContext,
  RecommendationSection,
  TerrisRecommendation,
} from '@/data/recommendations/recommendationTypes'
import { getMockEntityById } from '@/data/services/entityService'
import type { RelatedEntityRef, TerrisTimelineEvent } from '@/data/types/terrisEntity'

export const RECOMMENDATION_SECTION_ORDER: RecommendationCategory[] = [
  'next_in_pathway',
  'continue_story',
  'nearby',
  'related_people',
  'related_events',
  'similar_discoveries',
  'go_deeper',
  'go_broader',
]

export const RECOMMENDATION_SECTION_LABELS: Record<RecommendationCategory, string> = {
  next_in_pathway: 'Next in pathway',
  continue_story: 'Continue this story',
  nearby: 'Nearby places',
  related_people: 'Related people',
  related_events: 'Related events',
  similar_discoveries: 'Similar discoveries',
  go_deeper: 'Go deeper',
  go_broader: 'Go broader',
}

const PERSON_KINDS = new Set<RelatedEntityRef['kind']>(['person'])
const EVENT_KINDS = new Set<RelatedEntityRef['kind']>(['event'])
const PLACE_LIKE_KINDS = new Set<RelatedEntityRef['kind']>([
  'place',
  'landmark',
  'venue',
  'museum',
  'empire',
])

function isPerson(k: RelatedEntityRef['kind']): boolean {
  return PERSON_KINDS.has(k)
}

function isEvent(k: RelatedEntityRef['kind']): boolean {
  return EVENT_KINDS.has(k)
}

function isPlaceLike(k: RelatedEntityRef['kind']): boolean {
  return PLACE_LIKE_KINDS.has(k)
}

function sortTimelineChronological(entries: TerrisTimelineEvent[]): TerrisTimelineEvent[] {
  return [...entries].sort((a, b) => a.year - b.year)
}

function clampYear(y: number): number {
  return Math.max(-3000, Math.min(2025, y))
}

function targetTitle(entityId: string, fallback: string): string {
  return getMockEntityById(entityId)?.name ?? fallback
}

function pushCandidate(
  list: TerrisRecommendation[],
  rec: Omit<TerrisRecommendation, 'id'> & { id?: string },
) {
  const id =
    rec.id ??
    `${rec.category}-${rec.entityId}-${rec.title}`.replace(/\s+/g, '-').slice(0, 120)
  list.push({ ...rec, id })
}

/**
 * Rule-based, explainable suggestions — no ML.
 * Uses related graph, nearby anchors, timeline links, active pathway, and editorial seeds.
 */
export function buildRecommendations(ctx: RecommendationContext): RecommendationSection[] {
  const entity = getMockEntityById(ctx.entity.id)
  if (!entity) return []

  const sourceId = entity.id
  const candidates: TerrisRecommendation[] = []

  // ── 1. Next step in active guided pathway ─────────────────────────
  if (ctx.guidedPathwayId) {
    const pathway = getPathwayById(ctx.guidedPathwayId)
    const nextIdx = ctx.guidedStepIndex + 1
    const nextStep = pathway?.steps[nextIdx]
    if (nextStep && nextStep.entityId !== sourceId) {
      pushCandidate(candidates, {
        id: `pathway-next-${nextStep.id}`,
        title: nextStep.title,
        entityId: nextStep.entityId,
        reason: `Your journey “${pathway?.title ?? 'pathway'}” continues here — optional, not required.`,
        category: 'next_in_pathway',
        priority: 100,
        mode: nextStep.mode,
        year: nextStep.year !== undefined ? clampYear(nextStep.year) : undefined,
        pathwayId: ctx.guidedPathwayId,
      })
    }
  }

  // ── 2. Timeline → continue this story ─────────────────────────────
  const timelineSorted = sortTimelineChronological(entity.timeline)
  for (const ev of timelineSorted) {
    const ids = ev.relatedEntityIds
    if (!ids?.length) continue
    for (const rid of ids) {
      if (rid === sourceId) continue
      const ref = entity.relatedEntities.find((r) => r.id === rid)
      pushCandidate(candidates, {
        id: `timeline-${ev.id}-${rid}`,
        title: targetTitle(rid, ref?.name ?? rid),
        entityId: rid,
        reason: `The timeline moment “${ev.title}” links here — follow the thread.`,
        category: 'continue_story',
        priority: 88,
        mode: ref?.mode ?? entity.mode,
        year: ev.year !== undefined ? clampYear(ev.year) : undefined,
      })
    }
    break
  }

  // ── 3. Nearby anchors ───────────────────────────────────────────
  for (const n of entity.nearby) {
    if (n.id === sourceId) continue
    pushCandidate(candidates, {
      id: `nearby-${n.id}`,
      title: targetTitle(n.id, n.name),
      entityId: n.id,
      reason: n.role
        ? `Listed as nearby: ${n.role}`
        : 'Curated nearby anchor for orientation on the map.',
      category: 'nearby',
      priority: 72,
      mode: n.mode,
    })
  }

  // ── 4. Related entities by kind ─────────────────────────────────
  for (const r of entity.relatedEntities) {
    if (r.id === sourceId) continue
    if (isPerson(r.kind)) {
      pushCandidate(candidates, {
        id: `rel-person-${r.id}`,
        title: targetTitle(r.id, r.name),
        entityId: r.id,
        reason: r.role
          ? `Related person: ${r.role}`
          : 'Linked from this dossier’s related people.',
        category: 'related_people',
        priority: 70,
        mode: r.mode,
      })
    } else if (isEvent(r.kind)) {
      pushCandidate(candidates, {
        id: `rel-event-${r.id}`,
        title: targetTitle(r.id, r.name),
        entityId: r.id,
        reason: r.role
          ? `Related event: ${r.role}`
          : 'Linked from this dossier’s events.',
        category: 'related_events',
        priority: 69,
        mode: r.mode,
      })
    } else if (!isPlaceLike(r.kind) || r.kind === 'planet' || r.kind === 'moon' || r.kind === 'spacecraft' || r.kind === 'galaxy' || r.kind === 'nebula') {
      pushCandidate(candidates, {
        id: `rel-sim-${r.id}`,
        title: targetTitle(r.id, r.name),
        entityId: r.id,
        reason: r.role
          ? `Comparable thread: ${r.role}`
          : 'Related discovery in the same thematic neighborhood.',
        category: 'similar_discoveries',
        priority: 66,
        mode: r.mode,
      })
    } else {
      pushCandidate(candidates, {
        id: `rel-place-${r.id}`,
        title: targetTitle(r.id, r.name),
        entityId: r.id,
        reason: r.role
          ? `Related place: ${r.role}`
          : 'Another place tied to this dossier.',
        category: 'similar_discoveries',
        priority: 64,
        mode: r.mode,
      })
    }
  }

  // ── 5. Editorial seeds ────────────────────────────────────────────
  for (const s of expandSeedsForEntity(sourceId)) {
    if (s.entityId === sourceId) continue
    pushCandidate(candidates, { ...s })
  }

  // ── Dedupe by target entity id (keep highest priority) ───────────
  const best = new Map<string, TerrisRecommendation>()
  for (const c of candidates) {
    const prev = best.get(c.entityId)
    if (!prev || c.priority > prev.priority) best.set(c.entityId, c)
  }

  const merged = [...best.values()]

  // ── Group by category ─────────────────────────────────────────────
  const byCat = new Map<RecommendationCategory, TerrisRecommendation[]>()
  for (const cat of RECOMMENDATION_SECTION_ORDER) {
    byCat.set(cat, [])
  }
  for (const m of merged) {
    const list = byCat.get(m.category)
    if (list) list.push(m)
  }

  const sections: RecommendationSection[] = []
  for (const category of RECOMMENDATION_SECTION_ORDER) {
    const items = byCat.get(category)
    if (!items?.length) continue
    items.sort((a, b) => b.priority - a.priority)
    sections.push({
      category,
      label: RECOMMENDATION_SECTION_LABELS[category],
      items,
    })
  }

  return sections
}

/** For compact UI (e.g. guided strip): global priority order, optional category exclusions */
export function flattenRecommendations(
  sections: RecommendationSection[],
  opts?: { max?: number; excludeCategories?: RecommendationCategory[] },
): TerrisRecommendation[] {
  const max = opts?.max ?? 6
  const exclude = new Set(opts?.excludeCategories ?? [])
  const flat = sections
    .filter((s) => !exclude.has(s.category))
    .flatMap((s) => s.items)
    .sort((a, b) => b.priority - a.priority)
  return flat.slice(0, max)
}
