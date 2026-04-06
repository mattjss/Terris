import { useMemo, use, Suspense } from 'react'
import * as THREE from 'three'
import { simplify } from '@turf/turf'
import type { FeatureCollection, MultiPolygon, Polygon } from 'geojson'
import { GLOBE_RADIUS } from '@/data/historical'
import { ringToLineLoopGeometry } from '@/lib/geoToThree'

const LAND_URL = `${import.meta.env.BASE_URL}geo/ne_110m_land.geojson`
const RADIUS = GLOBE_RADIUS * 1.0015

let landPromise: Promise<FeatureCollection> | null = null

function loadLand(): Promise<FeatureCollection> {
  if (!landPromise) {
    landPromise = fetch(LAND_URL).then((r) => {
      if (!r.ok) throw new Error('Failed to load land')
      return r.json()
    })
  }
  return landPromise
}

const loopMat = new THREE.LineBasicMaterial({
  color: '#2d4a42',
  transparent: true,
  opacity: 0.1,
  depthWrite: false,
})

function LandOutlinesInner() {
  const raw = use(loadLand())
  const simplified = useMemo(
    () =>
      simplify(raw, {
        tolerance: 0.18,
        highQuality: true,
        mutate: false,
      }) as FeatureCollection,
    [raw],
  )

  const objects = useMemo(() => {
    const out: THREE.Object3D[] = []
    for (const f of simplified.features) {
      const g = f.geometry
      if (g.type === 'Polygon') {
        const poly = g as Polygon
        for (const ring of poly.coordinates) {
          const coords = ring.map((p) => [p[0], p[1]] as [number, number])
          if (coords.length >= 4) {
            const geo = ringToLineLoopGeometry(coords, RADIUS)
            out.push(new THREE.LineLoop(geo, loopMat))
          }
        }
      } else if (g.type === 'MultiPolygon') {
        const mp = g as MultiPolygon
        for (const poly of mp.coordinates) {
          for (const ring of poly) {
            const coords = ring.map((p) => [p[0], p[1]] as [number, number])
            if (coords.length >= 4) {
              const geo = ringToLineLoopGeometry(coords, RADIUS)
              out.push(new THREE.LineLoop(geo, loopMat))
            }
          }
        }
      }
    }
    return out
  }, [simplified])

  return (
    <group>
      {objects.map((obj, i) => (
        <primitive key={`land-${i}`} object={obj} />
      ))}
    </group>
  )
}

export function LandOutlines() {
  return (
    <Suspense fallback={null}>
      <LandOutlinesInner />
    </Suspense>
  )
}
