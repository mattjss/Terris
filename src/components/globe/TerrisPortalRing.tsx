import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useJourneyPhaseStore } from '@/state/useJourneyPhaseStore'
import { JOURNEY_PORTAL_MS } from '@/journey/journeyPhaseTypes'

const ringVert = /* glsl */ `
uniform float uTime;
uniform float uIntensity;
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec3 vLocalPos;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  vViewDir = normalize(-mvPos.xyz);
  vLocalPos = position;
  float wobble = sin(position.y * 14.0 + uTime * 5.5) * 0.018 * uIntensity;
  wobble += sin(position.x * 11.0 - uTime * 4.2) * 0.012 * uIntensity;
  vec3 displaced = position + normal * wobble;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
`

const ringFrag = /* glsl */ `
uniform float uTime;
uniform float uIntensity;
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec3 vLocalPos;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewDir);
  float fresnel = pow(1.0 - clamp(abs(dot(N, V)), 0.0, 1.0), 2.4);
  float band = sin(length(vLocalPos.xy) * 22.0 - uTime * 7.0) * 0.5 + 0.5;
  vec3 base = vec3(0.12, 0.1, 0.16);
  vec3 edge = vec3(0.72, 0.82, 0.95);
  vec3 rim = vec3(0.45, 0.62, 0.88);
  vec3 col = mix(base, edge, fresnel * uIntensity);
  col += rim * band * fresnel * uIntensity * 0.55;
  float alpha = clamp(fresnel * uIntensity * 0.92 + 0.08 * uIntensity, 0.0, 1.0);
  gl_FragColor = vec4(col, alpha);
}
`

const PORTAL_DUR_S = JOURNEY_PORTAL_MS / 1000

/**
 * Metallic discovery ring in view space — portal phase only; Fresnel + shimmer + soft particles.
 */
export function TerrisPortalRing() {
  const root = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const matRef = useRef<THREE.ShaderMaterial | null>(null)
  const portalStartRef = useRef<number | null>(null)
  const phase = useJourneyPhaseStore((s) => s.phase)
  const { camera } = useThree()

  const ringMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uIntensity: { value: 0 },
        },
        vertexShader: ringVert,
        fragmentShader: ringFrag,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
    [],
  )

  matRef.current = ringMat

  const { particleGeo, particleMat } = useMemo(() => {
    const n = 48
    const pos = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2
      const r = 0.42 + Math.random() * 0.28
      pos[i * 3] = Math.cos(a) * r
      pos[i * 3 + 1] = Math.sin(a) * r * 0.35 + (Math.random() - 0.5) * 0.08
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.06
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const mat = new THREE.PointsMaterial({
      color: '#a8c4f0',
      size: 0.028,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })
    return { particleGeo: geo, particleMat: mat }
  }, [])

  useLayoutEffect(() => {
    const g = root.current
    if (!g) return
    camera.add(g)
    g.position.set(0, 0, -1.85)
    return () => {
      camera.remove(g)
    }
  }, [camera])

  useFrame((state) => {
    const g = root.current
    const ring = ringRef.current
    const pts = pointsRef.current
    const mat = matRef.current
    if (!g || !ring || !pts || !mat) return

    if (phase === 'portal') {
      if (portalStartRef.current === null) {
        portalStartRef.current = state.clock.elapsedTime
      }
    } else {
      portalStartRef.current = null
    }

    mat.uniforms.uTime.value = state.clock.elapsedTime

    if (phase !== 'portal') {
      g.visible = false
      ;(pts.material as THREE.PointsMaterial).opacity = 0
      mat.uniforms.uIntensity.value = 0
      return
    }

    g.visible = true
    const t0 = portalStartRef.current ?? state.clock.elapsedTime
    const u = Math.min(1, (state.clock.elapsedTime - t0) / PORTAL_DUR_S)
    const bell = Math.sin(u * Math.PI)
    const peak = bell * bell
    mat.uniforms.uIntensity.value = peak * 1.35

    const pm = pts.material as THREE.PointsMaterial
    pm.opacity = peak * 0.55

    const pulse = 1 + Math.sin(state.clock.elapsedTime * 3.2) * 0.04 * peak
    ring.scale.setScalar(1.05 * pulse)
    g.rotation.z = state.clock.elapsedTime * 0.15 * peak
  })

  return (
    <group ref={root}>
      <mesh ref={ringRef} material={ringMat}>
        <torusGeometry args={[0.52, 0.07, 48, 128]} />
      </mesh>
      <points ref={pointsRef} geometry={particleGeo} material={particleMat} />
    </group>
  )
}
