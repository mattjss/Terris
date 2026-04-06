/**
 * Wikidata Query Service — SPARQL endpoint (public, no API key).
 * POST or GET `https://query.wikidata.org/sparql` with `format=json`.
 *
 * Use for graph traversals, batch coordinate lookups, and “related entity” discovery.
 * Enable live queries via `VITE_WIKIDATA_SPARQL_LIVE=true`.
 */
import type { SparqlBindingValue, SparqlResults } from '@/data/types/sparql'
import type { RelatedEntityRef, TerrisTimelineEvent } from '@/data/types/terrisEntity'
import { formatYear } from '@/data/historical'
import {
  sparqlDatesForItem,
  sparqlEventsLocatedAtOrAbout,
  sparqlMissionsForPlanet,
  sparqlPartsOrLocatedIn,
  sparqlRelatedPeopleForPlace,
  sparqlVenuesLandmarksMuseumsInCity,
} from './wikidataSparqlQueries'
import { integrationFlags } from './integrationConfig'
import { fetchJson, withQuery } from './fetchHelpers'

const SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql'

const MOCK_SPARQL_EMPTY: SparqlResults = {
  head: { vars: [] },
  results: { bindings: [] },
}

async function querySparqlLive(query: string): Promise<SparqlResults> {
  const url = withQuery(SPARQL_ENDPOINT, {
    query,
    format: 'json',
  })
  return fetchJson<SparqlResults>(url)
}

/**
 * Run a SPARQL query and return JSON bindings.
 * Keep queries parameterized server-side in production to avoid injection; here the caller owns the string.
 */
export async function queryWikidataSparql(sparql: string): Promise<SparqlResults> {
  if (!integrationFlags.wikidataSparqlLive) {
    return MOCK_SPARQL_EMPTY
  }
  return querySparqlLive(sparql)
}

function bindingUriQid(b: SparqlBindingValue | undefined): string | null {
  if (!b || b.type !== 'uri') return null
  const m = /entity\/(Q\d+)$/.exec(b.value)
  return m?.[1] ?? null
}

function bindingLiteral(b: SparqlBindingValue | undefined): string {
  if (!b || (b.type !== 'literal' && b.type !== 'typed-literal')) return ''
  return b.value
}

function yearFromWikidataTimeLiteral(s: string): number | null {
  const m = /^([+-]?\d{1,9})-/.exec(s)
  if (!m?.[1]) return null
  return parseInt(m[1], 10)
}

function venueKindFromTypeQid(typeQid: string | null): RelatedEntityRef['kind'] {
  if (typeQid === 'Q219117') return 'museum'
  if (typeQid === 'Q16970' || typeQid === 'Q4989906') return 'landmark'
  return 'venue'
}

function groupForVenueType(typeQid: string | null): RelatedEntityRef['group'] {
  if (typeQid === 'Q219117') return 'institutions'
  return 'venues'
}

/** Venues / museums / stadiums administratively part of a city item. */
export async function queryVenuesLandmarksForCity(cityQid: string): Promise<RelatedEntityRef[]> {
  const res = await queryWikidataSparql(sparqlVenuesLandmarksMuseumsInCity(cityQid))
  const out: RelatedEntityRef[] = []
  for (const row of res.results.bindings) {
    const id = bindingUriQid(row.item)
    if (!id) continue
    const label = bindingLiteral(row.itemLabel)
    const typeUri = row.t?.type === 'uri' ? row.t.value : ''
    const typeQid = /entity\/(Q\d+)$/.exec(typeUri)?.[1] ?? null
    const displayName = label || id
    out.push({
      id,
      mode: 'earth',
      kind: venueKindFromTypeQid(typeQid),
      name: displayName,
      role: 'In this city (Wikidata)',
      group: groupForVenueType(typeQid),
    })
  }
  return out
}

