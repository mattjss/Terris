import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {
  type HistoricalEntity,
  latLngToVec3,
  GLOBE_RADIUS,
} from '@/data/historical'
import { useAtlasStore, useVisibleEntities } from '@/store/atlas'

function RouteSegment({
  from,
  to,
  color,
  index,
}: {
  from: [number, number]
  to: [number, number]
  color: string
  index: number
}) {
  const dotRef = useRef<THREE.Mesh>(null)
  const reducedMotion = useAtlasStore((s) => s.reducedMotion)

  const { lineObj, curve, start } = useMemo(() => {
    const startVec = new THREE.Vector3(...latLngToVec3(from[0], from[1], GLOBE_RADIUS))
    const endVec = new THREE.Vector3(...latLngToVec3(to[0], to[1], GLOBE_RADIUS))

    const mid = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5)
    const dist = startVec.distanceTo(endVec)
    mid.normalize().multiplyScalar(GLOBE_RADIUS + dist * 0.25)

    const curve = new THREE.QuadraticBezierCurve3(startVec, mid, endVec)
    const points = curve.getPoints(48)
    const geo = new THREE.BufferGeometry().setFromPoints(points)
    const mat = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.06,
      depthWrite: false,
    })
    const lineObj = new THREE.Line(geo, mat)

    return { lineObj, curve, start: curve.getPoint(0) }
  }, [from, to, color])

  useFrame(({ clock }) => {
    if (!dotRef.current) return
    if (reducedMotion) {
      dotRef.current.position.copy(start)
      return
    }
    const speed = 0.04 + index * 0.003
    const offset = index * 0.27
    const t = (clock.elapsedTime * speed + offset) % 1
    dotRef.current.position.copy(curve.getPoint(t))
  })

  return (
    <group>
      <primitive object={lineObj} />
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.006, 6, 6]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

function TradeRoute({ entity, baseIndex }: { entity: HistoricalEntity; baseIndex: number }) {
  const path = entity.path
  if (!path || path.length < 2) return null

  return (
    <group>
      {path.slice(0, -1).map((from, i) => (
        <RouteSegment
          key={i}
          from={from}
          to={path[i + 1]}
          color={entity.color}
          index={baseIndex + i}
        />
      ))}
    </group>
  )
}

export function TradeRoutes() {
  const visible = useVisibleEntities()

  const routes = useMemo(
    () => visible.filter((e) => e.type === 'trade-route'),
    [visible],
  )

  const routeOffsets = useMemo(() => {
    const offsets: number[] = []
    let sum = 0
    for (const r of routes) {
      offsets.push(sum)
      sum += (r.path?.length ?? 1) - 1
    }
    return offsets
  }, [routes])

  return (
    <group>
      {routes.map((route, i) => (
        <TradeRoute
          key={route.id}
          entity={route}
          baseIndex={routeOffsets[i] ?? 0}
        />
      ))}
    </group>
  )
}
