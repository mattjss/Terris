import { useRef, useCallback, useEffect, useState } from 'react'
import { ERAS, YEAR_MIN, YEAR_MAX, formatYear } from '@/data/historical'
import { useAtlasStore } from '@/store/atlas'

function yearToPercent(year: number): number {
  return ((year - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * 100
}

function percentToYear(pct: number): number {
  return Math.round(YEAR_MIN + (pct / 100) * (YEAR_MAX - YEAR_MIN))
}

export function TimelineSlider() {
  const { currentYear, setYear } = useAtlasStore()
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)

  const thumbPct = yearToPercent(currentYear)

  const updateFromPointer = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return
      const rect = trackRef.current.getBoundingClientRect()
      const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
      setYear(percentToYear(pct))
    },
    [setYear],
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      setDragging(true)
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      updateFromPointer(e.clientX)
    },
    [updateFromPointer],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return
      updateFromPointer(e.clientX)
    },
    [dragging, updateFromPointer],
  )

  const handlePointerUp = useCallback(() => {
    setDragging(false)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return
      const step = e.shiftKey ? 100 : 25
      if (e.key === 'ArrowLeft' || e.key === '[') {
        setYear(Math.max(YEAR_MIN, currentYear - step))
      } else if (e.key === 'ArrowRight' || e.key === ']') {
        setYear(Math.min(YEAR_MAX, currentYear + step))
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [currentYear, setYear])

  return (
    <div
      className="
        pointer-events-auto w-full px-5 pb-3 pt-1
        max-md:px-3 max-md:pb-2
      "
      aria-label="Timeline"
    >
      {/* Era labels */}
      <div className="relative h-3 mb-0.5 select-none">
        {ERAS.map((era) => {
          const left = yearToPercent(era.start)
          const width = yearToPercent(era.end) - left
          return (
            <span
              key={era.label}
              className="absolute text-[8px] tracking-[0.06em] uppercase text-[--color-text-muted] whitespace-nowrap"
              style={{
                left: `${left + width / 2}%`,
                transform: 'translateX(-50%)',
              }}
            >
              {era.label}
            </span>
          )
        })}
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="relative h-6 flex items-center cursor-pointer touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="slider"
        aria-valuemin={YEAR_MIN}
        aria-valuemax={YEAR_MAX}
        aria-valuenow={currentYear}
        aria-label="Time period"
        tabIndex={0}
      >
        {/* Background segments per era */}
        <div className="absolute inset-x-0 h-px top-1/2 -translate-y-1/2">
          {ERAS.map((era, i) => {
            const left = yearToPercent(era.start)
            const width = yearToPercent(era.end) - left
            return (
              <div
                key={era.label}
                className="absolute h-full"
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  background: `rgba(255,255,255,${0.04 + i * 0.01})`,
                }}
              />
            )
          })}
        </div>

        {/* Active fill */}
        <div
          className="absolute h-px top-1/2 -translate-y-1/2 left-0"
          style={{
            width: `${thumbPct}%`,
            background: 'rgba(79, 209, 197, 0.15)',
          }}
        />

        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
          style={{ left: `${thumbPct}%` }}
        >
          <div
            className="w-2 h-2 rounded-full transition-transform duration-100"
            style={{
              background: '#4fd1c5',
              boxShadow: '0 0 8px rgba(79, 209, 197, 0.4)',
              transform: dragging ? 'scale(1.3)' : 'scale(1)',
            }}
          />
        </div>
      </div>

      {/* Year display */}
      <div className="flex items-center justify-between select-none">
        <span className="text-[8px] text-[--color-text-muted] tabular-nums">
          {formatYear(YEAR_MIN)}
        </span>
        <span
          className="text-[11px] font-medium text-[--color-accent] tabular-nums tracking-wide"
          style={{ textShadow: '0 0 12px rgba(79, 209, 197, 0.3)' }}
        >
          {formatYear(currentYear)}
        </span>
        <span className="text-[8px] text-[--color-text-muted] tabular-nums">
          {formatYear(YEAR_MAX)}
        </span>
      </div>
    </div>
  )
}
