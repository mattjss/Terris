import type { TerrisMediaItem } from '@/data/types/terrisEntity'

export function partitionMedia(media: TerrisMediaItem[]) {
  const documentary = media.filter((m) => !m.isInterpretive)
  const interpretive = media.filter((m) => m.isInterpretive)
  return { documentary, interpretive }
}

const HERO_TYPE_ORDER: Record<TerrisMediaItem['type'], number> = {
  image: 0,
  archival: 1,
  video: 2,
  reconstruction: 3,
}

/** First documentary asset for hero strip — prefers stills, then archival, then video. */
export function pickHeroMedia(media: TerrisMediaItem[]): TerrisMediaItem | null {
  const { documentary } = partitionMedia(media)
  if (documentary.length === 0) return null
  return [...documentary].sort(
    (a, b) => HERO_TYPE_ORDER[a.type] - HERO_TYPE_ORDER[b.type],
  )[0]!
}
