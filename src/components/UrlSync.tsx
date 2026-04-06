import { useEffect, useLayoutEffect, useRef } from 'react'
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { useAtlasStore } from '@/store/atlas'
import { YEAR_DEFAULT, YEAR_MAX, YEAR_MIN, entities } from '@/data/historical'

function clampYear(y: number): number {
  return Math.max(YEAR_MIN, Math.min(YEAR_MAX, y))
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
    if (!Number.isNaN(yFromPath)) year = clampYear(yFromPath)
    else if (!Number.isNaN(yQ)) year = clampYear(yQ)

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
      useAtlasStore.getState().setYear(year)
    }

    hydrated.current = true
  }, [entityId, yearParam, searchParams, location.pathname])

  const currentYear = useAtlasStore((s) => s.currentYear)
  const selectedId = useAtlasStore((s) => s.selectedId)

  useEffect(() => {
    if (!hydrated.current) return

    const next = pathFromStore(currentYear, selectedId)
    const current = `${location.pathname}${location.search}`
    if (next === current) return

    navigate(next, { replace: true })
  }, [currentYear, selectedId, navigate, location.pathname, location.search])

  return null
}
