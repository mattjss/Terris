/**
 * Placeholder: interpretive 3D / neural reconstruction providers (mesh, splats, stylized renders).
 * Requires policy review, cost caps, and per-asset provenance before production use.
 */
import type { TerrisMediaItem } from '@/data/types/terrisEntity'

export type AiReconstructionRequest = {
  entityId: string
  prompt?: string
}

/** Returns empty until a provider is configured and approved. */
export async function requestAiReconstructionPlaceholder(
  _req: AiReconstructionRequest,
): Promise<TerrisMediaItem | null> {
  return null
}
