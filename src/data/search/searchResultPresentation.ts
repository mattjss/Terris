import type { TerrisEntity, TerrisMediaItem } from '@/data/types/terrisEntity'

function firstDocumentaryImageUrl(media: TerrisMediaItem[]): string | null {
  for (const m of media) {
    if (m.isInterpretive) continue
    if (m.type === 'video') {
      if (m.thumbnailUrl) return m.thumbnailUrl
      continue
    }
    const u = m.thumbnailUrl ?? m.url
    if (u && !u.toLowerCase().endsWith('.mp4')) return u
  }
  return null
}

/** Prefer a still for search cards; falls back to null for gradient placeholder. */
export function getEntitySearchThumbnailUrl(entity: TerrisEntity): string | null {
  return firstDocumentaryImageUrl(entity.media)
}

/** One line for place hierarchy or scale context. */
export function formatEntityLocationLine(entity: TerrisEntity): string | null {
  const parts = [entity.placeName, entity.regionName, entity.countryName].filter(
    (x): x is string => Boolean(x),
  )
  if (parts.length > 0) return [...new Set(parts)].join(' · ')
  if (entity.mode === 'planetary') return 'Solar system'
  if (entity.mode === 'cosmic') return 'Universe · Local Group'
  return null
}

export function truncateSearchTeaser(text: string, maxChars: number): string {
  const t = text.trim()
  if (t.length <= maxChars) return t
  return `${t.slice(0, Math.max(0, maxChars - 1)).trim()}…`
}

export function exploreModeLabel(mode: TerrisEntity['mode']): string {
  if (mode === 'earth') return 'Earth'
  if (mode === 'planetary') return 'Planetary'
  return 'Cosmic'
}
