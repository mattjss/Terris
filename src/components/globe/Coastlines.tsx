import { useMemo, use, Suspense } from 'react'
import * as THREE from 'three'
import { simplify } from '@turf/turf'
import type { FeatureCollection, LineString, MultiLineString } from 'geojson'
import { GLOBE_RADIUS } from '@/data/historical'
import { lineStringToGeometry } from '@/lib/geoToThree'

const COASTLINE_URL = `${import.meta.env.BASE_URL}geo/ne_110m_coastline.geojson`
const RADIUS = GLOBE_RADIUS * 1.002

let coastlinePromise: Promise<FeatureCollection> | null = null

function loadCoastlines(): Promise<FeatureCollection> {
  if (!coastlinePromise) {
    coastlinePromise = fetch(COASTLINE_URL).then((r) => {
      if (!r.ok) throw new Error('Failed to load coastlines')
      return r.json()
    })
  }
  return coastlinePromise
}

const mat = new THREE.LineBasicMaterial({
  color: '#3a5a58',
  transparent: true,
  opacity: 0.35,
  depthWrite: false,
})

function CoastlinesInner() {
  const raw = use(loadCoastlines())
  const simplified = useMemo(
    () =>
      simplify(raw, {
        tolerance: 0.12,
        highQuality: true,
        mutate: false,
      }) as FeatureCollection,
    [raw],
  )

  const lineObjects = useMemo(() => {
    const out: THREE.Line[] = []
    for (const f of simplified.features) {
      const g = f.geometry
      if (g.type === 'LineString') {
        const coords = (g as LineString).coordinates as [number, number][]
        if (coords.length >= 2) {
          const geo = lineStringToGeometry(coords, RADIUS)
          out.push(new THREE.Line(geo, mat))
        }
      } else if (g.type === 'MultiLineString') {
        for (const line of (g as MultiLineString).coordinates) {
          const coords = line as [number, number][]
          if (coords.length >= 2) {
            const geo = lineStringToGeometry(coords, RADIUS)
            out.push(new THREE.Line(geo, mat))
          }
        }
      }
    }
    return out
  }, [simplified])

  return (
    <group>
      {lineObjects.map((obj, i) => (
        <primitive key={`coast-${i}`} object={obj} />
      ))}
    </group>
  )
}

export function Coastlines() {
  return (
    <Suspense fallback={null}>
      <CoastlinesInner />
    </Suspense>
  )
}
