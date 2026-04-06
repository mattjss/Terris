/**
 * Wikibase REST API (v0) — item documents are JSON objects with labels, descriptions, statements.
 * https://doc.wikimedia.org/Wikibase/master/js/rest-api/
 *
 * The exact statement shape evolves; adapters treat this as an untyped document and parse defensively.
 */
export type WikibaseRestEntityDocument = Record<string, unknown>
