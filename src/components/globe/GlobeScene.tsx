import { useRef, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import { Earth } from './Earth'
import { Atmosphere } from './Atmosphere'
import { StarField } from './StarField'
import { HistoricalMarkers } from './HistoricalMarkers'
import { EmpireOverlay } from './EmpireOverlay'
import { TradeRoutes } from './TradeRoutes'
import { useAtlasStore } from '@/store/atlas'
import { entities, latLngToVec3 } from '@/data/historical'

const _dir = new THREE.Vector3()

const FOCUS_DISTANCE: Record<string, number> = {
  place: 4.2,
  architecture: 3.8,
  battle: 4.2,
  empire: 5.4,
  'trade-route': 5.0,
}

export function GlobeScene() {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const targetPos = useRef<THREE.Vector3 | null>(null)
  const { camera } = useThree()
  const selectedId = useAtlasStore((s) => s.selectedId)
  const reducedMotion = useAtlasStore((s) => s.reducedMotion)
  const prevSelectedRef = useRef<string | null>(null)

  const handlePointerMissed = useCallback(() => {
    useAtlasStore.getState().setSelected(null)
  }, [])

  useFrame(() => {
    if (selectedId !== prevSelectedRef.current) {
      prevSelectedRef.current = selectedId
      if (selectedId) {
        const entity = entities.find((e) => e.id === selectedId)
        if (entity) {
          _dir.set(...latLngToVec3(entity.lat, entity.lng, 1)).normalize()
          const dist = FOCUS_DISTANCE[entity.type] ?? 4.5
          targetPos.current = _dir.clone().multiplyScalar(dist)
        }
      } else {
        targetPos.current = null
      }
    }

    if (targetPos.current) {
      const factor = reducedMotion ? 1 : 0.025
      camera.position.lerp(targetPos.current, factor)
      if (camera.position.distanceTo(targetPos.current) < 0.015) {
        targetPos.current = null
      }
    }

    controlsRef.current?.update()
  })

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.04}
        minDistance={3.2}
        maxDistance={10}
        enablePan={false}
        autoRotate={!selectedId && !reducedMotion}
        autoRotateSpeed={0.15}
        rotateSpeed={0.5}
        makeDefault
      />

      <directionalLight position={[5, 3, 4]} intensity={0.7} color="#ffe8d6" />
      <directionalLight position={[-4, -1, -3]} intensity={0.15} color="#8ecae6" />
      <ambientLight intensity={0.06} />

      <group position={[0.1, -0.05, 0]} onPointerMissed={handlePointerMissed}>
        <Earth />
        <Atmosphere />
        <EmpireOverlay />
        <HistoricalMarkers />
        <TradeRoutes />
      </group>
      <StarField />
    </>
  )
}
