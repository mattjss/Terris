/**
 * English Wikipedia — MediaWiki REST API v1 + Action API search.
 * Read-only, no API key. Enable via `VITE_WIKIPEDIA_LIVE=true`.
 */
import type { WikipediaPageSummary, WikipediaSearchResponse } from '@/data/types/wikipedia'
import { integrationFlags } from './integrationConfig'
import { fetchJson, withQuery } from './fetchHelpers'

const REST_BASE = 'https://en.wikipedia.org/api/rest_v1'
const ACTION_BASE = 'https://en.wikipedia.org/w/api.php'

const MOCK_SUMMARY: WikipediaPageSummary = {
  type: 'standard',
  title: 'Mock article',
  displaytitle: 'Mock article',
  extract:
    'This is mock Wikipedia content. Set VITE_WIKIPEDIA_LIVE=true to load real summaries from the English Wikipedia REST API.',
  lang: 'en',
  content_urls: {
    desktop: { page: 'https://en.wikipedia.org/wiki/Mock' },
    mobile: { page: 'https://en.m.wikipedia.org/wiki/Mock' },
  },
}

const MOCK_SEARCH: WikipediaSearchResponse = {
  query: {
    search: [
      { ns: 0, title: 'Ancient Rome', pageid: 1 },
      { ns: 0, title: 'Roman Empire', pageid: 2 },
    ],
  },
}

async function getWikipediaSummaryLive(title: string): Promise<WikipediaPageSummary> {
  const enc = encodeURIComponent(title.replace(/ /g, '_'))
  const url = `${REST_BASE}/page/summary/${enc}`
  return fetchJson<WikipediaPageSummary>(url)
}

async function searchWikipediaLive(query: string): Promise<WikipediaSearchResponse> {
  const url = withQuery(ACTION_BASE, {
    action: 'query',
    list: 'search',
    format: 'json',
    srsearch: query,
    srlimit: 10,
  })
  return fetchJson<WikipediaSearchResponse>(url)
}

export async function getWikipediaSummary(title: string): Promise<WikipediaPageSummary> {
  if (!integrationFlags.wikipediaLive) {
    return { ...MOCK_SUMMARY, title, displaytitle: title }
  }
  return getWikipediaSummaryLive(title)
}

export async function searchWikipedia(query: string): Promise<WikipediaSearchResponse> {
  if (!integrationFlags.wikipediaLive) {
    return MOCK_SEARCH
  }
  return searchWikipediaLive(query)
}
