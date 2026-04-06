import type { TerrisMediaItem, TerrisReconstructionMeta } from '@/data/types/terrisEntity'

/** Validated still reconstruction row for editorial catalogs. */
export function buildInterpretiveReconstructionStill(args: {
  id: string
  title: string
  url: string
  thumbnailUrl?: string
  caption: string
  credit: string
  license?: string
  sourceName?: string
  reconstructionMeta: TerrisReconstructionMeta
}): TerrisMediaItem {
  return {
    id: args.id,
    type: 'reconstruction',
    isInterpretive: true,
    title: args.title,
    sourceName: args.sourceName ?? 'Terris · interpretive reconstruction',
    url: args.url,
    thumbnailUrl: args.thumbnailUrl ?? args.url,
    caption: args.caption,
    credit: args.credit,
    license: args.license,
    reconstructionMeta: args.reconstructionMeta,
  }
}
