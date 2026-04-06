import { useMemo, useEffect, useCallback } from 'react'
import {
  entities,
  formatYearRange,
  getTypeColor,
  getTypeLabel,
} from '@/data/historical'
import { useAtlasStore } from '@/store/atlas'

export function InfoPanel() {
  const { selectedId, setSelected } = useAtlasStore()

  const entity = useMemo(
    () => entities.find((e) => e.id === selectedId) ?? null,
    [selectedId],
  )

  const relatedEntities = useMemo(() => {
    if (!entity?.related) return []
    return entity.related
      .map((id) => entities.find((e) => e.id === id))
      .filter(Boolean) as typeof entities
  }, [entity])

  const handleClose = useCallback(() => setSelected(null), [setSelected])

  const handleRelatedClick = useCallback(
    (id: string) => setSelected(id),
    [setSelected],
  )

  useEffect(() => {
    if (!selectedId) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selectedId, handleClose])

  if (!entity) return null

  const typeColor = getTypeColor(entity.type)

  return (
    <aside
      role="region"
      aria-label={`Details for ${entity.name}`}
      className="
        pointer-events-auto absolute top-4 right-4 bottom-16
        w-[280px] max-h-[calc(100vh-100px)] rounded-lg overflow-hidden
        animate-[fadeSlideIn_0.25s_cubic-bezier(0.22,1,0.36,1)]
        max-md:top-auto max-md:bottom-16 max-md:left-3 max-md:right-3 max-md:w-auto max-md:max-h-[45vh]
        flex flex-col
      "
      style={{
        background: 'rgba(8,10,16,0.75)',
        backdropFilter: 'blur(24px) saturate(1.15)',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
      }}
    >
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {/* Header */}
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

        {/* Description */}
        <p className="text-[11px] leading-[1.6] text-[--color-text-secondary]">
          {entity.description}
        </p>

        {/* Details */}
        {entity.details && entity.details.length > 0 && (
          <div
            className="flex flex-col gap-1.5 pt-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
          >
            {entity.details.map((d) => (
              <div key={d.label} className="flex items-baseline justify-between gap-2">
                <span className="text-[9px] uppercase tracking-[0.06em] text-[--color-text-muted] shrink-0">
                  {d.label}
                </span>
                <span className="text-[10px] text-[--color-text-secondary] text-right">
                  {d.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Coordinates */}
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

        {/* Related */}
        {relatedEntities.length > 0 && (
          <div
            className="flex flex-col gap-1.5 pt-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
          >
            <span className="text-[9px] uppercase tracking-[0.06em] text-[--color-text-muted]">
              Related
            </span>
            <div className="flex flex-wrap gap-1">
              {relatedEntities.map((rel) => (
                <button
                  key={rel.id}
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
                    className="w-1 h-1 rounded-full"
                    style={{ background: getTypeColor(rel.type) }}
                  />
                  {rel.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
