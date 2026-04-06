import { useLayoutEffect, useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { GLOBE_RADIUS } from '@/data/historical'
import { EARTH_TEXTURE_URLS } from './earthTextureConfig'

const CLOUD_SCALE = 1.012

/**
 * Soft cloud veil — prepared for time-of-day / animated wind (uniform hook later).
 */
export function CloudsLayer() {
  const [cloudMap] = useTexture([EARTH_TEXTURE_URLS.clouds])

  useLayoutEffect(() => {
    /* eslint-disable react-hooks/immutability -- Three.js Texture objects are configured in-place after load */
    cloudMap.wrapS = cloudMap.wrapT = THREE.RepeatWrapping
    cloudMap.colorSpace = THREE.SRGBColorSpace
    /* eslint-enable react-hooks/immutability */
  }, [cloudMap])

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: cloudMap,
        transparent: true,
        opacity: 0.48,
        depthWrite: false,
      }),
    [cloudMap],
  )

  return (
    <mesh scale={CLOUD_SCALE} renderOrder={2} material={material}>
      <sphereGeometry args={[GLOBE_RADIUS, 96, 96]} />
    </mesh>
  )
}
