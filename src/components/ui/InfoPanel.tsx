import { useMemo, useEffect, useCallback, useState } from 'react'
import {
  formatYear,
  formatYearRange,
  getTypeColor,
  getTypeLabel,
} from '@/data/historical'
import { useAtlasStore } from '@/store/atlas'
import { useEntities } from '@/hooks/useEntities'
import { getApiBase, aiSummarizeApi } from '@/lib/api'

export function InfoPanel() {
  const { selectedId, setSelected } = useAtlasStore()
  const currentYear = useAtlasStore((s) => s.currentYear)
  const { data: catalog = [] } = useEntities()
  const [aiText, setAiText] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  const entity = useMemo(
    () => catalog.find((e) => e.id === selectedId) ?? null,
    [catalog, selectedId],
  )

  const relatedEntities = useMemo(() => {
    if (!entity?.related) return []
    return entity.related
      .map((id) => catalog.find((e) => e.id === id))
      .filter(Boolean) as typeof catalog
  }, [entity, catalog])

  const handleClose = useCallback(() => setSelected(null), [setSelected])

  const handleRelatedClick = useCallback(
    (id: string) => setSelected(id),
    [setSelected],
  )

  useEffect(() => {
    setAiText(null)
  }, [selectedId])

  useEffect(() => {
    if (!selectedId) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selectedId, handleClose])

  const handleAiExplore = useCallback(async () => {
    if (!entity || !getApiBase()) return
    setAiLoading(true)
    try {
      const res = await aiSummarizeApi({
        entityId: entity.id,
        year: currentYear,
        q: 'Give a short historical overview and what to explore next.',
      })
      setAiText(res?.text ?? null)
    } finally {
      setAiLoading(false)
    }
  }, [entity, currentYear])

  if (!entity) return null

  const typeColor = getTypeColor(entity.type)
  const hasApi = Boolean(getApiBase())

  return (
    <aside
      role="region"
      aria-label={`Details for ${entity.name}`}
      className="
        pointer-events-auto absolute right-6 top-28 bottom-32 z-[20]
        w-[300px] max-h-[calc(100vh-11rem)] overflow-hidden rounded-none
        animate-[fadeSlideIn_0.25s_cubic-bezier(0.22,1,0.36,1)]
        max-md:bottom-36 max-md:left-3 max-md:right-3 max-md:top-auto max-md:max-h-[min(52vh,480px)] max-md:w-auto
        flex flex-col font-[family-name:var(--font-terris-mono)]
      "
      style={{
        background: 'rgba(0,0,0,0.92)',
        backdropFilter: 'none',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: 'none',
      }}
    >
      <div className="flex-1 overflow-y-auto overscroll-contain p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-px min-w-0">
            <span
              className="text-[9px] uppercase tracking-[0.08em] font-medium leading-none"
              style={{ color: typeColor }}
            >
              {getTypeLabel(entity.type)}
            </span>
            <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-[--color-text-primary] leading-snug mt-1">
              {entity.name}
            </h2>
            <span className="text-[10px] text-[--color-text-muted] leading-none mt-0.5 tabular-nums">
              {formatYearRange(entity.yearStart, entity.yearEnd)}
            </span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close detail panel"
            className="
              shrink-0 w-5 h-5 rounded flex items-center justify-center
              text-[10px] text-[--color-text-muted]
              hover:text-[--color-text-secondary] hover:bg-surface-hover
              transition-colors duration-150 cursor-pointer
            "
          >
            ✕
          </button>
        </div>

        <section aria-labelledby="overview-heading">
          <h3 id="overview-heading" className="sr-only">
            Overview
          </h3>
          <p className="text-[11px] leading-[1.6] text-[--color-text-secondary]">
            {entity.description}
          </p>
        </section>

        <section
          aria-labelledby="timeline-heading"
          className="pt-1"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          <h3
            id="timeline-heading"
            className="text-[9px] uppercase tracking-[0.06em] text-[--color-text-muted] mb-1"
          >
            Timeline
          </h3>
          <p className="text-[10px] text-[--color-text-secondary] tabular-nums">
            Active {formatYearRange(entity.yearStart, entity.yearEnd)} · Viewer
            at {formatYear(currentYear)}
          </p>
        </section>

        {entity.details && entity.details.length > 0 && (
          <section
            aria-labelledby="facts-heading"
            className="flex flex-col gap-1.5 pt-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
          >
            <h3
              id="facts-heading"
              className="text-[9px] uppercase tracking-[0.06em] text-[--color-text-muted]"
            >
              Facts
            </h3>
            {entity.details.map((d) => (
              <div
                key={d.label}
                className="flex items-baseline justify-between gap-2"
              >
                <span className="text-[9px] uppercase tracking-[0.06em] text-[--color-text-muted] shrink-0">
                  {d.label}
                </span>
                <span className="text-[10px] text-[--color-text-secondary] text-right">
                  {d.value}
                </span>
              </div>
            ))}
          </section>
        )}

        {entity.type !== 'trade-route' && (
          <div
            className="pt-2 flex items-center justify-between text-[9px] text-[--color-text-muted] tabular-nums"
            style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
          >
            <span>
              {entity.lat.toFixed(1)}°{entity.lat >= 0 ? 'N' : 'S'}{' '}
              {Math.abs(entity.lng).toFixed(1)}°{entity.lng >= 0 ? 'E' : 'W'}
            </span>
          </div>
        )}

        {relatedEntities.length > 0 && (
          <section
            aria-labelledby="related-heading"
            className="flex flex-col gap-1.5 pt-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
          >
            <h3
              id="related-heading"
              className="text-[9px] uppercase tracking-[0.06em] text-[--color-text-muted]"
            >
              Related
            </h3>
            <div className="flex flex-wrap gap-1">
              {relatedEntities.map((rel) => (
                <button
                  key={rel.id}
                  type="button"
                  onClick={() => handleRelatedClick(rel.id)}
                  className="
                    flex items-center gap-1 px-1.5 py-[2px] rounded
                    text-[9px] text-[--color-text-secondary]
                    border border-surface-hover
                    hover:border-[rgba(255,255,255,0.1)] hover:text-[--color-text-primary]
                    transition-colors duration-150 cursor-pointer
                  "
                >
                  <span
                    className="w-1 h-1 rounded-none"
                    style={{ background: getTypeColor(rel.type) }}
                  />
                  {rel.name}
                </button>
              ))}
            </div>
          </section>
        )}

        {hasApi && (
          <section
            aria-labelledby="explore-heading"
            className="flex flex-col gap-2 pt-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
          >
            <h3
              id="explore-heading"
              className="text-[9px] uppercase tracking-[0.06em] text-[--color-text-muted]"
            >
              AI exploration
            </h3>
            <button
              type="button"
              onClick={handleAiExplore}
              disabled={aiLoading}
              className="
                self-start px-2 py-1 rounded text-[10px] font-medium
                border border-[rgba(79,209,197,0.25)] text-[--color-accent]
                hover:bg-[rgba(79,209,197,0.08)] transition-colors
                disabled:opacity-40
              "
            >
              {aiLoading ? 'Thinking…' : 'Summarize & explore'}
            </button>
            {aiText && (
              <p className="text-[10px] leading-relaxed text-[--color-text-secondary]">
                {aiText}
              </p>
            )}
          </section>
        )}
      </div>
    </aside>
  )
}
