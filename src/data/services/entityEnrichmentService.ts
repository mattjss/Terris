/**
 * Orchestrates open-knowledge enrichment for editorial entities: Wikidata claims, Wikipedia extracts, SPARQL graph.
 * Never replaces editorial `TerrisEntity.id`; falls back to the base entity when disabled or on failure.
 */
import {
  wikidataFactsForStub,
  wikidataStubToTerrisEntity,
  wikidataTimelineForStub,
} from '@/data/adapters/wikidataToTerrisEntity'
import { fetchWikipediaExtractBestEffort } from '@/data/clients/mediawikiExtractsClient'
import { integrationFlags } from '@/data/clients/integrationConfig'
import { getWikidataEntityForEnrichment } from '@/data/clients/wikidataRestClient'
import {
  queryDatedEventsForPlace,
  queryMissionsForPlanet,
  queryPartsOrLocatedIn,
  queryPeopleBornInPlace,
  queryTimelineDatesForItem,
  queryVenuesLandmarksForCity,
} from '@/data/clients/wikidataSparqlClient'
import { fetchWikipediaPageSummary } from '@/data/clients/wikipediaClient'
import type { RelatedEntityRef, TerrisEntity, TerrisTimelineEvent } from '@/data/types/terrisEntity'
import type { WikidataEntityStub } from '@/data/types/wikidata'
import { mergeEarthEnrichment, mergePlanetaryEnrichment } from './enrichmentMerge'

/** Editorial id → Wikidata Q-id for seeds without `sources.wikidataId`. */
export const ENRICHMENT_SEED_QID: Record<string, string> = {
  'terris-hub-boston': 'Q100',
  'terris-venue-fenway': 'Q1329645',
  'terris-place-rome': 'Q220',
  'terris-planet-mars': 'Q111',
}

export function resolveEnrichmentQid(entity: TerrisEntity): string | null {
  const fromSource = entity.sources?.wikidataId?.trim()
  if (fromSource?.startsWith('Q')) return fromSource
  const seeded = ENRICHMENT_SEED_QID[entity.id]
  return seeded ?? null
}

async function gatherSparql(
  base: TerrisEntity,
  qid: string,
): Promise<{ related: RelatedEntityRef[]; timeline: TerrisTimelineEvent[]; warnings: string[] }> {
  const warnings: string[] = []
  const related: RelatedEntityRef[] = []
  const timeline: TerrisTimelineEvent[] = []

  if (!integrationFlags.wikidataSparqlLive) {
    return { related, timeline, warnings }
  }

  const run = async <T>(label: string, fn: () => Promise<T>, apply: (v: T) => void) => {
    try {
      apply(await fn())
    } catch (e) {
      warnings.push(`${label}: ${e}`)
    }
  }

  if (base.mode === 'planetary') {
    await run('missions', () => queryMissionsForPlanet(qid), (v) => related.push(...v))
    await run('dates', () => queryTimelineDatesForItem(qid), (v) => timeline.push(...v))
    return { related, timeline, warnings }
  }

  const isCityLikePlace = base.mode === 'earth' && base.type === 'place'
  const isVenueLike =
    base.mode === 'earth' &&
    (base.type === 'venue' || base.type === 'landmark' || base.type === 'museum')

  if (isCityLikePlace) {
    await run('venues', () => queryVenuesLandmarksForCity(qid), (v) => related.push(...v))
    await run('people', () => queryPeopleBornInPlace(qid), (v) => related.push(...v))
  }

  if (isCityLikePlace || isVenueLike) {
    await run('events', () => queryDatedEventsForPlace(qid), (v) => timeline.push(...v))
    await run('parts', () => queryPartsOrLocatedIn(qid), (v) => related.push(...v))
  }

  await run('item-dates', () => queryTimelineDatesForItem(qid), (v) => timeline.push(...v))

  return { related, timeline, warnings }
}

