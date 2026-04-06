import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { formatYear } from '@/data/historical'
import { useTerrisStore } from '@/state/useTerrisStore'
import {
  TIME_ERAS,
  type TimeEra,
  type TimeEraId,
  type TimeSubPeriod,
  clampYearToTimeline,
  getEraForYear,
  getMacroEraById,
  getSubPeriodForYearInMacro,
  getSubPeriodsForMacro,
  layoutSubPeriodInMacro,
  macroLocalFractionToYear,
  yearToMacroLocalFraction,
  yearToTimelineFraction,
  timelineFractionToYear,
  TIMELINE_YEAR_MAX,
  TIMELINE_YEAR_MIN,
} from '@/ui/timeEras'

function clamp01(t: number): number {
  return Math.max(0, Math.min(1, t))
}

function eraSpanFraction(era: TimeEra): number {
  const span = TIMELINE_YEAR_MAX - TIMELINE_YEAR_MIN
  return (era.end - era.start) / span
}

function eraStartFraction(era: TimeEra): number {
  const span = TIMELINE_YEAR_MAX - TIMELINE_YEAR_MIN
  return (era.start - TIMELINE_YEAR_MIN) / span
}

function subMidYear(sub: TimeSubPeriod): number {
  return clampYearToTimeline(Math.round((sub.start + sub.end) / 2))
}

function fractionFromClientX(el: HTMLElement, clientX: number): number {
  const r = el.getBoundingClientRect()
  return clamp01((clientX - r.left) / r.width)
}

/**
 * Time minimap: **macro** = full timeline eras; **local** = sub-periods inside one macro era.
 * The scrub track receives all pointer events; era bands are visual only (no overlay buttons),
 * so click / drag always updates the year. Double-click opens the local (sub-period) view.
 */
