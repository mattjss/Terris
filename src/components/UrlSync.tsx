import { useEffect, useLayoutEffect, useRef } from 'react'
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { useAtlasStore } from '@/store/atlas'
import { useTerrisStore } from '@/state/useTerrisStore'
import { YEAR_DEFAULT, entities } from '@/data/historical'
import { TIMELINE_YEAR_MAX, TIMELINE_YEAR_MIN } from '@/ui/Timeline'

function clampTimelineYear(y: number): number {
  return Math.max(TIMELINE_YEAR_MIN, Math.min(TIMELINE_YEAR_MAX, y))
}

function pathFromStore(year: number, selectedId: string | null): string {
  if (selectedId) {
    const qs = year !== YEAR_DEFAULT ? `?year=${year}` : ''
    return `/entity/${selectedId}${qs}`
  }
  if (year !== YEAR_DEFAULT) return `/year/${year}`
  return '/'
}

/**
 * Keeps React Router URL and Zustand atlas store in sync (replace navigation).
 */
export function RouterSync() {
  const { year: yearParam, entityId } = useParams()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const hydrated = useRef(false)

  useLayoutEffect(() => {
    const yFromPath =
      yearParam !== undefined ? parseInt(yearParam, 10) : Number.NaN
    const yFromQuery = searchParams.get('year')
    const yQ = yFromQuery !== null ? parseInt(yFromQuery, 10) : Number.NaN

    let year: number | null = null
    if (!Number.isNaN(yFromPath)) year = clampTimelineYear(yFromPath)
    else if (!Number.isNaN(yQ)) year = clampTimelineYear(yQ)

    if (entityId && entities.some((e) => e.id === entityId)) {
      useAtlasStore.getState().setSelected(entityId)
    } else if (location.pathname.startsWith('/entity/')) {
      if (!entityId || !entities.some((e) => e.id === entityId)) {
        useAtlasStore.getState().setSelected(null)
      }
    } else {
      useAtlasStore.getState().setSelected(null)
    }

    if (year !== null) {
      useTerrisStore.getState().setYear(year)
    }

    hydrated.current = true
  }, [entityId, yearParam, searchParams, location.pathname])

  const year = useTerrisStore((s) => s.year)
  const selectedId = useAtlasStore((s) => s.selectedId)

  useEffect(() => {
    if (!hydrated.current) return

    const next = pathFromStore(year, selectedId)
    const current = `${location.pathname}${location.search}`
    if (next === current) return

    navigate(next, { replace: true })
  }, [year, selectedId, navigate, location.pathname, location.search])

  return null
}
