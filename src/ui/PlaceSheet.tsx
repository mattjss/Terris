import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@base-ui/react/button'
import { Tabs } from '@base-ui/react/tabs'
import { getMockEntityById } from '@/data/services/entityService'
import type { RelatedEntityRef, TerrisEntity, TerrisMediaItem } from '@/data/types/terrisEntity'
import { pickHeroMedia } from '@/ui/mediaGalleryModel'
import { InterpretiveReconstructionPanel } from '@/ui/InterpretiveReconstructionPanel'
import { MediaGallery } from '@/ui/MediaGallery'
import {
  formatCoords,
  formatEntityKindLabel,
  formatEntityYearRange,
  formatTimelineDateLabel,
  groupFactsByCategory,
  groupNearbyByAnchor,
  groupRelatedByDiscoveryGroup,
  resolveNearbyRefs,
  sortTimelineChronological,
} from '@/ui/placeSheetHelpers'
import type { PlaceSheetProps, PlaceSheetTabId } from '@/ui/placeSheetTypes'
import { PLACE_SHEET_TABS } from '@/ui/placeSheetTypes'
import { useEducationalContext } from '@/hooks/useEducationalContext'
import { useTerrisStore } from '@/state/useTerrisStore'
import { EntityRecommendations } from '@/ui/EntityRecommendations'
import { EntityFieldNotes } from '@/ui/EntityFieldNotes'

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
  enrichmentLoading,
  enrichmentError,
  className,
}: PlaceSheetProps) {
  const uid = useId()
  const titleId = `${uid}-title`
  const panelId = `${uid}-panel`
  const [tab, setTab] = useState<PlaceSheetTabId>('overview')
  const [contentRefresh, setContentRefresh] = useState(false)
  const lastEntityIdRef = useRef<string | null>(null)

  const {
    emptyPlaceTeaser,
    visiblePlaceSheetTabs,
    metadataCompact,
    overviewShowsFullStory,
  } = useEducationalContext()

  const tabDefs = useMemo(
    () => PLACE_SHEET_TABS.filter((t) => visiblePlaceSheetTabs.includes(t.id)),
    [visiblePlaceSheetTabs],
  )

  const guidedSheetTabHint = useTerrisStore((s) => s.guidedSheetTabHint)
  const setGuidedSheetTabHint = useTerrisStore((s) => s.setGuidedSheetTabHint)

  const empty = entity === null

  useEffect(() => {
    if (!entity) {
      lastEntityIdRef.current = null
      return
    }
    const prev = lastEntityIdRef.current
    lastEntityIdRef.current = entity.id
    if (prev === null || prev === entity.id) return
    setContentRefresh(true)
    const t = window.setTimeout(() => setContentRefresh(false), 420)
    return () => window.clearTimeout(t)
  }, [entity?.id])

  const tabKey = visiblePlaceSheetTabs.join('|')
  useEffect(() => {
    if (!visiblePlaceSheetTabs.includes(tab)) {
      setTab(visiblePlaceSheetTabs[0] ?? 'overview')
    }
  }, [entity?.id, tab, tabKey, visiblePlaceSheetTabs])

  useEffect(() => {
    if (!entity || !guidedSheetTabHint) return
    if (!visiblePlaceSheetTabs.includes(guidedSheetTabHint)) {
      setGuidedSheetTabHint(null)
      return
    }
    setTab(guidedSheetTabHint)
    setGuidedSheetTabHint(null)
  }, [entity?.id, guidedSheetTabHint, visiblePlaceSheetTabs, setGuidedSheetTabHint])

  const timelineSorted = useMemo(
    () => (entity ? sortTimelineChronological(entity.timeline) : []),
    [entity],
  )

  const relatedDiscoveryGroups = useMemo(
    () => (entity ? groupRelatedByDiscoveryGroup(entity.relatedEntities) : []),
    [entity],
  )

  const nearbyGroups = useMemo(() => {
    if (!entity) return []
    return groupNearbyByAnchor(resolveNearbyRefs(entity))
  }, [entity])

  const heroMedia = useMemo(
    () => (entity ? pickHeroMedia(entity.media) : null),
    [entity],
  )

  return (
    <aside
      className={[
        'terris-place-sheet',
        empty ? 'terris-place-sheet--empty' : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="complementary"
      aria-labelledby={empty ? undefined : titleId}
      aria-label={empty ? 'Entity details' : undefined}
      aria-busy={enrichmentLoading ? 'true' : undefined}
    >
      <div
        className="terris-place-sheet__inner"
        data-content-refresh={contentRefresh ? 'true' : undefined}
      >
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
            <p className="terris-place-sheet__empty-lede">{emptyPlaceTeaser}</p>
            <p className="terris-place-sheet__empty-hint">
              Tap a marker or search when you are ready.
            </p>
          </div>
        ) : (
          <>
            <PlaceSheetHero media={heroMedia} headline={entity.name} />

            <header className="terris-place-sheet__header terris-place-sheet__header--editorial">
              <div className="terris-place-sheet__title-row">
                <h2 id={titleId} className="terris-place-sheet__title">
                  {entity.name}
                </h2>
                {entity.sources?.enrichment?.status === 'mixed' ||
                entity.sources?.enrichment?.status === 'live' ? (
                  <span className="terris-place-sheet__enrich-badge">Live enriched</span>
                ) : null}
              </div>
              <EntityMetadataBlock entity={entity} compact={metadataCompact} />
              <p className="terris-place-sheet__deck">{entity.summary}</p>
              {enrichmentLoading ? (
                <div className="terris-place-sheet__enrich-panel" role="status" aria-live="polite">
                  <p className="terris-place-sheet__enrich-status">
                    <span className="terris-place-sheet__enrich-calm" aria-hidden />
                    Gathering live context — this can take a moment.
                  </p>
                  <div className="terris-place-sheet__enrich-skeleton" aria-hidden>
                    <div className="terris-skeleton-line" />
                    <div className="terris-skeleton-line terris-skeleton-line--mid" />
                    <div className="terris-skeleton-line terris-skeleton-line--short" />
                  </div>
                </div>
              ) : null}
              {enrichmentError ? (
                <p
                  className="terris-place-sheet__enrich-warn"
                  role="status"
                  aria-live="polite"
                >
                  <AlertTriangle className="terris-place-sheet__enrich-warn-icon" aria-hidden />
                  {enrichmentError}
                </p>
              ) : null}
              {entity.sources?.enrichment?.warnings?.length ? (
                <p className="terris-place-sheet__enrich-hint" role="status">
                  Some live sources were skipped: {entity.sources.enrichment.warnings.join(' · ')}
                </p>
              ) : null}
            </header>

            <EntityFieldNotes entity={entity} />

            <Tabs.Root
              value={tab}
              onValueChange={(v) => setTab(v as PlaceSheetTabId)}
              className="flex min-h-0 flex-1 flex-col gap-0"
            >
              <Tabs.List aria-label="Entity sections" className="terris-place-sheet__tabs">
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
                        overviewShowsFullStory={overviewShowsFullStory}
                        onOpenRelatedEntity={onOpenRelatedEntity}
                        timelineSorted={timelineSorted}
                        relatedDiscoveryGroups={relatedDiscoveryGroups}
                        nearbyGroups={nearbyGroups}
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
  overviewShowsFullStory,
  onOpenRelatedEntity,
  timelineSorted,
  relatedDiscoveryGroups,
  nearbyGroups,
}: {
  tab: PlaceSheetTabId
  entity: TerrisEntity
  overviewShowsFullStory: boolean
  onOpenRelatedEntity?: (entityId: string) => void
  timelineSorted: ReturnType<typeof sortTimelineChronological>
  relatedDiscoveryGroups: ReturnType<typeof groupRelatedByDiscoveryGroup>
  nearbyGroups: ReturnType<typeof groupNearbyByAnchor>
}) {
  switch (tab) {
    case 'overview':
      if (!overviewShowsFullStory) {
        return (
          <div className="terris-entity-overview">
            <div className="terris-dossier terris-dossier--overview">
              <p className="terris-dossier__kicker">Summary</p>
              <p className="terris-dossier__lede">{entity.summary}</p>
            </div>
            <EntityRecommendations entity={entity} onOpenEntity={onOpenRelatedEntity} />
          </div>
        )
      }
      return (
        <div className="terris-entity-overview">
          <div className="terris-dossier terris-dossier--overview">
            <p className="terris-dossier__kicker">Summary</p>
            <p className="terris-dossier__lede">{entity.summary}</p>
            <div className="terris-dossier__divider" aria-hidden />
            <p className="terris-dossier__kicker">Full narrative</p>
            <div className="terris-dossier__prose">
              {entity.fullDescription
                .split(/\n\n+/)
                .map((p) => p.trim())
                .filter(Boolean)
                .map((para, i) => (
                  <p key={i} className="terris-dossier__paragraph">
                    {para}
                  </p>
                ))}
            </div>
          </div>
          <EntityRecommendations entity={entity} onOpenEntity={onOpenRelatedEntity} />
        </div>
      )
    case 'timeline':
      return (
        <div className="terris-dossier terris-dossier--timeline">
          <p className="terris-dossier__tab-lede">
            Chronology is editorial: each row is a teaching moment—compare dates to the map and media tabs.
          </p>
          <ul className="terris-dossier-timeline">
            {timelineSorted.length === 0 ? (
              <li className="terris-entity-panel__empty">No dated events yet.</li>
            ) : (
              timelineSorted.map((e) => (
                <li key={e.id} className="terris-dossier-timeline__item">
                  <div className="terris-dossier-timeline__marker" aria-hidden />
                  <div className="terris-dossier-timeline__body">
                    <div className="terris-dossier-timeline__meta">
                      <span className="terris-dossier-timeline__date">{formatTimelineDateLabel(e)}</span>
                      <span className={`terris-dossier-timeline__type terris-dossier-timeline__type--${e.type}`}>
                        {e.type === 'point' ? 'Moment' : e.type === 'range' ? 'Span' : 'Era'}
                      </span>
                    </div>
                    <h4 className="terris-dossier-timeline__title">{e.title}</h4>
                    {e.summary ? <p className="terris-dossier-timeline__summary">{e.summary}</p> : null}
                    {e.relatedEntityIds?.length ? (
                      <div className="terris-dossier-timeline__links">
                        {e.relatedEntityIds.map((rid) => {
                          const rel = entity.relatedEntities.find((r) => r.id === rid)
                          return (
                            <button
                              key={rid}
                              type="button"
                              className="terris-dossier-timeline__link"
                              disabled={!onOpenRelatedEntity}
                              onClick={() => onOpenRelatedEntity?.(rid)}
                            >
                              {rel?.name ?? rid}
                            </button>
                          )
                        })}
                      </div>
                    ) : null}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )
    case 'facts': {
      const factSections = groupFactsByCategory(entity.facts)
      return (
        <div className="terris-dossier terris-dossier--facts">
          <p className="terris-dossier__tab-lede">
            Facts are grouped for scanning—like a museum label system, not a raw database dump.
          </p>
          {factSections.length === 0 ? (
            <p className="terris-entity-panel__empty">No structured facts yet.</p>
          ) : (
            factSections.map((section) => (
              <section key={section.category} className="terris-dossier-facts__section">
                <h3 className="terris-dossier-facts__heading">{section.label}</h3>
                <ul className="terris-dossier-facts__list">
                  {section.items.map((f) => (
                    <li key={f.id} className="terris-dossier-facts__row">
                      <span className="terris-dossier-facts__label">{f.label}</span>
                      <span className="terris-dossier-facts__value">{f.value}</span>
                      {f.sourceName ? (
                        <span className="terris-dossier-facts__src">{f.sourceName}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
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
        <div className="terris-dossier terris-dossier--related">
          <p className="terris-dossier__tab-lede">
            Cross-links for discovery—grouped so you can move from place to person to event without losing the thread.
          </p>
          {relatedDiscoveryGroups.length === 0 ? (
            <p className="terris-entity-panel__empty">No related entities linked yet.</p>
          ) : (
            relatedDiscoveryGroups.map((g) => (
              <section key={g.group} className="terris-dossier-related__group">
                <h3 className="terris-dossier-related__heading">{g.label}</h3>
                <ul className="terris-dossier-related__list">
                  {g.items.map((item) => (
                    <li key={`${g.group}-${item.id}`}>
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
        <div className="terris-dossier terris-dossier--nearby">
          <p className="terris-dossier__tab-lede">
            Nearby anchors for this place—curated for orientation; future builds will add distance and bearing.
          </p>
          {nearbyGroups.length === 0 ? (
            <p className="terris-entity-panel__empty">No nearby anchors listed.</p>
          ) : (
            nearbyGroups.map((ng) => (
              <section key={ng.anchor} className="terris-dossier-nearby__group">
                <h3 className="terris-dossier-nearby__heading">{ng.label}</h3>
                <ul className="terris-dossier-nearby__list">
                  {ng.items.map((item) => {
                    const detail = getMockEntityById(item.id)
                    return (
                      <li key={`${ng.anchor}-${item.id}`}>
                        <button
                          type="button"
                          className="terris-dossier-nearby__card"
                          disabled={!onOpenRelatedEntity}
                          onClick={() => onOpenRelatedEntity?.(item.id)}
                        >
                          <span className="terris-dossier-nearby__name">{item.name}</span>
                          {item.role ? (
                            <span className="terris-dossier-nearby__role">{item.role}</span>
                          ) : null}
                          {detail?.summary ? (
                            <span className="terris-dossier-nearby__hint">{detail.summary}</span>
                          ) : null}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </section>
            ))
          )}
        </div>
      )
    case 'reconstruction':
      return <InterpretiveReconstructionPanel entity={entity} />
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
      <button type="button" className="terris-dossier-related__row" onClick={onOpen}>
        <span className="terris-dossier-related__name">{item.name}</span>
        {item.role ? <span className="terris-dossier-related__role">{item.role}</span> : null}
      </button>
    )
  }
  return (
    <div className="terris-dossier-related__row terris-dossier-related__row--static">
      <span className="terris-dossier-related__name">{item.name}</span>
      {item.role ? <span className="terris-dossier-related__role">{item.role}</span> : null}
    </div>
  )
}
