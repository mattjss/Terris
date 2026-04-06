/**
 * Parameterized SPARQL strings for Terris enrichment — keep queries conservative for WDQS timeouts.
 * Bindings assume `en` labels via wikibase:label.
 */

export function sparqlVenuesLandmarksMuseumsInCity(cityQid: string): string {
  return `
SELECT ?item ?itemLabel ?t WHERE {
  ?item wdt:P131 wd:${cityQid} .
  ?item wdt:P31 ?t .
  VALUES ?t { wd:Q483453 wd:Q16970 wd:Q219117 wd:Q570116 }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT 14`
}

export function sparqlEventsLocatedAtOrAbout(placeQid: string): string {
  return `
SELECT ?event ?eventLabel ?when WHERE {
  { ?event wdt:P276 wd:${placeQid} . } UNION { ?event wdt:P131 wd:${placeQid} . }
  OPTIONAL { ?event wdt:P585 ?t1 . }
  OPTIONAL { ?event wdt:P580 ?t2 . }
  BIND(COALESCE(?t1, ?t2) AS ?when)
  FILTER(BOUND(?when))
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT 18`
}

export function sparqlRelatedPeopleForPlace(placeQid: string): string {
  return `
SELECT ?person ?personLabel ?role WHERE {
  ?person wdt:P19 wd:${placeQid} .
  ?person wdt:P31 wd:Q5 .
  BIND("Born here" AS ?role)
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT 10`
}

/** Robotic / crewed missions whose astronomical body is this planet (e.g. Mars Q111). */
export function sparqlMissionsForPlanet(planetQid: string): string {
  return `
SELECT ?m ?mLabel WHERE {
  ?m wdt:P376 wd:${planetQid} .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT 14`
}

/** Point-in-time or inception for subject item — timeline hints */
export function sparqlDatesForItem(subjectQid: string): string {
  return `
SELECT ?item ?itemLabel ?p ?pLabel ?time WHERE {
  VALUES ?p { wd:P585 wd:P571 wd:P580 wd:P582 }
  wd:${subjectQid} ?p ?time .
  BIND(wd:${subjectQid} AS ?item)
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT 25`
}

/** Things that are part of or located in the subject (e.g. city parts) */
export function sparqlPartsOrLocatedIn(subjectQid: string): string {
  return `
SELECT ?part ?partLabel WHERE {
  { ?part wdt:P361 wd:${subjectQid} . } UNION { ?part wdt:P131 wd:${subjectQid} . }
  FILTER(STRSTARTS(STR(?part), "http://www.wikidata.org/entity/Q"))
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT 12`
}
