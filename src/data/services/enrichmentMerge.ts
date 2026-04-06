/**
 * Merge live Wikidata / Wikipedia / SPARQL rows onto editorial `TerrisEntity` rows without replacing `id`.
 */
import type {
  RelatedEntityRef,
  TerrisEntity,
  TerrisEnrichmentMeta,
  TerrisFact,
  TerrisTimelineEvent,
} from '@/data/types/terrisEntity'

export function factKey(f: TerrisFact): string {
  return `${f.label.toLowerCase()}|${f.value}`
}

export function mergeFactsDeduped(base: TerrisFact[], extra: TerrisFact[]): TerrisFact[] {
  const seen = new Set(base.map(factKey))
  const out = [...base]
  for (const f of extra) {
    if (seen.has(factKey(f))) continue
    seen.add(factKey(f))
    out.push(f)
  }
  return out.slice(0, 80)
}

export function timelineKey(t: TerrisTimelineEvent): string {
  return `${t.title}|${t.year}`
}

export function mergeTimelineDeduped(...groups: TerrisTimelineEvent[][]): TerrisTimelineEvent[] {
  const seen = new Set<string>()
  const out: TerrisTimelineEvent[] = []
  for (const g of groups) {
    for (const t of g) {
      const k = timelineKey(t)
      if (seen.has(k)) continue
      seen.add(k)
      out.push(t)
    }
  }
  return out.sort((a, b) => a.year - b.year)
}

export function mergeRelatedDeduped(base: RelatedEntityRef[], extra: RelatedEntityRef[]): RelatedEntityRef[] {
  const seen = new Set(base.map((r) => r.id))
  const out = [...base]
  for (const r of extra) {
    if (seen.has(r.id)) continue
    seen.add(r.id)
    out.push(r)
  }
  return out.slice(0, 60)
}

export function pickLongerString(a: string, b: string): string {
  const ta = a.trim()
  const tb = b.trim()
  if (tb.length > ta.length) return tb
  return ta
}

type MergeEarthOpts = {
  qid: string
  live: TerrisEntity
  fullExtract: string | null
  wikipediaShort: string | null
  wikipediaTitle: string | undefined
  sparqlRelated: RelatedEntityRef[]
  sparqlTimeline: TerrisTimelineEvent[]
  warnings: string[]
}

export function mergeEarthEnrichment(base: TerrisEntity, opts: MergeEarthOpts): TerrisEntity {
  const { live, qid } = opts
  let fullDesc = pickLongerString(base.fullDescription, opts.fullExtract ?? '')
  fullDesc = pickLongerString(fullDesc, opts.wikipediaShort ?? '')
  const summary = pickLongerString(base.summary, live.summary)

  const facts = mergeFactsDeduped(base.facts, live.facts)
  const timeline = mergeTimelineDeduped(base.timeline, live.timeline, opts.sparqlTimeline)
  const related = mergeRelatedDeduped(
    mergeRelatedDeduped(base.relatedEntities, live.relatedEntities),
    opts.sparqlRelated,
  )

  const enrichment = buildEnrichmentMeta({
    hadText: Boolean(opts.fullExtract || opts.wikipediaShort),
    hadSparql: opts.sparqlRelated.length > 0 || opts.sparqlTimeline.length > 0,
    hadWikidataFacts: live.facts.length > 0,
    warnings: opts.warnings,
  })

  return {
    ...base,
    id: base.id,
    coords: base.coords ?? live.coords,
    startYear: base.startYear ?? live.startYear,
    endYear: base.endYear ?? live.endYear,
    summary,
    fullDescription: fullDesc,
    facts,
    timeline,
    relatedEntities: related,
    sources: {
      ...base.sources,
      wikidataId: qid,
      wikipediaTitle: base.sources?.wikipediaTitle ?? opts.wikipediaTitle ?? live.sources?.wikipediaTitle,
      enrichment,
    },
  }
}

type MergePlanetaryOpts = {
  qid: string
  facts: TerrisFact[]
  timeline: TerrisTimelineEvent[]
  description: string
  fullExtract: string | null
  wikipediaShort: string | null
  wikipediaTitle: string | undefined
  sparqlRelated: RelatedEntityRef[]
  sparqlTimeline: TerrisTimelineEvent[]
  warnings: string[]
}

export function mergePlanetaryEnrichment(base: TerrisEntity, opts: MergePlanetaryOpts): TerrisEntity {
  let fullDesc = pickLongerString(base.fullDescription, opts.fullExtract ?? '')
  fullDesc = pickLongerString(fullDesc, opts.wikipediaShort ?? '')
  const descLine = (opts.description || opts.wikipediaShort || '').trim().slice(0, 280)
  const summary = pickLongerString(base.summary, descLine)

  const facts = mergeFactsDeduped(base.facts, opts.facts)
  const timeline = mergeTimelineDeduped(base.timeline, opts.timeline, opts.sparqlTimeline)
  const related = mergeRelatedDeduped(base.relatedEntities, opts.sparqlRelated)

  const enrichment = buildEnrichmentMeta({
    hadText: Boolean(opts.fullExtract || opts.wikipediaShort || opts.description),
    hadSparql: opts.sparqlRelated.length > 0 || opts.sparqlTimeline.length > 0,
    hadWikidataFacts: opts.facts.length > 0,
    warnings: opts.warnings,
  })

  return {
    ...base,
    id: base.id,
    summary,
    fullDescription: fullDesc,
    facts,
    timeline,
    relatedEntities: related,
    sources: {
      ...base.sources,
      wikidataId: opts.qid,
      wikipediaTitle: base.sources?.wikipediaTitle ?? opts.wikipediaTitle,
      enrichment,
    },
  }
}

function buildEnrichmentMeta(args: {
  hadText: boolean
  hadSparql: boolean
  hadWikidataFacts: boolean
  warnings: string[]
}): TerrisEnrichmentMeta {
  const anyLive = args.hadText || args.hadSparql || args.hadWikidataFacts
  const status: TerrisEnrichmentMeta['status'] = anyLive ? 'mixed' : 'mock'
  return {
    status,
    partial: args.warnings.length > 0,
    warnings: args.warnings.length ? args.warnings : undefined,
    attemptedAt: new Date().toISOString(),
  }
}
