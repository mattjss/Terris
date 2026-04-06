import * as THREE from 'three'

/**
 * Interpolated globe look — Atlas (documentary / reference) vs Explorer (cozy stylized).
 * Values are lerped by `globeVisualBlendRef.current` (0…1).
 * Product intent + file map: `src/visual-mode/README.md`.
 */

export type GlobeVisualLights = {
  ambient: { intensity: number; color: string }
  key: { intensity: number; color: string }
  fill: { intensity: number; color: string }
  hemi: { sky: string; ground: string; intensity: number }
  rim: { intensity: number; color: string }
}

export type GlobeVisualSnapshot = {
  background: string
  atmosphereDeep: THREE.Vector3
  atmosphereEdge: THREE.Vector3
  atmosphereDayBoost: number
  lights: GlobeVisualLights
  cloudOpacity: number
  cloudDriftMul: number
  starOpacity: number
  starSize: number
  starTint: THREE.Color
  orbitDamping: number
  orbitRotate: number
  autoRotateSpeed: number
  cameraLerpFactor: number
  earthExplorerBlend: number
  poiDim: THREE.Color
  poiBright: THREE.Color
}

const _ca = new THREE.Color()
const _cb = new THREE.Color()
const _va = new THREE.Vector3()
const _vb = new THREE.Vector3()

const ATLAS_DEEP: [number, number, number] = [0.035, 0.07, 0.14]
const ATLAS_EDGE: [number, number, number] = [0.11, 0.18, 0.3]
const EXPLORER_DEEP: [number, number, number] = [0.07, 0.09, 0.22]
const EXPLORER_EDGE: [number, number, number] = [0.38, 0.32, 0.52]

const ATLAS_LIGHTS: GlobeVisualLights = {
  ambient: { intensity: 0.028, color: '#0a1018' },
  key: { intensity: 1.35, color: '#ebecef' },
  fill: { intensity: 0.085, color: '#5a6b7c' },
  hemi: { sky: '#1a2838', ground: '#080a0e', intensity: 0.12 },
  rim: { intensity: 0.038, color: '#1e2a38' },
}

const EXPLORER_LIGHTS: GlobeVisualLights = {
  ambient: { intensity: 0.048, color: '#1e1e2e' },
  key: { intensity: 1.12, color: '#fff4e8' },
  fill: { intensity: 0.11, color: '#8a9cbd' },
  hemi: { sky: '#4a5a78', ground: '#2c2438', intensity: 0.2 },
  rim: { intensity: 0.065, color: '#5a4868' },
}

function mixColor(a: string, b: string, t: number): string {
  return _ca.set(a).lerp(_cb.set(b), t).getStyle()
}

function lerpLights(a: GlobeVisualLights, b: GlobeVisualLights, t: number): GlobeVisualLights {
  return {
    ambient: {
      intensity: a.ambient.intensity + (b.ambient.intensity - a.ambient.intensity) * t,
      color: mixColor(a.ambient.color, b.ambient.color, t),
    },
    key: {
      intensity: a.key.intensity + (b.key.intensity - a.key.intensity) * t,
      color: mixColor(a.key.color, b.key.color, t),
    },
    fill: {
      intensity: a.fill.intensity + (b.fill.intensity - a.fill.intensity) * t,
      color: mixColor(a.fill.color, b.fill.color, t),
    },
    hemi: {
      sky: mixColor(a.hemi.sky, b.hemi.sky, t),
      ground: mixColor(a.hemi.ground, b.hemi.ground, t),
      intensity: a.hemi.intensity + (b.hemi.intensity - a.hemi.intensity) * t,
    },
    rim: {
      intensity: a.rim.intensity + (b.rim.intensity - a.rim.intensity) * t,
      color: mixColor(a.rim.color, b.rim.color, t),
    },
  }
}

const _snapshot: GlobeVisualSnapshot = {
  background: '#070a10',
  atmosphereDeep: new THREE.Vector3(),
  atmosphereEdge: new THREE.Vector3(),
  atmosphereDayBoost: 1,
  lights: ATLAS_LIGHTS,
  cloudOpacity: 0.42,
  cloudDriftMul: 1,
  starOpacity: 0.42,
  starSize: 0.055,
  starTint: new THREE.Color('#ffffff'),
  orbitDamping: 0.048,
  orbitRotate: 0.42,
  autoRotateSpeed: 0.038,
  cameraLerpFactor: 0.025,
  earthExplorerBlend: 0,
  poiDim: new THREE.Color('#b8b8b8'),
  poiBright: new THREE.Color('#ffffff'),
}

/**
 * Single mutable snapshot — safe because all readers use it inside the same `useFrame` tick.
 */
export function getGlobeVisualSnapshot(t: number): GlobeVisualSnapshot {
  const u = Math.min(1, Math.max(0, t))

  _snapshot.background = mixColor('#070a10', '#1a1f2e', u)

  _snapshot.atmosphereDeep.copy(_va.fromArray(ATLAS_DEEP).lerp(_vb.fromArray(EXPLORER_DEEP), u))
  _snapshot.atmosphereEdge.copy(_va.fromArray(ATLAS_EDGE).lerp(_vb.fromArray(EXPLORER_EDGE), u))
  _snapshot.atmosphereDayBoost = 1 + 0.18 * u

  _snapshot.lights = lerpLights(ATLAS_LIGHTS, EXPLORER_LIGHTS, u)

  _snapshot.cloudOpacity = 0.42 + (0.54 - 0.42) * u
  _snapshot.cloudDriftMul = 1 + 0.35 * u
  _snapshot.starOpacity = 0.42 + (0.52 - 0.42) * u
  _snapshot.starSize = 0.055 + (0.068 - 0.055) * u
  _snapshot.starTint.copy(_ca.set('#ffffff').lerp(_cb.set('#ffeef5'), u))

  _snapshot.orbitDamping = 0.048 + (0.056 - 0.048) * u
  _snapshot.orbitRotate = 0.42 + (0.48 - 0.42) * u
  _snapshot.autoRotateSpeed = 0.038 + (0.046 - 0.038) * u
  _snapshot.cameraLerpFactor = 0.025 + (0.032 - 0.025) * u
  _snapshot.earthExplorerBlend = u

  _snapshot.poiDim.copy(_ca.set('#b8b8b8').lerp(_cb.set('#c4b8c8'), u))
  _snapshot.poiBright.copy(_ca.set('#ffffff').lerp(_cb.set('#fff8f0'), u))

  return _snapshot
}
