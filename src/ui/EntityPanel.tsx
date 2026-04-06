import { useEffect, useMemo, useCallback } from 'react'
import { useTerrisStore } from '@/state/useTerrisStore'
import { TIMELINE_YEAR_MAX, TIMELINE_YEAR_MIN } from '@/ui/Timeline'
import {
  formatEntityKindLabel,
  formatEntityYearRange,
} from '@/ui/placeSheetHelpers'

function formatCoordLine(lat: number, lon: number): string {
  const ns = lat >= 0 ? 'N' : 'S'
  const ew = lon >= 0 ? 'E' : 'W'
  return `${Math.abs(lat).toFixed(4)}° ${ns}, ${Math.abs(lon).toFixed(4)}° ${ew}`
}

function clampTimelineYear(y: number): number {
  return Math.max(TIMELINE_YEAR_MIN, Math.min(TIMELINE_YEAR_MAX, y))
}

export function EntityPanel() {
  const selectedEntity = useTerrisStore((s) => s.selectedEntity)
  const setSelectedEntity = useTerrisStore((s) => s.setSelectedEntity)
  const setYear = useTerrisStore((s) => s.setYear)
  const requestGlobeFocus = useTerrisStore((s) => s.requestGlobeFocus)

  const description = useMemo(() => {
    if (!selectedEntity) return ''
    return selectedEntity.summary || 'Terris entity.'
  }, [selectedEntity])

  const handleClose = useCallback(() => {
    setSelectedEntity(null)
  }, [setSelectedEntity])

  useEffect(() => {
    if (!selectedEntity) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedEntity, handleClose])

  if (!selectedEntity) return null

  const onJumpYear = () => {
    const ys = selectedEntity.startYear ?? TIMELINE_YEAR_MIN
    const ye = selectedEntity.endYear ?? selectedEntity.startYear ?? ys
    setYear(clampTimelineYear(Math.round((ys + ye) / 2)))
  }

  const onFocusGlobe = () => {
    if (!selectedEntity.coords) return
    requestGlobeFocus(selectedEntity.coords.lat, selectedEntity.coords.lon)
  }

  return (
    <aside
      className="terris-entity-panel"
      role="region"
      aria-label={`Details for ${selectedEntity.name}`}
    >
      <div className="terris-entity-panel__head">
        <div className="terris-entity-panel__head-text">
          <h2 className="terris-entity-panel__title">{selectedEntity.name}</h2>
        </div>
        <button
          type="button"
          className="terris-entity-panel__dismiss"
          onClick={handleClose}
          aria-label="Close panel"
        >
          close
        </button>
      </div>

      <dl className="terris-entity-panel__meta">
        <div className="terris-entity-panel__row">
          <dt className="terris-entity-panel__label">Type</dt>
          <dd className="terris-entity-panel__value">
            {formatEntityKindLabel(selectedEntity.type)}
          </dd>
        </div>
        <div className="terris-entity-panel__row">
          <dt className="terris-entity-panel__label">Active years</dt>
          <dd className="terris-entity-panel__value">
            {formatEntityYearRange(selectedEntity)}
          </dd>
        </div>
        <div className="terris-entity-panel__row">
          <dt className="terris-entity-panel__label">Coordinates</dt>
          <dd className="terris-entity-panel__value terris-entity-panel__value--coords">
            {selectedEntity.coords
              ? formatCoordLine(selectedEntity.coords.lat, selectedEntity.coords.lon)
              : '—'}
          </dd>
        </div>
      </dl>

      <p className="terris-entity-panel__desc">{description}</p>

      <div className="terris-entity-panel__actions">
        <button type="button" className="terris-entity-panel__btn" onClick={onJumpYear}>
          Jump timeline
        </button>
        <button
          type="button"
          className="terris-entity-panel__btn"
          onClick={onFocusGlobe}
          disabled={!selectedEntity.coords}
        >
          Focus globe
        </button>
      </div>
    </aside>
  )
}
