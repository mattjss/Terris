/**
 * Maps Wikidata `wbgetentities` stubs into `TerrisEntity`.
 * Parsing is defensive — Wikidata’s claim graph is open-ended; extend P-id coverage over time.
 */
import { formatYear } from '@/data/historical'
import type { WikidataEntityStub } from '@/data/types/wikidata'
import type {
  EarthEntityKind,
  RelatedEntityRef,
  TerrisCoords,
  TerrisEntity,
  TerrisFact,
  TerrisFactCategory,
  TerrisTimelineEvent,
} from '@/data/types/terrisEntity'

/** P31 (instance of) → Earth kind heuristics (extend as coverage grows). */
const P31_QID_TO_KIND: Record<string, EarthEntityKind> = {
  Q515: 'place', // city
  Q1549591: 'place', // big city
  Q7930989: 'place', // city/town
  Q5: 'person',
  Q1190554: 'event', // occurrence
  Q4989906: 'landmark', // monument
  Q483453: 'venue', // stadium
  Q18674739: 'venue', // performance venue
  Q1866379: 'empire',
  Q3305213: 'artwork',
  Q729: 'animal',
  Q6256: 'place', // country
  Q23442: 'place', // village
  Q16970: 'landmark',
  Q219117: 'museum',
}

function labelForLang(
  map: Record<string, { language: string; value: string }> | undefined,
  lang: string,
): string {
  if (!map) return ''
  const v = map[lang] ?? map.en ?? Object.values(map)[0]
  return v?.value ?? ''
}

function parseYearFromWikidataTime(time: string): number | null {
  const m = /^([+-]?\d+)-/.exec(time)
  if (!m?.[1]) return null
  return parseInt(m[1], 10)
}

function readGlobeCoord(val: unknown): TerrisCoords | null {
  if (!val || typeof val !== 'object') return null
  const o = val as { latitude?: unknown; longitude?: unknown }
  const lat = typeof o.latitude === 'number' ? o.latitude : null
  const lon = typeof o.longitude === 'number' ? o.longitude : null
  if (lat === null || lon === null) return null
  return { lat, lon }
}

function readEntityId(val: unknown): string | null {
  if (!val || typeof val !== 'object') return null
  const id = (val as { id?: unknown }).id
  return typeof id === 'string' ? id : null
}

function readTime(val: unknown): string | null {
  if (!val || typeof val !== 'object') return null
  const t = (val as { time?: unknown }).time
  return typeof t === 'string' ? t : null
}

function firstDataValue(statement: unknown): unknown {
  if (!statement || typeof statement !== 'object') return null
  const mainsnak = (statement as { mainsnak?: { datavalue?: { value?: unknown } } }).mainsnak
  return mainsnak?.datavalue?.value ?? null
}

function forEachClaim(
  claims: Record<string, unknown> | undefined,
  pid: string,
  fn: (statement: unknown) => void,
): void {
  const list = claims?.[pid]
  if (!Array.isArray(list)) return
  for (const st of list) fn(st)
}

function inferKindFromP31(claims: Record<string, unknown> | undefined): EarthEntityKind {
  let kind: EarthEntityKind | null = null
  forEachClaim(claims, 'P31', (st) => {
    const v = firstDataValue(st)
    const qid = readEntityId(v)
    if (qid && P31_QID_TO_KIND[qid]) kind = P31_QID_TO_KIND[qid]
  })
  return kind ?? 'place'
}

function readCoords(claims: Record<string, unknown> | undefined): TerrisCoords | null {
  let c: TerrisCoords | null = null
  forEachClaim(claims, 'P625', (st) => {
    const v = firstDataValue(st)
    const coord = readGlobeCoord(v)
    if (coord) c = coord
  })
  return c
}

function readYearFromClaims(claims: Record<string, unknown> | undefined, pid: string): number | null {
  let y: number | null = null
  forEachClaim(claims, pid, (st) => {
    const v = firstDataValue(st)
    const t = readTime(v)
    if (t) {
      const py = parseYearFromWikidataTime(t)
      if (py !== null) y = py
    }
  })
  return y
}

function categoryForPid(pid: string): TerrisFactCategory {
  if (pid === 'P17' || pid === 'P131' || pid === 'P276') return 'location'
  return 'other'
}

