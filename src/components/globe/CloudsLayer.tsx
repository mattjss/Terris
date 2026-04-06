import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { GLOBE_RADIUS } from '@/data/historical'
import { globeVisualBlendRef } from '@/state/globeVisualBlendRef'
import { EARTH_TEXTURE_URLS } from './earthTextureSlots'
import { CLOUD_SHELL_DRIFT_Y } from './globeRenderConstants'
import { getGlobeVisualSnapshot } from './globeVisualPresets'

/** Slightly above surface — parallax vs terrain; separate from GLOBE_RADIUS for drift. */
const CLOUD_SHELL_SCALE = 1.014

/**
 * Cloud shell with independent slow rotation (physical wind-like drift vs fixed terrain).
 */
export function CloudsLayer() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [cloudMap] = useTexture([EARTH_TEXTURE_URLS.clouds])

  useLayoutEffect(() => {
    /* eslint-disable react-hooks/immutability -- Three.js Texture objects are configured in-place after load */
    cloudMap.wrapS = cloudMap.wrapT = THREE.RepeatWrapping
    cloudMap.colorSpace = THREE.SRGBColorSpace
    cloudMap.anisotropy = 4
    /* eslint-enable react-hooks/immutability */
  }, [cloudMap])

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: cloudMap,
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
      }),
    [cloudMap],
  )

  useFrame((_, delta) => {
    const m = meshRef.current
    if (m) {
      const snap = getGlobeVisualSnapshot(globeVisualBlendRef.current)
      m.rotation.y += delta * CLOUD_SHELL_DRIFT_Y * snap.cloudDriftMul
      const mat = m.material as THREE.MeshBasicMaterial
      mat.opacity = snap.cloudOpacity
    }
  })

  return (
    <mesh
      ref={meshRef}
      scale={CLOUD_SHELL_SCALE}
      renderOrder={2}
      material={material}
    >
      <sphereGeometry args={[GLOBE_RADIUS, 72, 72]} />
    </mesh>
  )
}
