import { useMemo } from 'react'
import * as THREE from 'three'
import type { MultiPolygon, Polygon } from 'geojson'
import { GLOBE_RADIUS } from '@/data/historical'
import { boundariesVisibleAtYear } from '@/data/empireBoundaries'
import { ringToLineLoopGeometry } from '@/lib/geoToThree'
import { useAtlasStore } from '@/store/atlas'

const RADIUS = GLOBE_RADIUS * 1.0018

function polygonToLineLoops(
  poly: Polygon | MultiPolygon,
  color: string,
): THREE.LineLoop[] {
  const loops: THREE.LineLoop[] = []
  const mat = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
  })

  const addRing = (ring: [number, number][]) => {
    if (ring.length < 4) return
    const coords = ring.map((p) => [p[0], p[1]] as [number, number])
    const geo = ringToLineLoopGeometry(coords, RADIUS)
    loops.push(new THREE.LineLoop(geo, mat))
  }

  if (poly.type === 'Polygon') {
    for (const ring of poly.coordinates) {
      addRing(ring as [number, number][])
    }
  } else {
    for (const polyCoords of poly.coordinates) {
      for (const ring of polyCoords) {
        addRing(ring as [number, number][])
      }
    }
  }
  return loops
}

export function BoundaryPolygons() {
  const currentYear = useAtlasStore((s) => s.currentYear)
  const activeFilters = useAtlasStore((s) => s.activeFilters)
  const showEmpires =
    activeFilters.length === 0 || activeFilters.includes('empire')

  const objects = useMemo(() => {
    if (!showEmpires) return []
    const visible = boundariesVisibleAtYear(currentYear)
    const out: THREE.Object3D[] = []
    for (const b of visible) {
      const loops = polygonToLineLoops(
        b.feature.geometry as Polygon | MultiPolygon,
        b.color,
      )
      out.push(...loops)
    }
    return out
  }, [currentYear, showEmpires])

  return (
    <group>
      {objects.map((obj, i) => (
        <primitive key={`bnd-${i}`} object={obj} />
      ))}
    </group>
  )
}
