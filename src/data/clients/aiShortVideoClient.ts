/**
 * Legacy placeholder name — prefer `interpretiveVideoArchitecture` for educational clips.
 * Short interpretive clips must use `isInterpretive: true` and `interpretiveVideoMeta`.
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
