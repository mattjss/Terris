import { useId, useMemo, useState } from 'react'
import type { TerrisMediaItem } from '@/data/types/terrisEntity'
import { partitionMedia } from '@/ui/mediaGalleryModel'

export type MediaGalleryProps = {
  media: TerrisMediaItem[]
  /** When true, show only non-interpretive items (Media tab). */
  documentaryOnly?: boolean
  className?: string
}

function MediaBadge({ item }: { item: TerrisMediaItem }) {
  if (item.isInterpretive) {
    return (
      <span className="terris-media-gallery__badge terris-media-gallery__badge--ai">
        AI reconstruction
      </span>
    )
  }
  if (item.type === 'archival') {
    return <span className="terris-media-gallery__badge terris-media-gallery__badge--archival">Archival</span>
  }
  return <span className="terris-media-gallery__badge">Historical source</span>
}

export function MediaGallery({ media, documentaryOnly = false, className }: MediaGalleryProps) {
  const uid = useId()
  const list = useMemo(() => {
    if (!documentaryOnly) return media
    return partitionMedia(media).documentary
  }, [media, documentaryOnly])

  const [activeId, setActiveId] = useState<string | null>(() => list[0]?.id ?? null)

  const active = useMemo(() => {
    if (list.length === 0) return null
    if (activeId) {
      const found = list.find((m) => m.id === activeId)
      if (found) return found
    }
    return list[0]!
  }, [list, activeId])

  if (list.length === 0) {
    return (
      <p className="terris-entity-panel__empty terris-media-gallery__empty">
        No media attached yet. Wikimedia, IIIF, and Mapillary can hydrate this list.
      </p>
    )
  }

  return (
    <div className={['terris-media-gallery', className ?? ''].filter(Boolean).join(' ')}>
      {active ? (
        <figure className="terris-media-gallery__hero">
          <div className="terris-media-gallery__hero-frame">
            {active.type === 'video' ? (
              <video
                className="terris-media-gallery__hero-media"
                controls
                playsInline
                poster={active.thumbnailUrl}
                src={active.url}
              />
            ) : (
              <img
                className="terris-media-gallery__hero-media"
                src={active.thumbnailUrl ?? active.url}
                alt={active.title}
                loading="lazy"
              />
            )}
            <div className="terris-media-gallery__hero-badges">
              <MediaBadge item={active} />
              <span className="terris-media-gallery__type-pill">{active.type}</span>
            </div>
          </div>
          <figcaption className="terris-media-gallery__hero-cap">
            <span className="terris-media-gallery__hero-title">{active.title}</span>
            <span className="terris-media-gallery__hero-source">{active.sourceName}</span>
            {active.license ? (
              <span className="terris-media-gallery__hero-license">{active.license}</span>
            ) : null}
            {active.caption ? (
              <p className="terris-media-gallery__hero-caption">{active.caption}</p>
            ) : null}
            <p className="terris-media-gallery__hero-credit">{active.credit}</p>
          </figcaption>
        </figure>
      ) : null}

      {list.length > 1 ? (
        <div
          className="terris-media-gallery__strip"
          role="tablist"
          aria-label="More media"
        >
          {list.map((m) => {
            const selected = active?.id === m.id
            return (
              <button
                key={m.id}
                type="button"
                id={`${uid}-thumb-${m.id}`}
                className={
                  'terris-media-gallery__thumb' +
                  (selected ? ' terris-media-gallery__thumb--active' : '')
                }
                onClick={() => setActiveId(m.id)}
                aria-current={selected}
              >
                {m.type === 'video' ? (
                  <span className="terris-media-gallery__thumb-video" aria-hidden>
                    ▶
                  </span>
                ) : (
                  <img
                    src={m.thumbnailUrl ?? m.url}
                    alt=""
                    className="terris-media-gallery__thumb-img"
                    loading="lazy"
                  />
                )}
                <span className="terris-media-gallery__thumb-label">{m.title}</span>
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
