import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { X } from 'lucide-react'
import type { TerrisEntity } from '@/data/types/terrisEntity'
import {
  formatCoords,
  formatEntityKindLabel,
  formatEntityYearRange,
  formatTimelineDateLabel,
  groupFactsByCategory,
  groupRelatedByDiscoveryGroup,
  sortTimelineChronological,
} from '@/ui/placeSheetHelpers'
import type { PlaceSheetProps } from '@/ui/placeSheetTypes'

export type { PlaceSheetProps } from '@/ui/placeSheetTypes'

type TabId = 'overview' | 'timeline' | 'facts' | 'related'

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'facts', label: 'Facts' },
  { id: 'related', label: 'Related' },
]

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
  const [tab, setTab] = useState<TabId>('overview')
  const lastEntityIdRef = useRef<string | null>(null)

  const empty = entity === null

  useEffect(() => {
    if (!entity) {
      lastEntityIdRef.current = null
      return
    }
    if (lastEntityIdRef.current !== entity.id) {
      lastEntityIdRef.current = entity.id
      setTab('overview')
    }
  }, [entity?.id])

  const timelineSorted = useMemo(
    () => (entity ? sortTimelineChronological(entity.timeline) : []),
    [entity],
  )

  const relatedGroups = useMemo(
    () => (entity ? groupRelatedByDiscoveryGroup(entity.relatedEntities) : []),
    [entity],
  )

  const visibleTabs = useMemo(() => {
    if (!entity) return TABS
    return TABS.filter((t) => {
      if (t.id === 'timeline') return timelineSorted.length > 0
      if (t.id === 'facts') return entity.facts.length > 0
      if (t.id === 'related') return entity.relatedEntities.length > 0
      return true
    })
  }, [entity, timelineSorted.length])

  return (
    <aside
      className={['terris-place-sheet', empty ? 'terris-place-sheet--empty' : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
      role="complementary"
      aria-labelledby={empty ? undefined : titleId}
      aria-label={empty ? 'Entity details' : undefined}
    >
      <div className="terris-place-sheet__inner">
        {onClose ? (
          <button
            type="button"
            className="terris-place-sheet__close"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="size-4" aria-hidden />
          </button>
        ) : null}

        {empty ? (
          <div className="terris-place-sheet__empty">
            <p className="terris-place-sheet__empty-hint">
              Select a marker or search to inspect.
            </p>
          </div>
        ) : (
          <>
            <header className="terris-place-sheet__header">
              <span className="terris-place-sheet__kind">
                {formatEntityKindLabel(entity.type)}
              </span>
              <h2 id={titleId} className="terris-place-sheet__title">
                {entity.name}
              </h2>
              <MetaRow entity={entity} />
            </header>

            <nav className="terris-place-sheet__tabs" aria-label="Entity sections">
              {visibleTabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={
                    'terris-place-sheet__tab' +
                    (tab === t.id ? ' terris-place-sheet__tab--active' : '')
                  }
                  onClick={() => setTab(t.id)}
                  aria-selected={tab === t.id}
                  role="tab"
                >
                  {t.label}
                </button>
              ))}
            </nav>

            <div className="terris-place-sheet__body">
              <TabContent
                tab={tab}
                entity={entity}
                timelineSorted={timelineSorted}
                relatedGroups={relatedGroups}
                onOpenRelatedEntity={onOpenRelatedEntity}
              />
            </div>

            <footer className="terris-place-sheet__footer">
              {onFocusGlobe ? (
                <button
                  type="button"
                  className="terris-place-sheet__action"
                  onClick={onFocusGlobe}
                >
                  Focus
                </button>
              ) : null}
              {onJumpToEra ? (
                <button
                  type="button"
                  className="terris-place-sheet__action"
                  onClick={onJumpToEra}
                >
                  Jump to era
                </button>
              ) : null}
            </footer>
          </>
        )}
      </div>
    </aside>
  )
}

function MetaRow({ entity }: { entity: TerrisEntity }) {
  const era = formatEntityYearRange(entity)
  const coords = formatCoords(entity.coords)
  const parts = [era, entity.placeName, entity.regionName, coords].filter(Boolean)

  return (
    <p className="terris-place-sheet__meta">
      {parts.join(' · ')}
    </p>
  )
}

function TabContent({
  tab,
  entity,
  timelineSorted,
  relatedGroups,
  onOpenRelatedEntity,
}: {
  tab: TabId
  entity: TerrisEntity
  timelineSorted: ReturnType<typeof sortTimelineChronological>
  relatedGroups: ReturnType<typeof groupRelatedByDiscoveryGroup>
  onOpenRelatedEntity?: (entityId: string) => void
}) {
  switch (tab) {
    case 'overview':
      return (
        <div className="terris-sheet-section">
          <p className="terris-sheet-section__text">{entity.summary}</p>
          {entity.fullDescription && entity.fullDescription !== entity.summary ? (
            <>
              <div className="terris-sheet-section__divider" />
              {entity.fullDescription
                .split(/\n\n+/)
                .map((p) => p.trim())
                .filter(Boolean)
                .map((para, i) => (
                  <p key={i} className="terris-sheet-section__text">
                    {para}
                  </p>
                ))}
            </>
          ) : null}
        </div>
      )
    case 'timeline':
      return (
        <ul className="terris-sheet-timeline">
          {timelineSorted.map((e) => (
            <li key={e.id} className="terris-sheet-timeline__item">
              <span className="terris-sheet-timeline__date">
                {formatTimelineDateLabel(e)}
              </span>
              <div className="terris-sheet-timeline__content">
                <span className="terris-sheet-timeline__title">{e.title}</span>
                {e.summary ? (
                  <span className="terris-sheet-timeline__summary">{e.summary}</span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )
    case 'facts': {
      const sections = groupFactsByCategory(entity.facts)
      return (
        <div className="terris-sheet-facts">
          {sections.map((section) => (
            <div key={section.category} className="terris-sheet-facts__section">
              <h3 className="terris-sheet-facts__heading">{section.label}</h3>
              <dl className="terris-sheet-facts__list">
                {section.items.map((f) => (
                  <div key={f.id} className="terris-sheet-facts__row">
                    <dt className="terris-sheet-facts__label">{f.label}</dt>
                    <dd className="terris-sheet-facts__value">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      )
    }
    case 'related':
      return (
        <div className="terris-sheet-related">
          {relatedGroups.map((g) => (
            <div key={g.group} className="terris-sheet-related__group">
              <h3 className="terris-sheet-related__heading">{g.label}</h3>
              <ul className="terris-sheet-related__list">
                {g.items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="terris-sheet-related__row"
                      disabled={!onOpenRelatedEntity}
                      onClick={() => onOpenRelatedEntity?.(item.id)}
                    >
                      <span className="terris-sheet-related__name">{item.name}</span>
                      {item.role ? (
                        <span className="terris-sheet-related__role">{item.role}</span>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )
    default:
      return null
  }
}
