import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GLOBE_RADIUS } from '@/data/historical'
import { globeVisualBlendRef } from '@/state/globeVisualBlendRef'
import { useExploreScaleStore } from '@/state/exploreScaleStore'
import { getGlobeVisualSnapshot } from './globeVisualPresets'
import { EARTH_SUN_DIRECTION } from './earthTextureSlots'

const vertexShader = /* glsl */ `
varying vec3 vWorldNormal;
varying vec3 vViewDir;

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
  vViewDir = normalize(cameraPosition - worldPos.xyz);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = /* glsl */ `
uniform float uOpacity;
uniform vec3 uSunDir;
uniform vec3 uDeep;
uniform vec3 uEdge;
uniform float uDayBoost;
varying vec3 vWorldNormal;
varying vec3 vViewDir;

void main() {
  vec3 n = normalize(vWorldNormal);
  vec3 v = normalize(vViewDir);
  float limb = 1.0 - abs(dot(n, v));
  float inner = pow(limb, 2.6) * 0.11;
  float outer = pow(limb, 5.4) * 0.13;
  float sunLit = max(dot(n, normalize(uSunDir)), 0.0);
  float daySide = smoothstep(0.0, 0.5, sunLit);

  vec3 deep = uDeep;
  vec3 edge = uEdge;
  vec3 color = mix(deep, edge, clamp(outer * 2.1, 0.0, 1.0));
  color += vec3(0.02, 0.04, 0.07) * daySide * inner * 3.0 * uDayBoost;
  float alpha = (inner + outer) * uOpacity;

  gl_FragColor = vec4(color, alpha);
}
`

/** Additive atmosphere shell — limb glow scales with explore opacity and Atlas/Explorer palette. */
export function Atmosphere() {
  const opacity = useExploreScaleStore((s) => s.earthAtmosphereOpacity)
  const sun = useMemo(
    () =>
      new THREE.Vector3(EARTH_SUN_DIRECTION.x, EARTH_SUN_DIRECTION.y, EARTH_SUN_DIRECTION.z).normalize(),
    [],
  )

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uOpacity: { value: 1 },
          uSunDir: { value: sun.clone() },
          uDeep: { value: new THREE.Vector3(0.035, 0.07, 0.14) },
          uEdge: { value: new THREE.Vector3(0.11, 0.18, 0.3) },
          uDayBoost: { value: 1 },
        },
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [sun],
  )

  useFrame(() => {
    const snap = getGlobeVisualSnapshot(globeVisualBlendRef.current)
    material.uniforms.uOpacity.value = opacity
    material.uniforms.uDeep.value.copy(snap.atmosphereDeep)
    material.uniforms.uEdge.value.copy(snap.atmosphereEdge)
    material.uniforms.uDayBoost.value = snap.atmosphereDayBoost
  })

  return (
    <mesh material={material}>
      <sphereGeometry args={[GLOBE_RADIUS * 1.068, 96, 96]} />
    </mesh>
  )
}
