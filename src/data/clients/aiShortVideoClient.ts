/**
 * Placeholder: short-form AI-generated video clips (B-roll, flythrough previews).
 * Distinct from documentary video; must carry `isInterpretive` and disclosure in UI.
 */
import type { TerrisMediaItem } from '@/data/types/terrisEntity'

export type AiShortVideoRequest = {
  entityId: string
  scriptHint?: string
  durationSec?: number
}

export async function requestAiShortVideoPlaceholder(
  _req: AiShortVideoRequest,
): Promise<TerrisMediaItem | null> {
  return null
}
