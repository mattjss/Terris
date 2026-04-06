import { useMemo } from 'react'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useExploreScaleStore } from '@/state/exploreScaleStore'
import { lerp } from './exploreScaleMath'

/**
 * Milky Way / deep space context — large backdrop, placeholder only.
 */
export function CosmicPlaceholder() {
  const opacity = useExploreScaleStore((s) => s.cosmicBackdropOpacity)
  const mode = useExploreScaleStore((s) => s.mode)

  const show = mode === 'cosmic' || opacity > 0.02
  const o = useMemo(() => Math.max(0, Math.min(1, opacity)), [opacity])

  if (!show) return null

  return (
    <group>
      {/* Galactic disk — very large, viewer stays inside */}
      <mesh rotation={[0.85, 0.35, -0.2]}>
        <sphereGeometry args={[420, 32, 32]} />
        <meshBasicMaterial
          side={THREE.BackSide}
          color="#0a0c18"
          transparent
          opacity={lerp(0.35, 0.85, o)}
          depthWrite={false}
        />
      </mesh>

      {/* Dust band */}
      <mesh rotation={[1.1, 0.5, -0.15]}>
        <torusGeometry args={[180, 28, 2, 80]} />
        <meshBasicMaterial
          color="#3a2a48"
          transparent
          opacity={0.14 * o}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <Text
        position={[0, 38, -120]}
        fontSize={3.2}
        color="#c8bdd8"
        fillOpacity={0.55 * o}
        anchorX="center"
        anchorY="middle"
      >
        Milky Way
      </Text>
      <Text
        position={[0, 32, -120]}
        fontSize={1.1}
        color="#8a7a9a"
        fillOpacity={0.4 * o}
        anchorX="center"
        anchorY="top"
      >
        contextual field · placeholder
      </Text>
    </group>
  )
}
