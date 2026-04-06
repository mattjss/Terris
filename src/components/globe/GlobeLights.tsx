import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { EARTH_SUN_DIRECTION } from './earthTextureSlots'
import { globeVisualBlendRef } from '@/state/globeVisualBlendRef'
import { getGlobeVisualSnapshot } from './globeVisualPresets'

/**
 * Key/fill/rim rig — intensities and colors follow Atlas vs Explorer (warm educational vs cozy).
 */
export function GlobeLights() {
  const sun = useMemo(
    () =>
      new THREE.Vector3(EARTH_SUN_DIRECTION.x, EARTH_SUN_DIRECTION.y, EARTH_SUN_DIRECTION.z).normalize(),
    [],
  )

  const ambientRef = useRef<THREE.AmbientLight>(null)
  const keyRef = useRef<THREE.DirectionalLight>(null)
  const fillRef = useRef<THREE.DirectionalLight>(null)
  const hemiRef = useRef<THREE.HemisphereLight>(null)
  const rimRef = useRef<THREE.DirectionalLight>(null)

  useFrame(() => {
    const L = getGlobeVisualSnapshot(globeVisualBlendRef.current).lights
    const ambient = ambientRef.current
    const key = keyRef.current
    const fill = fillRef.current
    const hemi = hemiRef.current
    const rim = rimRef.current
    if (ambient) {
      ambient.intensity = L.ambient.intensity
      ambient.color.set(L.ambient.color)
    }
    if (key) {
      key.intensity = L.key.intensity
      key.color.set(L.key.color)
      key.position.set(sun.x * 18, sun.y * 18, sun.z * 18)
    }
    if (fill) {
      fill.intensity = L.fill.intensity
      fill.color.set(L.fill.color)
      fill.position.set(-sun.x * 10, -sun.y * 8, -sun.z * 10)
    }
    if (hemi) {
      hemi.intensity = L.hemi.intensity
      hemi.color.set(L.hemi.sky)
      hemi.groundColor.set(L.hemi.ground)
    }
    if (rim) {
      rim.intensity = L.rim.intensity
      rim.color.set(L.rim.color)
    }
  })

  return (
    <>
      <ambientLight ref={ambientRef} />
      <directionalLight ref={keyRef} castShadow={false} />
      <directionalLight ref={fillRef} castShadow={false} />
      <hemisphereLight ref={hemiRef} />
      <directionalLight ref={rimRef} position={[0.15, -3.8, 0.9]} castShadow={false} />
    </>
  )
}