function buildFacts(stub: WikidataEntityStub): TerrisFact[] {
  const claims = stub.claims as Record<string, unknown> | undefined
  const facts: TerrisFact[] = []
  let i = 0
  const pushPid = (pid: string, label: string) => {
    forEachClaim(claims, pid, (st) => {
      const v = firstDataValue(st)
      const qid = readEntityId(v)
      if (qid) {
        i += 1
        facts.push({
          id: `${stub.id}-${pid}-${i}`,
          label,
          value: qid,
          category: categoryForPid(pid),
          sourceName: 'Wikidata',
        })
      }
    })
  }
  pushPid('P17', 'Country (entity)')
  pushPid('P131', 'Located in (entity)')
  pushPid('P276', 'Location (entity)')
  return facts.slice(0, 12)
}

/** Exported for enrichment — Wikidata-only facts without Wikipedia text. */
export function wikidataFactsForStub(stub: WikidataEntityStub): TerrisFact[] {
  return buildFacts(stub)
}

/** Exported for enrichment — inception / dissolution from claims. */
export function wikidataTimelineForStub(stub: WikidataEntityStub): TerrisTimelineEvent[] {
  const claims = stub.claims as Record<string, unknown> | undefined
  return buildTimeline(stub, claims)
}

function buildTimeline(
  stub: WikidataEntityStub,
  claims: Record<string, unknown> | undefined,
): TerrisTimelineEvent[] {
  const tl: TerrisTimelineEvent[] = []
  const inception = readYearFromClaims(claims, 'P571')
  if (inception !== null) {
    tl.push({
      id: `${stub.id}-inception`,
      title: 'Inception / start',
      dateLabel: formatYear(inception),
      year: inception,
      type: 'point',
      summary: 'Recorded inception or organizational start from Wikidata claims.',
    })
  }
  const dissolved = readYearFromClaims(claims, 'P576')
  if (dissolved !== null) {
    tl.push({
      id: `${stub.id}-dissolved`,
      title: 'Dissolved / end',
      dateLabel: formatYear(dissolved),
      year: dissolved,
      type: 'point',
      summary: 'Recorded dissolution or endpoint from Wikidata claims.',
    })
  }
  return tl
}

function buildRelatedFromClaims(claims: Record<string, unknown> | undefined): RelatedEntityRef[] {
  const out: RelatedEntityRef[] = []
  forEachClaim(claims, 'P527', (st) => {
    const v = firstDataValue(st)
    const qid = readEntityId(v)
    if (qid) {
      out.push({
        mode: 'earth',
        id: qid,
        kind: 'place',
        name: qid,
        role: 'has part',
      })
    }
  })
  return out.slice(0, 20)
}

/** Commons filename from P18 (main image), when present. */
export function readWikidataP18CommonsFilename(stub: WikidataEntityStub): string | null {
  const claims = stub.claims as Record<string, unknown> | undefined
  let name: string | null = null
  forEachClaim(claims, 'P18', (st) => {
    const v = firstDataValue(st)
    if (typeof v === 'string' && !name) name = v
  })
  return name
}

/**
 * Core mapping from a Wikidata item stub (wbgetentities) to `TerrisEntity`.
 * Wikipedia text is not included — merge with `mergeWikipediaSummaryIntoTerrisEntity`.
 */
export function wikidataStubToTerrisEntity(stub: WikidataEntityStub): TerrisEntity {
  const claims = stub.claims as Record<string, unknown> | undefined
  const name = labelForLang(stub.labels, 'en') || stub.id
  const summary = labelForLang(stub.descriptions, 'en') || ''
  const kind = inferKindFromP31(claims)
  const coords = readCoords(claims)
  const startYear = readYearFromClaims(claims, 'P571')
  const endYear = readYearFromClaims(claims, 'P576')

  return {
    id: stub.id,
    name,
    mode: 'earth',
    type: kind,
    placeName: name,
    regionName: null,
    countryName: null,
    coords,
    startYear,
    endYear,
    summary,
    fullDescription: summary,
    facts: buildFacts(stub),
    timeline: buildTimeline(stub, claims),
    relatedEntities: buildRelatedFromClaims(claims),
    nearby: [],
    media: [],
    sources: { wikidataId: stub.id },
  }
}