/** Events with a location or administrative parent at this place. */
export async function queryDatedEventsForPlace(placeQid: string): Promise<TerrisTimelineEvent[]> {
  const res = await queryWikidataSparql(sparqlEventsLocatedAtOrAbout(placeQid))
  const out: TerrisTimelineEvent[] = []
  let i = 0
  for (const row of res.results.bindings) {
    const id = bindingUriQid(row.event)
    const whenRaw = bindingLiteral(row.when)
    const y = yearFromWikidataTimeLiteral(whenRaw)
    if (!id || y === null) continue
    i += 1
    const label = bindingLiteral(row.eventLabel)
    const eventTitle = label || id
    out.push({
      id: `${placeQid}-sparql-event-${id}-${i}`,
      title: eventTitle,
      dateLabel: whenRaw.slice(0, 16),
      year: y,
      type: 'point',
      summary: 'From Wikidata SPARQL (location-linked event).',
      relatedEntityIds: [id],
    })
  }
  return out
}

/** People born in this place (P19). */
export async function queryPeopleBornInPlace(placeQid: string): Promise<RelatedEntityRef[]> {
  const res = await queryWikidataSparql(sparqlRelatedPeopleForPlace(placeQid))
  const out: RelatedEntityRef[] = []
  for (const row of res.results.bindings) {
    const id = bindingUriQid(row.person)
    if (!id) continue
    const label = bindingLiteral(row.personLabel)
    const role = bindingLiteral(row.role) || undefined
    const displayName = label || id
    out.push({
      id,
      mode: 'earth',
      kind: 'person',
      name: displayName,
      role: role || 'Person (Wikidata)',
      group: 'people',
    })
  }
  return out
}

/** Sub-parts or items located within the subject (P361 / P131). */
export async function queryPartsOrLocatedIn(subjectQid: string): Promise<RelatedEntityRef[]> {
  const res = await queryWikidataSparql(sparqlPartsOrLocatedIn(subjectQid))
  const out: RelatedEntityRef[] = []
  for (const row of res.results.bindings) {
    const id = bindingUriQid(row.part)
    if (!id) continue
    const label = bindingLiteral(row.partLabel)
    const displayName = label || id
    out.push({
      id,
      mode: 'earth',
      kind: 'place',
      name: displayName,
      role: 'Related place (Wikidata)',
      group: 'places',
    })
  }
  return out
}

/** Point-in-time / inception / dissolved dates declared on the item. */
export async function queryTimelineDatesForItem(subjectQid: string): Promise<TerrisTimelineEvent[]> {
  const res = await queryWikidataSparql(sparqlDatesForItem(subjectQid))
  const out: TerrisTimelineEvent[] = []
  let i = 0
  for (const row of res.results.bindings) {
    const whenRaw = bindingLiteral(row.time)
    const y = yearFromWikidataTimeLiteral(whenRaw)
    const pLabel = bindingLiteral(row.pLabel) || bindingLiteral(row.p) || 'Date'
    if (y === null) continue
    i += 1
    out.push({
      id: `${subjectQid}-sparql-date-${i}`,
      title: pLabel,
      dateLabel: formatYear(y),
      year: y,
      type: 'point',
      summary: 'From Wikidata SPARQL (dated statement).',
    })
  }
  return out
}

/** Spacecraft / missions whose subject body is this planet (P376). */
export async function queryMissionsForPlanet(planetQid: string): Promise<RelatedEntityRef[]> {
  const res = await queryWikidataSparql(sparqlMissionsForPlanet(planetQid))
  const out: RelatedEntityRef[] = []
  for (const row of res.results.bindings) {
    const id = bindingUriQid(row.m)
    if (!id) continue
    const label = bindingLiteral(row.mLabel)
    const displayName = label || id
    out.push({
      id,
      mode: 'planetary',
      kind: 'mission',
      name: displayName,
      role: 'Mission body (Wikidata)',
      group: 'missions',
    })
  }
  return out
}
