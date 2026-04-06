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
      <style>{`
        .terris-timeline-root {
          --terris-tl-bg: #050505;
          --terris-tl-line: rgba(255, 255, 255, 0.12);
          --terris-tl-fg: rgba(255, 255, 255, 0.92);
          --terris-tl-muted: rgba(255, 255, 255, 0.38);
          --terris-tl-dim: rgba(255, 255, 255, 0.2);
          --terris-tl-mono: var(--font-terris-mono, "Geist Mono", ui-monospace, monospace);
          width: 100%;
          max-width: min(720px, 92vw);
          margin-inline: auto;
          padding: 16px 18px 14px;
          background: var(--terris-tl-bg);
          border: 1px solid var(--terris-tl-line);
          border-radius: 0;
          box-sizing: border-box;
        }
        .terris-timeline-readout {
          font-family: var(--terris-tl-mono);
          font-size: clamp(22px, 5vw, 28px);
          font-weight: 500;
          letter-spacing: 0.06em;
          font-variant-numeric: tabular-nums;
          text-align: center;
          color: var(--terris-tl-fg);
          margin: 0 0 14px;
          line-height: 1.15;
        }
        .terris-timeline-track-wrap {
          position: relative;
          padding: 10px 0 4px;
        }
        .terris-timeline-range {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 28px;
          background: transparent;
          cursor: grab;
          margin: 0;
        }
        .terris-timeline-range:active {
          cursor: grabbing;
        }
        .terris-timeline-range:focus {
          outline: none;
        }
        .terris-timeline-range:focus-visible {
          outline: 1px solid rgba(255, 255, 255, 0.35);
          outline-offset: 4px;
        }
        /* WebKit track */
        .terris-timeline-range::-webkit-slider-runnable-track {
          height: 1px;
          background: var(--terris-tl-line);
          border: none;
        }
        .terris-timeline-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 10px;
          height: 10px;
          margin-top: -4.5px;
          background: var(--terris-tl-bg);
          border: 1px solid rgba(255, 255, 255, 0.45);
          border-radius: 0;
          box-shadow: none;
        }
        /* Firefox */
        .terris-timeline-range::-moz-range-track {
          height: 1px;
          background: var(--terris-tl-line);
          border: none;
        }
        .terris-timeline-range::-moz-range-thumb {
          width: 10px;
          height: 10px;
          background: var(--terris-tl-bg);
          border: 1px solid rgba(255, 255, 255, 0.45);
          border-radius: 0;
          cursor: grab;
        }
        .terris-timeline-eras {
          position: relative;
          height: 28px;
          margin-top: 6px;
          font-family: var(--terris-tl-mono);
          font-size: 8px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--terris-tl-dim);
        }
        .terris-timeline-eras span {
          position: absolute;
          transform: translateX(-50%);
          white-space: nowrap;
          max-width: 22%;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;
        }
        .terris-timeline-bounds {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          font-family: var(--terris-tl-mono);
          font-size: 9px;
          letter-spacing: 0.08em;
          color: var(--terris-tl-muted);
          font-variant-numeric: tabular-nums;
        }
      `}</style>

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
