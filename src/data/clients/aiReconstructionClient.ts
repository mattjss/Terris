/**
 * Placeholder hook for interpretive still generation (image models, 3D mesh exports, etc.).
 * Returned `TerrisMediaItem` rows must use `type: 'reconstruction'`, `isInterpretive: true`,
 * and a full `reconstructionMeta` block — see `reconstructionRules` and `reconstructionMediaFactories`.
 */
import type { TerrisMediaItem, TerrisReconstructionMeta } from '@/data/types/terrisEntity'

export type AiReconstructionRequest = {
  entityId: string
  /** Filled from prompt template library + entity context. */
  prompt?: string
  reconstructionMeta?: Partial<TerrisReconstructionMeta>
}

/** Returns null until a provider is configured, approved, and cost-capped. */
export async function requestAiReconstructionPlaceholder(
  _req: AiReconstructionRequest,
): Promise<TerrisMediaItem | null> {
  return null
}
