import { useCallback, useState, type ChangeEvent } from 'react'
import { formatYear } from '@/data/historical'

/** Timeline domain (component-local; not wired to globe data yet). */
export const TIMELINE_YEAR_MIN = -3000
export const TIMELINE_YEAR_MAX = 2025

export type TimelineProps = {
  /** Controlled year from global store; when set, internal state is ignored. */
  year?: number
  /** Uncontrolled initial year; defaults to 100 CE. Ignored when `year` is controlled. */
  initialYear?: number
  /** Fires when the user moves the scrubber (not on mount). */
  onYearChange?: (year: number) => void
}

const ERAS: { label: string; start: number; end: number }[] = [
  { label: 'Ancient', start: -3000, end: -500 },
  { label: 'Classical', start: -500, end: 500 },
  { label: 'Medieval', start: 500, end: 1500 },
  { label: 'Early Modern', start: 1500, end: 1800 },
  { label: 'Modern', start: 1800, end: 2000 },
  { label: 'Present', start: 2000, end: 2025 },
]

function yearToPercent(year: number): number {
  const span = TIMELINE_YEAR_MAX - TIMELINE_YEAR_MIN
  return ((year - TIMELINE_YEAR_MIN) / span) * 100
}

function eraLabelLeftPct(start: number, end: number): number {
  const mid = (start + end) / 2
  return yearToPercent(mid)
}

export function Timeline({
  year: yearProp,
  initialYear = 100,
  onYearChange,
}: TimelineProps) {
  const controlled = yearProp !== undefined
  const [internalYear, setInternalYear] = useState(() =>
    clampYear(initialYear, TIMELINE_YEAR_MIN, TIMELINE_YEAR_MAX),
  )

  const year = controlled
    ? clampYear(yearProp, TIMELINE_YEAR_MIN, TIMELINE_YEAR_MAX)
    : internalYear

  const handleInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const y = Number(e.target.value)
      if (!controlled) setInternalYear(y)
      onYearChange?.(y)
    },
    [controlled, onYearChange],
  )

  return (
    <div className="terris-timeline-root">
      <p className="terris-timeline-readout" aria-live="polite">
        {formatYear(year)}
      </p>

      <div className="terris-timeline-track-wrap">
        <input
          className="terris-timeline-range"
          type="range"
          min={TIMELINE_YEAR_MIN}
          max={TIMELINE_YEAR_MAX}
          step={1}
          value={year}
          onChange={handleInput}
          aria-label="Timeline year"
          aria-valuemin={TIMELINE_YEAR_MIN}
          aria-valuemax={TIMELINE_YEAR_MAX}
          aria-valuenow={year}
        />
      </div>

      <div className="terris-timeline-eras" aria-hidden>
        {ERAS.map((era) => (
          <span
            key={era.label}
            style={{ left: `${eraLabelLeftPct(era.start, era.end)}%` }}
            title={`${formatYear(era.start)} – ${formatYear(era.end)}`}
          >
            {era.label}
          </span>
        ))}
      </div>

      <div className="terris-timeline-bounds">
        <span>{formatYear(TIMELINE_YEAR_MIN)}</span>
        <span>{formatYear(TIMELINE_YEAR_MAX)}</span>
      </div>
    </div>
  )
}

function clampYear(y: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, y))
}
