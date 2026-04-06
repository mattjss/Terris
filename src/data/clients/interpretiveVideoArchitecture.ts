/**
 * Architecture for short interpretive educational clips (5–15s).
 * No video generation provider is integrated yet — callers receive structured placeholders
 * so a future `provider.generateClip(request)` can plug in without UI rewrites.
 */
import type { TerrisInterpretiveVideoMeta, TerrisMediaItem } from '@/data/types/terrisEntity'

/** Educational clips target this length band for classroom use. */
export const INTERPRETIVE_CLIP_DURATION_SECONDS = { min: 5, max: 15 } as const

export type InterpretiveVideoGenerationRequest = {
  entityId: string
  title: string
  /** Mirrors reconstruction framing — what the clip should depict. */
  educationalBrief: string
  historicalPeriod?: string
  /** Optional link to prompt template id. */
  promptTemplateId?: string
}

/**
 * Future hook: replace body with `await provider.generateClip(request)` when approved.
 * Returns null — UI uses `buildInterpretiveVideoPlaceholder` for mock data instead.
 */
export async function requestInterpretiveEducationalClip(
  _request: InterpretiveVideoGenerationRequest,
): Promise<TerrisMediaItem | null> {
  return null
}

/** Build a `TerrisMediaItem` row for the UI before any file exists. */
export function buildInterpretiveVideoPlaceholder(args: {
  id: string
  title: string
  thumbnailUrl: string
  caption: string
  credit: string
  description: string
  whatIsUncertain?: string
  sourceName?: string
}): TerrisMediaItem {
  return {
    id: args.id,
    type: 'video',
    isInterpretive: true,
    title: args.title,
    sourceName: args.sourceName ?? 'Terris · interpretive clip (pending)',
    url: '',
    thumbnailUrl: args.thumbnailUrl,
    caption: args.caption,
    credit: args.credit,
    license: 'Pending generation',
    interpretiveVideoMeta: {
      targetDurationSeconds: { ...INTERPRETIVE_CLIP_DURATION_SECONDS },
      generationStatus: 'placeholder',
      description: args.description,
      whatIsUncertain: args.whatIsUncertain,
    },
  }
}

export function isInterpretiveVideoPending(item: TerrisMediaItem): boolean {
  return Boolean(
    item.isInterpretive &&
      item.interpretiveVideoMeta &&
      item.interpretiveVideoMeta.generationStatus !== 'ready',
  )
}

export function interpretiveVideoMetaOrDefault(
  partial?: Partial<TerrisInterpretiveVideoMeta>,
): TerrisInterpretiveVideoMeta {
  return {
    targetDurationSeconds: partial?.targetDurationSeconds ?? {
      ...INTERPRETIVE_CLIP_DURATION_SECONDS,
    },
    generationStatus: partial?.generationStatus ?? 'placeholder',
    description: partial?.description ?? '',
    whatIsUncertain: partial?.whatIsUncertain,
  }
}
