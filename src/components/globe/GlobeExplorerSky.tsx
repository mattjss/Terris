import { useMemo, useRef, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { globeVisualBlendRef } from '@/state/globeVisualBlendRef'
import { getGlobeVisualSnapshot } from './globeVisualPresets'

const SKY_RADIUS = 118

const vertexShader = /* glsl */ `
varying vec3 vWorldPos;

void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = /* glsl */ `
uniform vec3 uGlobeCenter;
uniform vec3 uHorizon;
uniform vec3 uBand;
uniform vec3 uZenith;
uniform vec3 uAccent;
uniform float uExplorerBlend;

varying vec3 vWorldPos;

void main() {
  vec3 dir = normalize(vWorldPos - uGlobeCenter);
  float h = dir.y * 0.5 + 0.5;
  float a = atan(dir.z, dir.x) / 6.28318530718 + 0.5;

  vec3 col = mix(uHorizon, uBand, smoothstep(0.0, 0.52, h));
  col = mix(col, uZenith, smoothstep(0.32, 1.0, h));
  float band = sin(a * 6.28318530718) * 0.5 + 0.5;
  col += uAccent * (0.028 * band + 0.022) * uExplorerBlend;

  gl_FragColor = vec4(col, 1.0);
}
`

/**
 * Large inner skydome — multicolor gradient visible in Explorer; Atlas uses flat scene.background.
 */
export function GlobeExplorerSky() {
  const meshRef = useRef<THREE.Mesh>(null)
  const globeCenter = useMemo(() => new THREE.Vector3(0.1, -0.05, 0), [])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uGlobeCenter: { value: globeCenter.clone() },
          uHorizon: { value: new THREE.Vector3() },
          uBand: { value: new THREE.Vector3() },
          uZenith: { value: new THREE.Vector3() },
          uAccent: { value: new THREE.Vector3() },
          uExplorerBlend: { value: 0 },
        },
        side: THREE.BackSide,
        depthWrite: false,
        depthTest: true,
      }),
    [globeCenter],
  )

  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (mesh) mesh.renderOrder = -50
  }, [])

  useFrame(() => {
    const mesh = meshRef.current
    if (!mesh) return
    const t = globeVisualBlendRef.current
    const snap = getGlobeVisualSnapshot(t)
    material.uniforms.uExplorerBlend.value = t
    material.uniforms.uHorizon.value.copy(snap.skyHorizon)
    material.uniforms.uBand.value.copy(snap.skyBand)
    material.uniforms.uZenith.value.copy(snap.skyZenith)
    material.uniforms.uAccent.value.copy(snap.skyAccent)

    const vis = t > 0.04
    mesh.visible = vis
  })

  return (
    <mesh ref={meshRef} material={material} frustumCulled={false}>
      <sphereGeometry args={[SKY_RADIUS, 48, 32]} />
    </mesh>
  )
}
