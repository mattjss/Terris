/**
 * Types for the English Wikipedia REST API (`/api/rest_v1/`) and, optionally,
 * the MediaWiki Action API (`w/api.php`). See `wikipediaClient.ts` for URLs.
 */

/** https://en.wikipedia.org/api/rest_v1/#/Page%20content/get_page_summary__title_ */
export type WikipediaPageSummary = {
  type: string
  title: string
  displaytitle: string
  extract: string
  extract_html?: string
  lang: string
  content_urls?: {
    desktop: { page: string }
    mobile: { page: string }
  }
  thumbnail?: {
    source: string
    width: number
    height: number
  }
  coordinates?: { lat: number; lon: number; primary?: string; globe?: string }[]
}

/** Minimal row from `action=query&list=search` (MediaWiki). */
export type WikipediaSearchResult = {
  ns: number
  title: string
  pageid: number
  size?: number
  wordcount?: number
  snippet?: string
  timestamp?: string
}

export type WikipediaSearchResponse = {
  query?: {
    search?: WikipediaSearchResult[]
  }
}
