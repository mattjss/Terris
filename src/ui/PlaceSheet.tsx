import { useEffect, useId, useMemo, useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@base-ui/react/button'
import { Tabs } from '@base-ui/react/tabs'
import { getMockEntityById } from '@/data/services/entityService'
import type { RelatedEntityRef, TerrisEntity, TerrisMediaItem } from '@/data/types/terrisEntity'
import type { ContextMode } from '@/state/educationalContextTypes'
import { partitionMedia, pickHeroMedia } from '@/ui/mediaGalleryModel'
import { MediaGallery } from '@/ui/MediaGallery'
import {
  formatCoords,
  formatEntityKindLabel,
  formatEntityYearRange,
  formatTimelineWhen,
  groupRelatedByKind,
  resolveNearbyRefs,
  sortTimelineChronological,
} from '@/ui/placeSheetHelpers'
import type { PlaceSheetProps, PlaceSheetTabId } from '@/ui/placeSheetTypes'
import { PLACE_SHEET_TABS } from '@/ui/placeSheetTypes'
import { useEducationalContext } from '@/hooks/useEducationalContext'

export type { PlaceSheetProps, PlaceSheetTabId } from '@/ui/placeSheetTypes'

function PlaceSheetHero({
  media,
  headline,
}: {
  media: TerrisMediaItem | null
  headline: string
}) {
  if (!media) {
    return (
      <div className="terris-place-sheet__hero terris-place-sheet__hero--empty" aria-hidden>
        <div className="terris-place-sheet__hero-empty-grid" />
        <span className="terris-place-sheet__hero-empty-title">{headline}</span>
      </div>
    )
  }

  const src = media.thumbnailUrl ?? media.url
  const isVideo = media.type === 'video'

  return (
    <figure className="terris-place-sheet__hero">
      <div className="terris-place-sheet__hero-frame">
        {isVideo ? (
          <img
            className="terris-place-sheet__hero-media"
            src={src}
            alt=""
            loading="lazy"
          />
        ) : (
          <img
            className="terris-place-sheet__hero-media"
            src={src}
            alt={media.title}
            loading="lazy"
          />
        )}
        {isVideo ? (
          <span className="terris-place-sheet__hero-play" aria-hidden>
            ▶
          </span>
        ) : null}
        <div className="terris-place-sheet__hero-scrim" aria-hidden />
        <span className="terris-place-sheet__hero-kind">
          {media.type === 'archival'
            ? 'Archival'
            : media.type === 'video'
              ? 'Motion'
              : 'Photograph'}
        </span>
      </div>
      <figcaption className="terris-place-sheet__hero-cap">
        <span className="terris-place-sheet__hero-fig-title">{media.title}</span>
        <span className="terris-place-sheet__hero-fig-src">{media.sourceName}</span>
      </figcaption>
    </figure>
  )
}

function EntityMetadataBlock({
  entity,
  compact,
}: {
  entity: TerrisEntity
  compact?: boolean
}) {
  const coords = formatCoords(entity.coords)
  const era = formatEntityYearRange(entity)
  const modeLabel = entity.mode.charAt(0).toUpperCase() + entity.mode.slice(1)

  if (compact) {
    return (
      <dl className="terris-place-sheet__meta-block terris-place-sheet__meta-block--compact">
        <dt className="terris-place-sheet__meta-k">Era</dt>
        <dd className="terris-place-sheet__meta-v">{era}</dd>
        {entity.placeName ? (
          <>
            <dt className="terris-place-sheet__meta-k">Place</dt>
            <dd className="terris-place-sheet__meta-v">{entity.placeName}</dd>
          </>
        ) : null}
        {entity.regionName ? (
          <>
            <dt className="terris-place-sheet__meta-k">Region</dt>
            <dd className="terris-place-sheet__meta-v">{entity.regionName}</dd>
          </>
        ) : null}
        {entity.countryName ? (
          <>
            <dt className="terris-place-sheet__meta-k">Country</dt>
            <dd className="terris-place-sheet__meta-v">{entity.countryName}</dd>
          </>
        ) : null}
      </dl>
    )
  }

  return (
    <dl className="terris-place-sheet__meta-block">
      <dt className="terris-place-sheet__meta-k">Kind</dt>
      <dd className="terris-place-sheet__meta-v">{formatEntityKindLabel(entity.type)}</dd>
      <dt className="terris-place-sheet__meta-k">Mode</dt>
      <dd className="terris-place-sheet__meta-v">{modeLabel}</dd>
      <dt className="terris-place-sheet__meta-k">Era</dt>
      <dd className="terris-place-sheet__meta-v">{era}</dd>
      {entity.placeName ? (
        <>
          <dt className="terris-place-sheet__meta-k">Place</dt>
          <dd className="terris-place-sheet__meta-v">{entity.placeName}</dd>
        </>
      ) : null}
      {entity.regionName ? (
        <>
          <dt className="terris-place-sheet__meta-k">Region</dt>
          <dd className="terris-place-sheet__meta-v">{entity.regionName}</dd>
        </>
      ) : null}
      {entity.countryName ? (
        <>
          <dt className="terris-place-sheet__meta-k">Country</dt>
          <dd className="terris-place-sheet__meta-v">{entity.countryName}</dd>
        </>
      ) : null}
      {coords ? (
        <>
          <dt className="terris-place-sheet__meta-k terris-place-sheet__meta-k--wide">Coordinates</dt>
          <dd className="terris-place-sheet__meta-v terris-place-sheet__meta-v--wide">{coords}</dd>
        </>
      ) : null}
    </dl>
  )
}

export function PlaceSheet({
  entity,
  onClose,
  onFocusGlobe,
  onJumpToEra,
  onOpenRelatedEntity,
  className,
}: PlaceSheetProps) {
  const uid = useId()
  const titleId = `${uid}-title`
  const panelId = `${uid}-panel`
  const [tab, setTab] = useState<PlaceSheetTabId>('overview')

  const {
    contextMode,
    visiblePlaceSheetTabs,
    metadataCompact,
    overviewShowsFullStory,
    profile,
  } = useEducationalContext()

  const tabDefs = useMemo(
    () => PLACE_SHEET_TABS.filter((t) => visiblePlaceSheetTabs.includes(t.id)),
    [visiblePlaceSheetTabs],
  )

  const empty = entity === null

  const tabKey = visiblePlaceSheetTabs.join('|')
  useEffect(() => {
    if (!visiblePlaceSheetTabs.includes(tab)) {
      setTab(visiblePlaceSheetTabs[0] ?? 'overview')
    }
  }, [entity?.id, tab, tabKey, visiblePlaceSheetTabs])

  const timelineSorted = useMemo(
    () => (entity ? sortTimelineChronological(entity.timeline) : []),
    [entity],
  )

  const relatedGroups = useMemo(
    () => (entity ? groupRelatedByKind(entity.relatedEntities) : []),
    [entity],
  )

  const nearbyRefs = useMemo(
    () => (entity ? resolveNearbyRefs(entity) : []),
    [entity],
  )

  const heroMedia = useMemo(
    () => (entity ? pickHeroMedia(entity.media) : null),
    [entity],
  )

  return (
    <aside
      className={[
        'terris-place-sheet',
        empty ? 'terris-place-sheet--empty' : '',
        `terris-place-sheet--ctx-${contextMode}`,
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="complementary"
      aria-labelledby={empty ? undefined : titleId}
      aria-label={empty ? 'Entity details' : undefined}
    >
      <div className="terris-place-sheet__inner">
        {onClose ? (
          <Button
            type="button"
            className="terris-place-sheet__close"
            onClick={onClose}
            aria-label="Close entity details"
          >
            <X className="size-4" aria-hidden />
          </Button>
        ) : null}

        {empty ? (
          <div className="terris-place-sheet__empty">
            <div className="terris-place-sheet__empty-icon" aria-hidden>
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.35"
                />
                <path
                  d="M24 8c-4 8-8 14-8 22a8 8 0 0 0 16 0c0-8-4-14-8-22Z"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinejoin="round"
                  opacity="0.5"
                />
                <circle cx="24" cy="26" r="3" fill="currentColor" opacity="0.25" />
              </svg>
            </div>
            <h2 className="terris-place-sheet__empty-title">No entity selected</h2>
            <p className="terris-place-sheet__empty-lede">{profile.emptyPlaceTeaser}</p>
            <p className="terris-place-sheet__empty-hint">
              Tap a marker or search when you are ready.
            </p>
          </div>
        ) : (
          <>
            <PlaceSheetHero media={heroMedia} headline={entity.name} />

            <header className="terris-place-sheet__header terris-place-sheet__header--editorial">
              <h2 id={titleId} className="terris-place-sheet__title">
                {entity.name}
              </h2>
              <EntityMetadataBlock entity={entity} compact={metadataCompact} />
              <p className="terris-place-sheet__deck">{entity.summary}</p>
            </header>

            <Tabs.Root
              value={tab}
              onValueChange={(v) => setTab(v as PlaceSheetTabId)}
              className="flex min-h-0 flex-1 flex-col gap-0"
            >
              <Tabs.List
                aria-label="Entity sections"
                className="terris-place-sheet__tabs w-full shrink-0 justify-start border border-white/6 bg-black/[0.28] p-1"
              >
                {tabDefs.map((t) => (
                  <Tabs.Tab key={t.id} value={t.id} id={`${uid}-tab-${t.id}`}>
                    {t.label}
                  </Tabs.Tab>
                ))}
              </Tabs.List>

              {tabDefs.map((t) => (
                <Tabs.Panel
                  key={t.id}
                  value={t.id}
                  id={`${panelId}-${t.id}`}
                  className="mt-0 flex min-h-0 flex-1 flex-col overflow-hidden outline-none"
                >
                  <div className="terris-place-sheet__panel terris-place-sheet__panel--scroll min-h-0 flex-1 overflow-y-auto">
                    <div className="pr-2 pb-1">
                      <PlaceSheetPanelBody
                        tab={t.id}
                        entity={entity}
                        contextMode={contextMode}
                        overviewShowsFullStory={overviewShowsFullStory}
                        onOpenRelatedEntity={onOpenRelatedEntity}
                        timelineSorted={timelineSorted}
                        relatedGroups={relatedGroups}
                        nearbyRefs={nearbyRefs}
                      />
                    </div>
                  </div>
                </Tabs.Panel>
              ))}
            </Tabs.Root>

            <div className="terris-place-sheet__actions">
              <button
                type="button"
                className="terris-place-sheet__cta terris-place-sheet__cta--primary"
                disabled={!onFocusGlobe}
                onClick={onFocusGlobe}
              >
                Focus on globe
              </button>
              <button
                type="button"
                className="terris-place-sheet__cta terris-place-sheet__cta--secondary"
                disabled={!onJumpToEra}
                onClick={onJumpToEra}
              >
                Jump to era
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  )
}

function PlaceSheetPanelBody({
  tab,
  entity,
  contextMode,
  overviewShowsFullStory,
  onOpenRelatedEntity,
  timelineSorted,
  relatedGroups,
  nearbyRefs,
}: {
  tab: PlaceSheetTabId
  entity: TerrisEntity
  contextMode: ContextMode
  overviewShowsFullStory: boolean
  onOpenRelatedEntity?: (entityId: string) => void
  timelineSorted: ReturnType<typeof sortTimelineChronological>
  relatedGroups: ReturnType<typeof groupRelatedByKind>
  nearbyRefs: RelatedEntityRef[]
}) {
  switch (tab) {
    case 'overview':
      if (!overviewShowsFullStory) {
        return (
          <div className="terris-entity-panel terris-entity-panel--overview">
            <h3 className="terris-entity-panel__section-label">At a glance</h3>
            <p className="terris-entity-panel__body">{entity.summary}</p>
          </div>
        )
      }
      return (
        <div className="terris-entity-panel terris-entity-panel--overview">
          <h3 className="terris-entity-panel__section-label">Full story</h3>
          <p className="terris-entity-panel__body">{entity.fullDescription}</p>
        </div>
      )
    case 'timeline':
      return (
        <ul className="terris-entity-timeline">
          {timelineSorted.length === 0 ? (
            <li className="terris-entity-panel__empty">No dated events yet.</li>
          ) : (
            timelineSorted.map((e) => (
              <li key={e.id} className="terris-entity-timeline__item">
                <div className="terris-entity-timeline__rail" aria-hidden />
                <div className="terris-entity-timeline__content">
                  <p className="terris-entity-timeline__when">{formatTimelineWhen(e)}</p>
                  <p className="terris-entity-timeline__label">{e.label}</p>
                  {e.summary ? (
                    <p className="terris-entity-timeline__summary">{e.summary}</p>
                  ) : null}
                </div>
              </li>
            ))
          )}
        </ul>
      )
    case 'facts': {
      const facts =
        contextMode === 'family' ? entity.facts.slice(0, 6) : entity.facts
      return (
        <div
          className={
            'terris-entity-facts terris-entity-facts--grid' +
            (contextMode === 'family' ? ' terris-entity-facts--family' : '')
          }
        >
          {facts.length === 0 ? (
            <p className="terris-entity-panel__empty">No structured facts yet.</p>
          ) : (
            facts.map((f) => (
              <dl key={f.id} className="terris-entity-facts__card">
                <dt className="terris-entity-facts__label">{f.label}</dt>
                <dd className="terris-entity-facts__value">{f.value}</dd>
              </dl>
            ))
          )}
        </div>
      )
    }
    case 'media': {
      const mediaKey = entity.media.map((m) => m.id).join('|')
      return (
        <div className="terris-entity-media-tab">
          <p className="terris-entity-media-tab__lede">
            Documentary imagery, video, and archival scans. Interpretive reconstructions live under
            Reconstruction.
          </p>
          <MediaGallery
            key={`${entity.id}-doc-${mediaKey}`}
            media={entity.media}
            documentaryOnly
          />
        </div>
      )
    }
    case 'related':
      return (
        <div className="terris-entity-related">
          {relatedGroups.length === 0 ? (
            <p className="terris-entity-panel__empty">No related entities linked yet.</p>
          ) : (
            relatedGroups.map((g) => (
              <section key={g.kind} className="terris-entity-related__group">
                <h3 className="terris-entity-related__heading">{g.label}</h3>
                <ul className="terris-entity-related__list">
                  {g.items.map((item) => (
                    <li key={`${g.kind}-${item.id}`}>
                      <RelatedEntityRow
                        item={item}
                        onOpen={
                          onOpenRelatedEntity
                            ? () => onOpenRelatedEntity(item.id)
                            : undefined
                        }
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
        </div>
      )
    case 'nearby':
      return (
        <div className="terris-entity-nearby">
          <p className="terris-entity-nearby__lede">
            Curated neighbors and walkable anchors—spatial queries will refine distance and bearing.
          </p>
          {nearbyRefs.length === 0 ? (
            <p className="terris-entity-panel__empty">No nearby anchors listed.</p>
          ) : (
            <ul className="terris-entity-nearby__list">
              {nearbyRefs.map((item) => {
                const detail = getMockEntityById(item.id)
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="terris-entity-nearby__card"
                      disabled={!onOpenRelatedEntity}
                      onClick={() => onOpenRelatedEntity?.(item.id)}
                    >
                      <span className="terris-entity-nearby__kind">
                        {formatEntityKindLabel(item.kind)}
                      </span>
                      <span className="terris-entity-nearby__name">{item.name}</span>
                      {item.role ? (
                        <span className="terris-entity-nearby__role">{item.role}</span>
                      ) : null}
                      {detail?.summary ? (
                        <span className="terris-entity-nearby__hint">{detail.summary}</span>
                      ) : null}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )
    case 'reconstruction': {
      const { interpretive } = partitionMedia(entity.media)
      const reconKey = interpretive.map((m) => m.id).join('|')
      return (
        <div className="terris-entity-recon-tab">
          <div className="terris-entity-recon-tab__banner">
            <AlertTriangle className="terris-entity-recon-tab__banner-icon size-4 shrink-0" aria-hidden />
            <div>
              <p className="terris-entity-recon-tab__banner-title">Interpretive layer</p>
              <p className="terris-entity-recon-tab__banner-body">
                Content here is modeled or AI-assisted for exploration—not primary historical evidence. Compare with
                archival media and cited sources.
              </p>
            </div>
          </div>
          <p className="terris-entity-recon-tab__lede">
            Each asset below is flagged as interpretive; production builds will attach uncertainty, provenance, and
            review status.
          </p>
          {interpretive.length === 0 ? (
            <p className="terris-entity-panel__empty">No interpretive reconstructions for this entity yet.</p>
          ) : (
            <MediaGallery key={`${entity.id}-recon-${reconKey}`} media={interpretive} />
          )}
        </div>
      )
    }
    default:
      return null
  }
}

function RelatedEntityRow({
  item,
  onOpen,
}: {
  item: RelatedEntityRef
  onOpen?: () => void
}) {
  const interactive = Boolean(onOpen)
  if (interactive) {
    return (
      <button type="button" className="terris-entity-related__row" onClick={onOpen}>
        <span className="terris-entity-related__name">{item.name}</span>
        {item.role ? <span className="terris-entity-related__role">{item.role}</span> : null}
      </button>
    )
  }
  return (
    <div className="terris-entity-related__row terris-entity-related__row--static">
      <span className="terris-entity-related__name">{item.name}</span>
      {item.role ? <span className="terris-entity-related__role">{item.role}</span> : null}
    </div>
  )
}
