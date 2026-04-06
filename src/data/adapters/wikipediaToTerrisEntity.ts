/**
 * Maps Wikipedia REST `page/summary` payloads into Terris fields and merges onto a Wikidata-derived entity.
 */
import type { WikipediaPageSummary } from '@/data/types/wikipedia'
import type {
  EarthEntityKind,
  TerrisEntity,
  TerrisMediaItem,
} from '@/data/types/terrisEntity'

function thumbnailToMedia(summary: WikipediaPageSummary, entityId: string): TerrisMediaItem[] {
  const th = summary.thumbnail
  if (!th?.source) return []
  const title = summary.displaytitle || summary.title
  return [
    {
      id: `${entityId}-wp-thumb`,
      type: 'image',
      title,
      sourceName: 'Wikipedia (MediaWiki)',
      license: undefined,
      url: th.source,
      caption: summary.extract?.trim().slice(0, 280) ?? 'Lead image from Wikipedia.',
      credit: 'Wikimedia / Wikipedia contributors',
      isInterpretive: false,
      thumbnailUrl: th.source,
    },
  ]
}

type MergeWikipediaOpts = {
  /**
   * When set (including empty), replaces default REST-thumbnail extraction:
   * empty array falls back to `thumbnailToMedia` so a bare summary still yields a lead image if present.
   */
  leadMedia?: TerrisMediaItem[]
}

function resolveLeadMedia(
  summary: WikipediaPageSummary,
  entityId: string,
  opts?: MergeWikipediaOpts,
): TerrisMediaItem[] {
  if (opts?.leadMedia === undefined) return thumbnailToMedia(summary, entityId)
  if (opts.leadMedia.length > 0) return opts.leadMedia
  return thumbnailToMedia(summary, entityId)
}

/**
 * Enrich a `TerrisEntity` (usually from `wikidataStubToTerrisEntity`) with lede text and lead image.
 */
export function mergeWikipediaSummaryIntoTerrisEntity(
  entity: TerrisEntity,
  summary: WikipediaPageSummary,
  opts?: MergeWikipediaOpts,
): TerrisEntity {
  const extract = summary.extract?.trim() ?? ''
  const mergedMedia = [...entity.media, ...resolveLeadMedia(summary, entity.id, opts)]
  return {
    ...entity,
    summary: entity.summary || extract.slice(0, 280),
    fullDescription: extract || entity.fullDescription,
    media: mergedMedia,
    sources: {
      ...entity.sources,
      wikipediaTitle: summary.title,
    },
  }
}

/**
 * Standalone: build a minimal entity when only Wikipedia is available (no Wikidata join yet).
 */
export function wikipediaSummaryToMinimalTerrisEntity(
  summary: WikipediaPageSummary,
  syntheticId: string,
  kind: EarthEntityKind = 'place',
): TerrisEntity {
  const coords =
    summary.coordinates?.[0] &&
    typeof summary.coordinates[0].lat === 'number' &&
    typeof summary.coordinates[0].lon === 'number'
      ? { lat: summary.coordinates[0].lat, lon: summary.coordinates[0].lon }
      : null

  const display = summary.displaytitle || summary.title
  const base: TerrisEntity = {
    id: syntheticId,
    name: display,
    mode: 'earth',
    type: kind,
    placeName: display,
    regionName: null,
    countryName: null,
    coords,
    startYear: null,
    endYear: null,
    summary: summary.extract?.slice(0, 280) ?? '',
    fullDescription: summary.extract ?? '',
    facts: [],
    timeline: [],
    relatedEntities: [],
    nearby: [],
    media: thumbnailToMedia(summary, syntheticId),
    sources: { wikipediaTitle: summary.title },
  }
  return base
}
