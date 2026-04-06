/**
 * IIIF Presentation API — fetch a manifest, extract labels, thumbnails, and image bodies as Terris media.
 * Deep-zoom / Image API tiles can be layered on later using the same manifest `@id` / `service` entries.
 */
import type { TerrisMediaItem } from '@/data/types/terrisEntity'
import { integrationFlags } from './integrationConfig'
import { fetchJson } from './fetchHelpers'

export type IiifManifestRef = {
  manifestUrl: string
}

function slugPart(s: string): string {
  return s.replace(/[^\w-]+/g, '_').slice(0, 48)
}

/** IIIF 2/3 label can be string, array, or language map. */
export function iiifLabelToString(label: unknown): string {
  if (label == null) return 'IIIF resource'
  if (typeof label === 'string') return label
  if (Array.isArray(label)) {
    return label
      .map((x) => (typeof x === 'string' ? x : iiifLabelToString(x)))
      .filter(Boolean)
      .join(' ')
  }
  if (typeof label === 'object') {
    const o = label as Record<string, unknown>
    if (Array.isArray(o['@value'])) return String(o['@value'][0] ?? '')
    if (typeof o['@value'] === 'string') return o['@value']
    if (Array.isArray(o.none)) return o.none.map(String).join(' ')
    const en = o.en
    if (Array.isArray(en)) return en.map(String).join(' ')
    if (typeof en === 'string') return en
    const first = Object.values(o).find((v) => typeof v === 'string' || Array.isArray(v))
    if (typeof first === 'string') return first
    if (Array.isArray(first)) return first.map(String).join(' ')
  }
  return 'IIIF resource'
}

const IIIF3_CONTEXTS = new Set([
  'http://iiif.io/api/presentation/3/context.json',
  'https://iiif.io/api/presentation/3/context.json',
])

function isIiif3Manifest(m: Record<string, unknown>): boolean {
  const ctx = m['@context']
  if (typeof ctx === 'string') return IIIF3_CONTEXTS.has(ctx)
  if (Array.isArray(ctx)) return ctx.some((c) => typeof c === 'string' && IIIF3_CONTEXTS.has(c))
  return m.type === 'Manifest' && !('sequences' in m)
}

function firstImageUrlFromIiif3Canvas(canvas: Record<string, unknown>): string | null {
  const items = canvas.items
  if (!Array.isArray(items)) return null
  for (const annoPage of items) {
    if (!annoPage || typeof annoPage !== 'object') continue
    const ap = annoPage as Record<string, unknown>
    const annos = ap.items
    if (!Array.isArray(annos)) continue
    for (const anno of annos) {
      if (!anno || typeof anno !== 'object') continue
      const a = anno as Record<string, unknown>
      const body = a.body
      const bodies = Array.isArray(body) ? body : body ? [body] : []
      for (const b of bodies) {
        if (!b || typeof b !== 'object') continue
        const br = b as Record<string, unknown>
        const id = (br.id as string) ?? (br['@id'] as string)
        const type = String(br.type ?? br['@type'] ?? '')
        if (id && (type === 'Image' || type.endsWith('Image') || /\.(jpg|jpeg|png|tif|tiff|webp)(\?|$)/i.test(id)))
          return id
      }
    }
  }
  return null
}

function firstImageUrlFromIiif2Canvas(canvas: Record<string, unknown>): string | null {
  const images = canvas.images
  if (!Array.isArray(images)) return null
  for (const img of images) {
    if (!img || typeof img !== 'object') continue
    const resource = (img as Record<string, unknown>).resource as Record<string, unknown> | undefined
    if (!resource) continue
    const id = (resource['@id'] as string) ?? (resource.id as string)
    if (id) return id
  }
  return null
}

function thumbnailUrlFromManifest(m: Record<string, unknown>): string | null {
  const th = m.thumbnail
  if (!th) return null
  if (typeof th === 'string') return th
  if (Array.isArray(th) && th[0] && typeof th[0] === 'object') {
    const t0 = th[0] as Record<string, unknown>
    return (t0.id as string) ?? (t0['@id'] as string) ?? null
  }
  if (typeof th === 'object') {
    const t = th as Record<string, unknown>
    return (t.id as string) ?? (t['@id'] as string) ?? null
  }
  return null
}

