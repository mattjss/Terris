import { useEffect } from 'react'
import { useExploreScaleStore } from '@/state/exploreScaleStore'
import { useTerrisStore } from '@/state/useTerrisStore'
import { TIMELINE_YEAR_MIN, TIMELINE_YEAR_MAX } from '@/ui/Timeline'

/** Arrow keys / [ ] adjust global Terris year (aligned with Timeline range). */
export function useYearKeyboard() {
  const currentYear = useTerrisStore((s) => s.year)
  const setYear = useTerrisStore((s) => s.setYear)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (useExploreScaleStore.getState().mode !== 'earth') return
      if (document.activeElement?.tagName === 'INPUT') return
      const step = e.shiftKey ? 100 : 25
      if (e.key === 'ArrowLeft' || e.key === '[') {
        e.preventDefault()
        setYear(Math.max(TIMELINE_YEAR_MIN, currentYear - step))
      } else if (e.key === 'ArrowRight' || e.key === ']') {
        e.preventDefault()
        setYear(Math.min(TIMELINE_YEAR_MAX, currentYear + step))
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [currentYear, setYear])
}
