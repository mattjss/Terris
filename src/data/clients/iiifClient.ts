/**
 * Placeholder: IIIF Presentation API manifests and Image API info.json for deep-zoom assets.
 * Future: resolve `@id` tiles, attribution from `seeAlso` / `metadata` blocks.
 */
export type IiifManifestRef = {
  manifestUrl: string
}

export async function fetchIiifManifestPlaceholder(_ref: IiifManifestRef): Promise<unknown> {
  return null
}

export async function fetchIiifImageInfoPlaceholder(_imageUrl: string): Promise<unknown> {
  return null
}
