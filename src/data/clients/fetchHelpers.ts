/**
 * Thin typed wrappers around `fetch` for JSON APIs.
 *
 * **CORS:** Wikipedia / Wikidata / raw GitHub URLs often allow browser origins for GET,
 * but corporate networks or strict CSP may block them. If live mode fails in the browser,
 * add a same-origin proxy in the Fastify server (`server/`) and point helpers at `/api/proxy/...`
 * — the types and parsing stay the same; only the URL changes.
 */

export class HttpError extends Error {
  status: number
  url: string

  constructor(message: string, status: number, url: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.url = url
  }
}

export async function fetchJson<T>(url: string | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json, application/geo+json;q=0.9, */*;q=0.8',
      ...init?.headers,
    },
  })
  if (!res.ok) {
    throw new HttpError(`HTTP ${res.status}: ${res.statusText}`, res.status, String(url))
  }
  return res.json() as Promise<T>
}

/** Append query parameters to a full URL string. */
export function withQuery(base: string, params: Record<string, string | number | undefined>): string {
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) sp.set(k, String(v))
  }
  const q = sp.toString()
  return q ? `${base}?${q}` : base
}