/**
 * Parse a Presentation 2 or 3 JSON manifest into Terris media rows (manifest thumbnail + canvas images).
 */
export function parseIiifManifestToTerrisMedia(
  manifest: unknown,
  manifestUrl: string,
  entityIdPrefix: string,
): TerrisMediaItem[] {
  if (!manifest || typeof manifest !== 'object') return []
  const m = manifest as Record<string, unknown>
  const manifestLabel = iiifLabelToString(m.label ?? m['@id'] ?? manifestUrl)
  const baseId = `${entityIdPrefix}-iiif`

  const out: TerrisMediaItem[] = []
  const thumb = thumbnailUrlFromManifest(m)
  if (thumb) {
    out.push({
      id: `${baseId}-thumb`,
      type: 'image',
      title: `${manifestLabel} (thumbnail)`,
      sourceName: 'IIIF manifest',
      url: thumb,
      thumbnailUrl: thumb,
      caption: manifestLabel,
      credit: 'IIIF provider — see manifest rights',
      license: undefined,
      isInterpretive: false,
    })
  }

  if (isIiif3Manifest(m)) {
    const items = m.items
    if (Array.isArray(items)) {
      items.forEach((canvas, idx) => {
        if (!canvas || typeof canvas !== 'object') return
        const c = canvas as Record<string, unknown>
        const label = iiifLabelToString(c.label ?? `Canvas ${idx + 1}`)
        const imgUrl = firstImageUrlFromIiif3Canvas(c)
        if (!imgUrl) return
        out.push({
          id: `${baseId}-canvas-${idx}-${slugPart(label)}`,
          type: 'image',
          title: label,
          sourceName: 'IIIF manifest',
          url: imgUrl,
          thumbnailUrl: thumb ?? imgUrl,
          caption: label,
          credit: 'IIIF provider — see manifest rights',
          license: undefined,
          isInterpretive: false,
        })
      })
    }
    return dedupeByUrl(out)
  }

  // IIIF 2
  const sequences = m.sequences
  if (Array.isArray(sequences)) {
    for (const seq of sequences) {
      if (!seq || typeof seq !== 'object') continue
      const canvases = (seq as Record<string, unknown>).canvases
      if (!Array.isArray(canvases)) continue
      canvases.forEach((canvas, idx) => {
        if (!canvas || typeof canvas !== 'object') return
        const c = canvas as Record<string, unknown>
        const label = iiifLabelToString(c.label ?? `Canvas ${idx + 1}`)
        const imgUrl = firstImageUrlFromIiif2Canvas(c)
        if (!imgUrl) return
        out.push({
          id: `${baseId}-canvas-${idx}-${slugPart(label)}`,
          type: 'image',
          title: label,
          sourceName: 'IIIF manifest',
          url: imgUrl,
          thumbnailUrl: thumb ?? imgUrl,
          caption: label,
          credit: 'IIIF provider — see manifest rights',
          license: undefined,
          isInterpretive: false,
        })
      })
    }
  }

  return dedupeByUrl(out)
}

function dedupeByUrl(items: TerrisMediaItem[]): TerrisMediaItem[] {
  const seen = new Set<string>()
  return items.filter((it) => {
    if (seen.has(it.url)) return false
    seen.add(it.url)
    return true
  })
}

/**
 * Fetch a manifest URL and return Terris media items (or [] when live mode is off).
 */
export async function fetchIiifManifestTerrisMedia(
  manifestUrl: string,
  entityIdPrefix: string,
): Promise<TerrisMediaItem[]> {
  if (!integrationFlags.iiifLive) return []
  const manifest = await fetchJson<unknown>(manifestUrl)
  return parseIiifManifestToTerrisMedia(manifest, manifestUrl, entityIdPrefix)
}

/** @deprecated Use `fetchIiifManifestTerrisMedia` */
export async function fetchIiifManifestPlaceholder(ref: IiifManifestRef): Promise<unknown> {
  if (!integrationFlags.iiifLive) return null
  return fetchJson<unknown>(ref.manifestUrl)
}

/** Reserved for Image API `info.json` + tile math. */
export async function fetchIiifImageInfoPlaceholder(_imageUrl: string): Promise<unknown> {
  return null
}
