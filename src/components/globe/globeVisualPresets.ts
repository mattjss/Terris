import * as THREE from 'three'

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
  atmosphereGlowMul: number
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
  cameraDampLambda: number
  earthExplorerBlend: number
  poiDim: THREE.Color
  poiBright: THREE.Color
  skyHorizon: THREE.Color
  skyBand: THREE.Color
  skyZenith: THREE.Color
  skyAccent: THREE.Color
}

const LIGHTS: GlobeVisualLights = {
  ambient: { intensity: 0.015, color: '#080c14' },
  key: { intensity: 1.6, color: '#e0e4ea' },
  fill: { intensity: 0.04, color: '#3a4858' },
  hemi: { sky: '#101820', ground: '#040608', intensity: 0.06 },
  rim: { intensity: 0.02, color: '#141c28' },
}

const _snapshot: GlobeVisualSnapshot = {
  background: '#040608',
  atmosphereDeep: new THREE.Vector3(0.02, 0.04, 0.08),
  atmosphereEdge: new THREE.Vector3(0.08, 0.12, 0.22),
  atmosphereDayBoost: 0.8,
  atmosphereGlowMul: 0.6,
  lights: LIGHTS,
  cloudOpacity: 0.18,
  cloudDriftMul: 0.5,
  starOpacity: 0.55,
  starSize: 0.04,
  starTint: new THREE.Color('#c0c8d8'),
  orbitDamping: 0.04,
  orbitRotate: 0.35,
  autoRotateSpeed: 0.025,
  cameraLerpFactor: 0.02,
  cameraDampLambda: 6.0,
  earthExplorerBlend: 0,
  poiDim: new THREE.Color('#808890'),
  poiBright: new THREE.Color('#e0e4ea'),
  skyHorizon: new THREE.Color('#040608'),
  skyBand: new THREE.Color('#080c14'),
  skyZenith: new THREE.Color('#020406'),
  skyAccent: new THREE.Color('#000000'),
}

export function getGlobeVisualSnapshot(_t: number): GlobeVisualSnapshot {
  return _snapshot
}