async function loadWikipediaText(title: string | undefined): Promise<{
  fullExtract: string | null
  wikipediaShort: string | null
}> {
  if (!title || !integrationFlags.wikipediaLive) {
    return { fullExtract: null, wikipediaShort: null }
  }
  let fullExtract: string | null = null
  try {
    fullExtract = await fetchWikipediaExtractBestEffort(title, { minChars: 400, maxChars: 12000 })
  } catch {
    fullExtract = null
  }
  let wikipediaShort: string | null = null
  try {
    const sum = await fetchWikipediaPageSummary(title)
    wikipediaShort = sum.extract?.trim() ?? null
  } catch {
    wikipediaShort = null
  }
  return { fullExtract, wikipediaShort }
}

function withMockEnrichment(
  base: TerrisEntity,
  extra?: Partial<NonNullable<TerrisEntity['sources']>['enrichment']>,
): TerrisEntity {
  return {
    ...base,
    sources: {
      ...base.sources,
      enrichment: {
        status: 'mock',
        attemptedAt: new Date().toISOString(),
        ...extra,
      },
    },
  }
}

/**
 * Enrich an editorial or mock entity using Wikidata + optional Wikipedia + SPARQL.
 * Safe to call in the UI: returns the original entity on any hard failure.
 */
export async function enrichTerrisEntity(base: TerrisEntity): Promise<TerrisEntity> {
  if (!integrationFlags.enrichmentLive) {
    return withMockEnrichment(base, { warnings: ['VITE_ENRICHMENT_LIVE not enabled'] })
  }

  const qid = resolveEnrichmentQid(base)
  if (!qid) {
    return withMockEnrichment(base, { warnings: ['No Wikidata id on entity or seed map'] })
  }

  if (!integrationFlags.wikidataLive) {
    return withMockEnrichment(base, {
      warnings: ['VITE_WIKIDATA_LIVE required for structured enrichment'],
    })
  }

  let stub: WikidataEntityStub | null = null
  try {
    stub = await getWikidataEntityForEnrichment(qid)
  } catch (e) {
    return {
      ...base,
      sources: {
        ...base.sources,
        enrichment: {
          status: 'mock',
          partial: true,
          warnings: [`Wikidata fetch failed: ${e}`],
          attemptedAt: new Date().toISOString(),
        },
      },
    }
  }

  if (!stub) {
    return withMockEnrichment(base, { partial: true, warnings: [`No Wikidata entity for ${qid}`] })
  }

  const title = stub.sitelinks?.enwiki?.title
  const { fullExtract, wikipediaShort } = await loadWikipediaText(title)

  let sparqlWarnings: string[] = []
  let sparqlRelated: RelatedEntityRef[] = []
  let sparqlTimeline: TerrisTimelineEvent[] = []
  try {
    const g = await gatherSparql(base, qid)
    sparqlRelated = g.related
    sparqlTimeline = g.timeline
    sparqlWarnings = g.warnings
  } catch (e) {
    sparqlWarnings = [`sparql: ${e}`]
  }

  const warnings = [...sparqlWarnings]

  if (base.mode !== 'earth') {
    const wdFacts = wikidataFactsForStub(stub)
    const wdTimeline = wikidataTimelineForStub(stub)
    const description = stub.descriptions?.en?.value ?? stub.labels?.en?.value ?? ''
    return mergePlanetaryEnrichment(base, {
      qid,
      facts: wdFacts,
      timeline: wdTimeline,
      description,
      fullExtract,
      wikipediaShort,
      wikipediaTitle: title,
      sparqlRelated,
      sparqlTimeline,
      warnings,
    })
  }

  const live = wikidataStubToTerrisEntity(stub)
  return mergeEarthEnrichment(base, {
    qid,
    live,
    fullExtract,
    wikipediaShort,
    wikipediaTitle: title,
    sparqlRelated,
    sparqlTimeline,
    warnings,
  })
}
