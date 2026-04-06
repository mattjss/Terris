import { useMemo, forwardRef, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { GLOBE_RADIUS } from '@/data/historical'
import { globeVisualBlendRef } from '@/state/globeVisualBlendRef'
import { getGlobeVisualSnapshot } from './globeVisualPresets'
import { EARTH_SUN_DIRECTION, EARTH_TEXTURE_URLS } from './earthTextureSlots'
import { earthFragmentShader, earthVertexShader } from './earthShaders'

/**
 * Layered Earth mesh — day, topography, normal detail, night lights, ocean specular.
 * See `earthTextureSlots.ts` for asset swap / NASA Blue Marble notes.
 */
export const EarthAtlas = forwardRef<THREE.Mesh>(function EarthAtlas(_props, ref) {
  const [dayMap, topoMap, normalMap, nightLightsMap, specularMap] = useTexture([
    EARTH_TEXTURE_URLS.dayColor,
    EARTH_TEXTURE_URLS.topography,
    EARTH_TEXTURE_URLS.normal,
    EARTH_TEXTURE_URLS.nightLights,
    EARTH_TEXTURE_URLS.specularOcean,
  ])

  useLayoutEffect(() => {
    /* eslint-disable react-hooks/immutability -- Three.js Texture objects are configured in-place after load */
    for (const t of [dayMap, topoMap, normalMap, nightLightsMap, specularMap]) {
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping
      t.anisotropy = 8
    }
    dayMap.colorSpace = THREE.SRGBColorSpace
    nightLightsMap.colorSpace = THREE.SRGBColorSpace
    topoMap.colorSpace = THREE.LinearSRGBColorSpace
    normalMap.colorSpace = THREE.LinearSRGBColorSpace
    specularMap.colorSpace = THREE.LinearSRGBColorSpace
    /* eslint-enable react-hooks/immutability */
  }, [dayMap, topoMap, normalMap, nightLightsMap, specularMap])

  const sunDir = useMemo(
    () =>
      new THREE.Vector3(EARTH_SUN_DIRECTION.x, EARTH_SUN_DIRECTION.y, EARTH_SUN_DIRECTION.z).normalize(),
    [],
  )

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: earthVertexShader,
      fragmentShader: earthFragmentShader,
      uniforms: {
        dayMap: { value: dayMap },
        topoMap: { value: topoMap },
        normalMap: { value: normalMap },
        nightLightsMap: { value: nightLightsMap },
        specularMap: { value: specularMap },
        sunDirection: { value: sunDir.clone() },
        uExplorerBlend: { value: 0 },
      },
    })
  }, [dayMap, topoMap, normalMap, nightLightsMap, specularMap, sunDir])

  useFrame(() => {
    const ex = getGlobeVisualSnapshot(globeVisualBlendRef.current).earthExplorerBlend
    material.uniforms.uExplorerBlend.value = ex
  })

  return (
    <mesh ref={ref} material={material}>
      <sphereGeometry args={[GLOBE_RADIUS, 160, 160]} />
    </mesh>
  )
})
