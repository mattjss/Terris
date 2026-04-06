import { useLayoutEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { globeVisualBlendRef } from '@/state/globeVisualBlendRef'
import { useExploreScaleStore } from '@/state/exploreScaleStore'
import { useAtlasStore } from '@/store/atlas'
import { useJourneyPhaseStore } from '@/state/useJourneyPhaseStore'

/**
 * Minimal “journey craft” in view-space — cozy flyer framing without a full vehicle sim.
 * Hidden in Atlas, reduced when not on Earth scale.
 */
export function TravelCraft() {
  const root = useRef<THREE.Group>(null)
  const hull = useRef<THREE.Mesh>(null)
  const glow = useRef<THREE.Mesh>(null)
  const { camera } = useThree()

  useLayoutEffect(() => {
    const g = root.current
    if (!g) return
    camera.add(g)
    g.position.set(0.22, -0.2, -2.35)
    g.rotation.set(-0.12, 0.2, 0.06)
    return () => {
      camera.remove(g)
    }
  }, [camera])

  useFrame(() => {
    const g = root.current
    const h = hull.current
    const gl = glow.current
    if (!g || !h || !gl) return

    const t = globeVisualBlendRef.current
    const earth = useExploreScaleStore.getState().mode === 'earth'
    const selected = useAtlasStore.getState().selectedId
    const phase = useJourneyPhaseStore.getState().phase
    const journeyLeg =
      earth &&
      (phase === 'travel' || phase === 'arrival')
    const explorerFraming = t > 0.12 && earth && !selected
    const show = journeyLeg || explorerFraming
    g.visible = show
    if (!show) return

    const travelBoost = journeyLeg ? 1.35 : 1
    const bob =
      Math.sin(performance.now() * 0.0011) * 0.012 * travelBoost
    const sway = Math.sin(performance.now() * 0.00085) * 0.006 * travelBoost
    g.position.y = -0.2 + bob
    g.position.x = 0.22 + sway
    g.rotation.z =
      0.06 + Math.sin(performance.now() * 0.0009) * 0.025 * travelBoost

    const mat = h.material as THREE.MeshStandardMaterial
    const em = gl.material as THREE.MeshBasicMaterial
    mat.emissiveIntensity = (0.35 + t * 0.25) * travelBoost
    em.opacity = (0.22 + t * 0.2) * Math.min(1, travelBoost)
  })

  return (
    <group ref={root}>
      <mesh ref={hull} castShadow={false}>
        <coneGeometry args={[0.085, 0.22, 5]} />
        <meshStandardMaterial
          color="#c8b8d8"
          metalness={0.35}
          roughness={0.42}
          emissive="#6a5088"
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh ref={glow} position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.05, 0.12, 24]} />
        <meshBasicMaterial color="#c4a8e8" transparent opacity={0.28} depthWrite={false} />
      </mesh>
    </group>
  )
}
