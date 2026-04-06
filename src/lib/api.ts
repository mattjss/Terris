import type { HistoricalEntity } from '@/data/historical'

export function getApiBase(): string | undefined {
  const raw = import.meta.env.VITE_API_URL
  if (!raw || typeof raw !== 'string') return undefined
  const t = raw.trim()
  return t.length > 0 ? t.replace(/\/$/, '') : undefined
}

export async function fetchEntitiesFromApi(): Promise<HistoricalEntity[] | null> {
  const base = getApiBase()
  if (!base) return null
  try {
    const r = await fetch(`${base}/entities`)
    if (!r.ok) return null
    return (await r.json()) as HistoricalEntity[]
  } catch {
    return null
  }
}

export async function searchEntitiesApi(
  q: string,
): Promise<HistoricalEntity[] | null> {
  const base = getApiBase()
  if (!base || !q.trim()) return null
  try {
    const r = await fetch(
      `${base}/search?q=${encodeURIComponent(q.trim())}`,
    )
    if (!r.ok) return null
    return (await r.json()) as HistoricalEntity[]
  } catch {
    return null
  }
}

export async function aiSearchApi(q: string): Promise<{
  results: HistoricalEntity[]
  method: 'vector' | 'llm'
} | null> {
  const base = getApiBase()
  if (!base || !q.trim()) return null
  try {
    const r = await fetch(`${base}/ai/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: q.trim() }),
    })
    if (!r.ok) return null
    const data = (await r.json()) as {
      results: HistoricalEntity[]
      method: 'vector' | 'llm'
    }
    return data
  } catch {
    return null
  }
}

export async function aiSummarizeApi(body: {
  entityId?: string
  year?: number
  q?: string
}): Promise<{ text: string; disclaimer: string } | null> {
  const base = getApiBase()
  if (!base) return null
  try {
    const r = await fetch(`${base}/ai/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!r.ok) return null
    return (await r.json()) as { text: string; disclaimer: string }
  } catch {
    return null
  }
}