export function TimeMinimap() {
  const year = useTerrisStore((s) => s.year)
  const setYear = useTerrisStore((s) => s.setYear)
  const timeMinimapScope = useTerrisStore((s) => s.timeMinimapScope)
  const timeMinimapMacroId = useTerrisStore((s) => s.timeMinimapMacroId)
  const openTimeMinimapLocal = useTerrisStore((s) => s.openTimeMinimapLocal)
  const closeTimeMinimapLocal = useTerrisStore((s) => s.closeTimeMinimapLocal)
  const setTimeMinimapMacroId = useTerrisStore((s) => s.setTimeMinimapMacroId)

  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const [hoverMacroId, setHoverMacroId] = useState<TimeEraId | null>(null)
  const [hoverSubId, setHoverSubId] = useState<string | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  /** Primary = compact strip; expanded on hover, focus-within, drag, or pin. */
  const [shellHover, setShellHover] = useState(false)
  const [focusWithinShell, setFocusWithinShell] = useState(false)
  const [pinnedExpanded, setPinnedExpanded] = useState(false)
  const shellRef = useRef<HTMLDivElement>(null)

  const uiExpanded =
    shellHover || dragging || focusWithinShell || pinnedExpanded

  const focusedMacro = timeMinimapMacroId
    ? getMacroEraById(timeMinimapMacroId)
    : undefined
  const isLocal = timeMinimapScope === 'local' && focusedMacro !== undefined

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fn = () => setReducedMotion(mq.matches)
    fn()
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  useEffect(() => {
    if (!isLocal || !timeMinimapMacroId) return
    const macro = getMacroEraById(timeMinimapMacroId)
    if (!macro) return
    if (year >= macro.start && year <= macro.end) return
    const e = getEraForYear(year)
    setTimeMinimapMacroId(e.id)
  }, [year, isLocal, timeMinimapMacroId, setTimeMinimapMacroId])

  const updateFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current
      if (!el) return
      const t = fractionFromClientX(el, clientX)
      if (isLocal && focusedMacro) {
        setYear(macroLocalFractionToYear(t, focusedMacro))
      } else {
        setYear(timelineFractionToYear(t))
      }
    },
    [setYear, isLocal, focusedMacro],
  )

  useEffect(() => {
    if (!dragging) return
    const move = (e: PointerEvent) => updateFromClientX(e.clientX)
    const up = () => {
      setDragging(false)
      setHoverMacroId(null)
      setHoverSubId(null)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [dragging, updateFromClientX])

  const updateHoverFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current
      if (!el) return
      const t = fractionFromClientX(el, clientX)
      if (isLocal && focusedMacro) {
        const y = macroLocalFractionToYear(t, focusedMacro)
        const sub = getSubPeriodForYearInMacro(y, focusedMacro.id)
        setHoverSubId(sub?.id ?? null)
        setHoverMacroId(null)
      } else {
        const y = timelineFractionToYear(t)
        setHoverMacroId(getEraForYear(y).id)
        setHoverSubId(null)
      }
    },
    [isLocal, focusedMacro],
  )

  const onTrackPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return
      e.preventDefault()
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
      setDragging(true)
      updateFromClientX(e.clientX)
    },
    [updateFromClientX],
  )

  const onTrackPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (dragging) return
      updateHoverFromClientX(e.clientX)
    },
    [dragging, updateHoverFromClientX],
  )

  const onTrackPointerLeave = useCallback(() => {
    if (!dragging) {
      setHoverMacroId(null)
      setHoverSubId(null)
    }
  }, [dragging])

  const onTrackDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.button !== 0) return
      const el = trackRef.current
      if (!el) return
      if (isLocal && focusedMacro) {
        const t = fractionFromClientX(el, e.clientX)
        const y = macroLocalFractionToYear(t, focusedMacro)
        const sub = getSubPeriodForYearInMacro(y, focusedMacro.id)
        if (sub) setYear(subMidYear(sub))
        return
      }
      const t = fractionFromClientX(el, e.clientX)
      const y = timelineFractionToYear(t)
      const era = getEraForYear(y)
      openTimeMinimapLocal(era.id)
    },
    [isLocal, focusedMacro, setYear, openTimeMinimapLocal],
  )

  const activeEra = getEraForYear(year)
  const displayMacro = focusedMacro ?? activeEra

  const subFocusLayout = useMemo(() => {
    if (!isLocal || !focusedMacro) return null
    const sub = getSubPeriodForYearInMacro(year, focusedMacro.id)
    if (!sub) return null
    return layoutSubPeriodInMacro(sub, focusedMacro)
  }, [isLocal, focusedMacro, year])

  const playheadPctGlobal = yearToTimelineFraction(year) * 100
  const playheadPctMain =
    isLocal && focusedMacro
      ? yearToMacroLocalFraction(year, focusedMacro) * 100
      : playheadPctGlobal

  const stepYear = useCallback(
    (delta: number) => {
      if (isLocal && focusedMacro) {
        const lo = focusedMacro.start
        const hi = focusedMacro.end
        setYear(clampYearToTimeline(Math.max(lo, Math.min(hi, year + delta))))
      } else {
        setYear(clampYearToTimeline(year + delta))
      }
    },
    [isLocal, focusedMacro, year, setYear],
  )

  const ariaMin = isLocal && focusedMacro ? focusedMacro.start : TIMELINE_YEAR_MIN
  const ariaMax = isLocal && focusedMacro ? focusedMacro.end : TIMELINE_YEAR_MAX

  return (
    <div
      ref={shellRef}
      className={
        'terris-time-minimap-shell' +
        (uiExpanded ? ' terris-time-minimap-shell--expanded' : '')
      }
      onMouseEnter={() => setShellHover(true)}
      onMouseLeave={() => {
        if (!dragging) setShellHover(false)
      }}
      onFocusCapture={() => setFocusWithinShell(true)}
      onBlurCapture={(e) => {
        const next = e.relatedTarget as Node | null
        if (next && shellRef.current?.contains(next)) return
        setFocusWithinShell(false)
      }}
    >
      <div
        className={
          'terris-time-minimap' +
          (uiExpanded ? ' terris-time-minimap--expanded' : ' terris-time-minimap--compact')
        }
        data-expanded={uiExpanded}
      >
      <div className="terris-time-minimap__header">
        <div className="terris-time-minimap__header-left">
          {isLocal ? (
            <button
              type="button"
              className="terris-time-minimap__back"
              onClick={() => closeTimeMinimapLocal()}
              aria-label="Show all eras"
            >
              ← All eras
            </button>
          ) : (
            <span className="terris-time-minimap__eyebrow">Time</span>
          )}
        </div>
        <div className="terris-time-minimap__readout-wrap">
          <span className="terris-time-minimap__readout" aria-live="polite">
            {formatYear(year)}
          </span>
        </div>
        <div className="terris-time-minimap__header-right">
          <button
            type="button"
            className="terris-time-minimap__pin"
            aria-expanded={uiExpanded}
            aria-label={pinnedExpanded ? 'Minimize timeline panel' : 'Pin timeline panel open'}
            title={pinnedExpanded ? 'Minimize' : 'Pin open'}
            onClick={(e) => {
              e.stopPropagation()
              setPinnedExpanded((p) => !p)
            }}
          >
            {pinnedExpanded ? '▾' : '▴'}
          </button>
          <span className="terris-time-minimap__context">
            {displayMacro.label}
            {isLocal ? <span className="terris-time-minimap__context-mark"> · detail</span> : null}
          </span>
        </div>
      </div>

      <div className="terris-time-minimap__rail" aria-hidden>
        <div className="terris-time-minimap__rail-inner">
          {TIME_ERAS.map((era) => {
            const w = eraSpanFraction(era) * 100
            const l = eraStartFraction(era) * 100
            const lit =
              era.id === (isLocal && timeMinimapMacroId ? timeMinimapMacroId : activeEra.id)
            return (
              <div
                key={era.id}
                className={
                  'terris-time-minimap__rail-cell' +
                  (lit ? ' terris-time-minimap__rail-cell--lit' : '')
                }
                style={{ left: `${l}%`, width: `${w}%` }}
              />
            )
          })}
          <div
            className="terris-time-minimap__rail-playhead"
            style={{ left: `${playheadPctGlobal}%` }}
          />
        </div>
      </div>

      <p className="terris-time-minimap__hint">
        {isLocal
          ? `Within ${focusedMacro?.label} · double-click to snap to a period`
          : 'Drag to move through time · double-click an era for detail'}
      </p>

      <div
        ref={trackRef}
        className="terris-time-minimap__track"
        role="slider"
        tabIndex={0}
        aria-label={isLocal && focusedMacro ? `Time within ${focusedMacro.label}` : 'Navigate time'}
        aria-valuemin={ariaMin}
        aria-valuemax={ariaMax}
        aria-valuenow={year}
        onPointerDown={onTrackPointerDown}
        onPointerMove={onTrackPointerMove}
        onPointerLeave={onTrackPointerLeave}
        onDoubleClick={onTrackDoubleClick}
        onKeyDown={(e) => {
          const step = e.shiftKey ? (isLocal ? 25 : 100) : isLocal ? 5 : 25
          if (e.key === 'ArrowLeft') {
            e.preventDefault()
            stepYear(-step)
          }
          if (e.key === 'ArrowRight') {
            e.preventDefault()
            stepYear(step)
          }
          if (e.key === 'Home') {
            e.preventDefault()
            if (isLocal && focusedMacro) setYear(focusedMacro.start)
            else setYear(TIMELINE_YEAR_MIN)
          }
          if (e.key === 'End') {
            e.preventDefault()
            if (isLocal && focusedMacro) setYear(focusedMacro.end)
            else setYear(TIMELINE_YEAR_MAX)
          }
        }}
      >
        <div className="terris-time-minimap__track-inner">
          {!isLocal &&
            TIME_ERAS.map((era) => {
              const left = eraStartFraction(era) * 100
              const width = eraSpanFraction(era) * 100
              const isActive = era.id === activeEra.id
              const isHover = era.id === hoverMacroId
              return (
                <div
                  key={era.id}
                  className={
                    'terris-time-minimap__segment' +
                    (isActive ? ' terris-time-minimap__segment--active' : '') +
                    (isHover ? ' terris-time-minimap__segment--hover' : '')
                  }
                  style={{ left: `${left}%`, width: `${width}%` }}
                  aria-hidden
                />
              )
            })}

          {isLocal &&
            focusedMacro &&
            getSubPeriodsForMacro(focusedMacro.id).map((sub) => {
              const { leftPct, widthPct } = layoutSubPeriodInMacro(sub, focusedMacro)
              const activeSub = getSubPeriodForYearInMacro(year, focusedMacro.id)
              const isActive = activeSub?.id === sub.id
              const isHover = hoverSubId === sub.id
              return (
                <div
                  key={sub.id}
                  className={
                    'terris-time-minimap__segment terris-time-minimap__segment--sub' +
                    (isActive ? ' terris-time-minimap__segment--active' : '') +
                    (isHover ? ' terris-time-minimap__segment--hover' : '')
                  }
                  style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  aria-hidden
                />
              )
            })}

          {subFocusLayout && (
            <div
              className="terris-time-minimap__focus terris-time-minimap__focus--local"
              style={{
                left: `${subFocusLayout.leftPct}%`,
                width: `${subFocusLayout.widthPct}%`,
              }}
              aria-hidden
            />
          )}

          {!isLocal && (
            <div
              className="terris-time-minimap__focus"
              style={{
                left: `${eraStartFraction(activeEra) * 100}%`,
                width: `${eraSpanFraction(activeEra) * 100}%`,
              }}
              aria-hidden
            />
          )}

          <div
            className="terris-time-minimap__playhead-line"
            style={{
              left: `${playheadPctMain}%`,
              transition:
                reducedMotion || dragging
                  ? 'none'
                  : 'left 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            aria-hidden
          />
          <div
            className={
              'terris-time-minimap__playhead-knob' +
              (dragging ? ' terris-time-minimap__playhead-knob--drag' : '')
            }
            style={{
              left: `${playheadPctMain}%`,
              transition:
                reducedMotion || dragging
                  ? 'none'
                  : 'left 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            aria-hidden
          />
        </div>
      </div>

      <div className="terris-time-minimap__labels" aria-hidden>
        {!isLocal &&
          TIME_ERAS.map((era) => {
            const mid = (era.start + era.end) / 2
            const pct = yearToTimelineFraction(mid) * 100
            return (
              <span key={era.id} className="terris-time-minimap__label" style={{ left: `${pct}%` }}>
                {era.label}
              </span>
            )
          })}
        {isLocal &&
          focusedMacro &&
          getSubPeriodsForMacro(focusedMacro.id).map((sub) => {
            const mid = (sub.start + sub.end) / 2
            const pct = yearToMacroLocalFraction(mid, focusedMacro) * 100
            return (
              <span key={sub.id} className="terris-time-minimap__label" style={{ left: `${pct}%` }}>
                {sub.label}
              </span>
            )
          })}
      </div>
      </div>
    </div>
  )
}
