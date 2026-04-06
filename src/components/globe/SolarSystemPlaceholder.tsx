import { useMemo } from 'react'
import { Text } from '@react-three/drei'
import { useExploreScaleStore } from '@/state/exploreScaleStore'
import { GLOBE_WORLD_CENTER } from './globeConstants'
import { lerp } from './exploreScaleMath'

/**
 * Placeholder solar neighborhood: Sun + Moon, Mars, Jupiter at toy scale.
 * Earth is the real globe mesh — these are contextual props + labels.
 */
export function SolarSystemPlaceholder() {
  const opacity = useExploreScaleStore((s) => s.planetaryLabelsOpacity)
  const labelOpacity = useMemo(() => Math.max(0, Math.min(1, opacity)), [opacity])

  if (labelOpacity < 0.015) return null

  return (
    <group position={[GLOBE_WORLD_CENTER.x, GLOBE_WORLD_CENTER.y, GLOBE_WORLD_CENTER.z]}>
      {/* Sun — emissive anchor */}
      <mesh position={[-0.45, 0.12, 0.08]}>
        <sphereGeometry args={[0.11, 24, 24]} />
        <meshStandardMaterial
          color="#ffd7a8"
          emissive="#ff9a3c"
          emissiveIntensity={lerp(0.85, 0.35, 1 - labelOpacity)}
          transparent
          opacity={lerp(1, 0.4, 1 - labelOpacity)}
        />
      </mesh>
      <Text
        position={[-0.45, 0.32, 0.08]}
        fontSize={0.05}
        color="#f0e6dc"
        fillOpacity={labelOpacity}
        anchorX="center"
        anchorY="bottom"
      >
        Sun
      </Text>

      {/* Moon — placeholder near Earth */}
      <mesh position={[0.38, 0.1, -0.12]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color="#c4c8d4" roughness={0.9} metalness={0.05} />
      </mesh>
      <Text
        position={[0.38, 0.22, -0.12]}
        fontSize={0.038}
        color="#d8dce8"
        fillOpacity={labelOpacity}
        anchorX="center"
        anchorY="bottom"
      >
        Moon
      </Text>

      {/* Mars */}
      <mesh position={[1.35, -0.06, 0.35]}>
        <sphereGeometry args={[0.065, 20, 20]} />
        <meshStandardMaterial color="#c85c3c" roughness={0.85} />
      </mesh>
      <Text
        position={[1.35, 0.12, 0.35]}
        fontSize={0.042}
        color="#e8b0a0"
        fillOpacity={labelOpacity}
        anchorX="center"
        anchorY="bottom"
      >
        Mars
      </Text>

      {/* Jupiter */}
      <mesh position={[2.85, 0.04, -0.55]}>
        <sphereGeometry args={[0.14, 24, 24]} />
        <meshStandardMaterial color="#c9a87c" roughness={0.75} />
      </mesh>
      <Text
        position={[2.85, 0.28, -0.55]}
        fontSize={0.044}
        color="#e6d4bc"
        fillOpacity={labelOpacity}
        anchorX="center"
        anchorY="bottom"
      >
        Jupiter
      </Text>

      {/* Orbit hint — subtle torus */}
      <mesh rotation={[Math.PI / 2.4, 0.4, 0]} position={[0.05, 0, 0]}>
        <torusGeometry args={[1.15, 0.004, 8, 64]} />
        <meshBasicMaterial
          color="#8899bb"
          transparent
          opacity={0.12 * labelOpacity}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
