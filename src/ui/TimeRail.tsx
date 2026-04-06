import { useCallback, useId, useState, type ChangeEvent } from 'react'
import { formatYear } from '@/data/historical'

/** Timeline domain (aligned with `Timeline.tsx`). */
export const TIME_RAIL_MIN = -3000
export const TIME_RAIL_MAX = 2025

const ERAS: readonly { label: string; start: number; end: number }[] = [
  { label: 'Ancient', start: -3000, end: -500 },
  { label: 'Classical', start: -500, end: 500 },
  { label: 'Medieval', start: 500, end: 1500 },
  { label: 'Early Modern', start: 1500, end: 1800 },
  { label: 'Modern', start: 1800, end: 2000 },
  { label: 'Present', start: 2000, end: 2025 },
]

function clampYear(y: number): number {
  return Math.max(TIME_RAIL_MIN, Math.min(TIME_RAIL_MAX, Math.round(y)))
}

function eraMidpoint(start: number, end: number): number {
  return clampYear(Math.round((start + end) / 2))
}

/** First era in list whose inclusive range contains `year` (Ancient wins at boundary -500). */
function activeEraIndex(year: number): number {
  const y = clampYear(year)
  for (let i = 0; i < ERAS.length; i++) {
    const e = ERAS[i]!
    if (y >= e.start && y <= e.end) return i
  }
  return ERAS.length - 1
}

export type TimeRailProps = {
  /** Controlled year. When omitted, internal state is used. */
  year?: number
  /** Uncontrolled default (ignored when `year` is set). */
  initialYear?: number
  /** Fires when the user moves the scrubber or selects an era. */
  onYearChange?: (year: number) => void
}

export function TimeRail({
  year: yearProp,
  initialYear = 100,
  onYearChange,
}: TimeRailProps) {
  const controlled = yearProp !== undefined
  const [internalYear, setInternalYear] = useState(() =>
    clampYear(initialYear),
  )

  const year = controlled ? clampYear(yearProp) : internalYear

  const setYear = useCallback(
    (next: number) => {
      const y = clampYear(next)
      if (!controlled) setInternalYear(y)
      onYearChange?.(y)
    },
    [controlled, onYearChange],
  )

  const handleRange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setYear(Number(e.target.value))
    },
    [setYear],
  )

  const handleEra = useCallback(
    (start: number, end: number) => {
      setYear(eraMidpoint(start, end))
    },
    [setYear],
  )

  const railId = useId()
  const activeIdx = activeEraIndex(year)

  return (
    <div className="terris-time-rail" role="region" aria-labelledby={railId}>
      <div className="terris-time-rail__inner">
        <p id={railId} className="terris-time-rail__year" aria-live="polite">
          {formatYear(year)}
        </p>

        <div className="terris-time-rail__track-wrap">
          <input
            className="terris-time-rail__range"
            type="range"
            min={TIME_RAIL_MIN}
            max={TIME_RAIL_MAX}
            step={1}
            value={year}
            onChange={handleRange}
            aria-label="Scrub timeline year"
            aria-valuemin={TIME_RAIL_MIN}
            aria-valuemax={TIME_RAIL_MAX}
            aria-valuenow={year}
          />
        </div>

        <div className="terris-time-rail__eras" role="group" aria-label="Historical eras">
          {ERAS.map((era, i) => {
            const isActive = i === activeIdx
            return (
              <button
                key={era.label}
                type="button"
                className={
                  'terris-time-rail__chip' +
                  (isActive ? ' terris-time-rail__chip--active' : '')
                }
                onClick={() => handleEra(era.start, era.end)}
                aria-pressed={isActive}
                title={`${formatYear(era.start)} – ${formatYear(era.end)}`}
              >
                {era.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
