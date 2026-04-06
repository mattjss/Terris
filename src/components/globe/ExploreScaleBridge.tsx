import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import { useExploreScaleStore } from '@/state/exploreScaleStore'
import { useAtlasStore } from '@/store/atlas'
import { useTerrisStore } from '@/state/useTerrisStore'
import { GLOBE_WORLD_CENTER } from './globeConstants'
import {
  COSMIC_TO_PLANETARY_DISTANCE,
  COSMIC_VIEW_CAMERA_DISTANCE,
  EARTH_TO_PLANETARY_DISTANCE,
  EXPLORE_TRANSITION_DURATION_EARTH_PLANETARY,
  EXPLORE_TRANSITION_DURATION_PLANETARY_COSMIC,
  PLANETARY_TO_COSMIC_DISTANCE,
  PLANETARY_TO_EARTH_DISTANCE,
  PLANETARY_VIEW_CAMERA_DISTANCE,
} from './exploreScaleConstants'
import { lerp, smoothstep01 } from './exploreScaleMath'

const _earthCenter = new THREE.Vector3(
  GLOBE_WORLD_CENTER.x,
  GLOBE_WORLD_CENTER.y,
  GLOBE_WORLD_CENTER.z,
)

type TransitionKind =
  | 'none'
  | 'earth-planetary-out'
  | 'earth-planetary-in'
  | 'planetary-cosmic-out'
  | 'planetary-cosmic-in'

/**
 * Threshold-based scale transitions + opacity choreography for atmosphere / labels.
 */
export function ExploreScaleBridge({
  controlsRef,
}: {
  controlsRef: React.RefObject<OrbitControlsImpl | null>
}) {
  const transitionElapsed = useRef(0)
  const transitionKind = useRef<TransitionKind>('none')

  const { camera } = useThree()

  useFrame((_, delta) => {
    const uiMode = useTerrisStore.getState().uiMode
    const distance = useAtlasStore.getState().globeView.distance
    const reducedMotion = useAtlasStore.getState().reducedMotion

    const exp = useExploreScaleStore.getState()
    const {
      mode,
      transitionState,
      transitionCameraStart,
      transitionCameraEnd,
      setMode,
      setTransitionState,
      setTransitionProgress,
      setTransitionCamera,
      setControlsSuspended,
      setVisualOpacities,
      resetTransitionCameras,
    } = exp

    const controls = controlsRef.current
    if (controls) {
      controls.enabled = !exp.controlsSuspended
    }

    const dt = reducedMotion ? delta * 2.2 : delta

    const applyOpacities = (
      p: number,
      kind: 'to-planetary' | 'to-earth' | 'to-cosmic' | 'from-cosmic',
    ) => {
      const s = smoothstep01(p)
      if (kind === 'to-planetary') {
        setVisualOpacities({
          earthAtmosphereOpacity: lerp(1, 0.08, s),
          earthCityLabelsOpacity: lerp(1, 0, Math.min(1, s * 1.35)),
          planetaryLabelsOpacity: lerp(0, 1, s),
          cosmicBackdropOpacity: 0,
        })
      } else if (kind === 'to-earth') {
        setVisualOpacities({
          earthAtmosphereOpacity: lerp(0.12, 1, s),
          earthCityLabelsOpacity: lerp(0, 1, s),
          planetaryLabelsOpacity: lerp(1, 0, s),
          cosmicBackdropOpacity: 0,
        })
      } else if (kind === 'to-cosmic') {
        setVisualOpacities({
          earthAtmosphereOpacity: 0.06,
          earthCityLabelsOpacity: 0,
          planetaryLabelsOpacity: lerp(1, 0.35, s),
          cosmicBackdropOpacity: lerp(0, 1, s),
        })
      } else {
        setVisualOpacities({
          earthAtmosphereOpacity: 0.06,
          earthCityLabelsOpacity: 0,
          planetaryLabelsOpacity: lerp(0.35, 1, s),
          cosmicBackdropOpacity: lerp(1, 0, s),
        })
      }
    }

    const radialEnd = (endDistance: number) => {
      const start = camera.position.clone()
      const radial = start.clone().sub(_earthCenter)
      if (radial.lengthSq() < 1e-6) {
        radial.set(0, 0, 1)
      } else {
        radial.normalize()
      }
      const end = _earthCenter.clone().add(radial.multiplyScalar(endDistance))
      setTransitionCamera(
        [start.x, start.y, start.z],
        [end.x, end.y, end.z],
      )
    }

    const beginZoomOut = (kind: Extract<TransitionKind, 'earth-planetary-out' | 'planetary-cosmic-out'>, endDistance: number) => {
      radialEnd(endDistance)
      transitionKind.current = kind
      transitionElapsed.current = 0
      setTransitionProgress(0)
      setTransitionState('zooming-out')
      setControlsSuspended(true)
    }

    const beginZoomIn = (kind: Extract<TransitionKind, 'earth-planetary-in' | 'planetary-cosmic-in'>, endDistance: number) => {
      radialEnd(endDistance)
      transitionKind.current = kind
      transitionElapsed.current = 0
      setTransitionProgress(0)
      setTransitionState('zooming-in')
      setControlsSuspended(true)
    }

    // ─── Idle thresholds (only when not in place detail) ───
    if (
      uiMode === 'globe' &&
      transitionState === 'idle' &&
      transitionKind.current === 'none'
    ) {
      if (mode === 'earth' && distance >= EARTH_TO_PLANETARY_DISTANCE) {
        beginZoomOut('earth-planetary-out', PLANETARY_VIEW_CAMERA_DISTANCE)
      } else if (mode === 'planetary' && distance >= PLANETARY_TO_COSMIC_DISTANCE) {
        beginZoomOut('planetary-cosmic-out', COSMIC_VIEW_CAMERA_DISTANCE)
      } else if (mode === 'planetary' && distance <= PLANETARY_TO_EARTH_DISTANCE) {
        beginZoomIn('earth-planetary-in', 5.6)
      } else if (mode === 'cosmic' && distance <= COSMIC_TO_PLANETARY_DISTANCE) {
        beginZoomIn('planetary-cosmic-in', PLANETARY_VIEW_CAMERA_DISTANCE)
      }
    }

    // ─── Run active transition ───
    if (
      transitionState !== 'idle' &&
      transitionCameraStart &&
      transitionCameraEnd
    ) {
      const dur =
        transitionKind.current === 'planetary-cosmic-out' ||
        transitionKind.current === 'planetary-cosmic-in'
          ? EXPLORE_TRANSITION_DURATION_PLANETARY_COSMIC
          : EXPLORE_TRANSITION_DURATION_EARTH_PLANETARY

      transitionElapsed.current += dt
      const p = Math.min(1, transitionElapsed.current / dur)
      setTransitionProgress(p)

      const [sx, sy, sz] = transitionCameraStart
      const [ex, ey, ez] = transitionCameraEnd
      const t = smoothstep01(p)
      camera.position.set(
        lerp(sx, ex, t),
        lerp(sy, ey, t),
        lerp(sz, ez, t),
      )
      camera.updateProjectionMatrix()
      controls?.update()

      if (transitionKind.current === 'earth-planetary-out') {
        applyOpacities(p, 'to-planetary')
      } else if (transitionKind.current === 'earth-planetary-in') {
        applyOpacities(p, 'to-earth')
      } else if (transitionKind.current === 'planetary-cosmic-out') {
        applyOpacities(p, 'to-cosmic')
      } else if (transitionKind.current === 'planetary-cosmic-in') {
        applyOpacities(p, 'from-cosmic')
      }

      if (p >= 1) {
        if (transitionKind.current === 'earth-planetary-out') {
          setMode('planetary')
        } else if (transitionKind.current === 'earth-planetary-in') {
          setMode('earth')
        } else if (transitionKind.current === 'planetary-cosmic-out') {
          setMode('cosmic')
        } else if (transitionKind.current === 'planetary-cosmic-in') {
          setMode('planetary')
        }

        setTransitionState('idle')
        setControlsSuspended(false)
        resetTransitionCameras()
        transitionKind.current = 'none'
        setTransitionProgress(0)

        const finalMode = useExploreScaleStore.getState().mode
        if (finalMode === 'earth') {
          setVisualOpacities({
            earthAtmosphereOpacity: 1,
            earthCityLabelsOpacity: 1,
            planetaryLabelsOpacity: 0,
            cosmicBackdropOpacity: 0,
          })
        } else if (finalMode === 'planetary') {
          setVisualOpacities({
            earthAtmosphereOpacity: 0.1,
            earthCityLabelsOpacity: 0,
            planetaryLabelsOpacity: 1,
            cosmicBackdropOpacity: 0,
          })
        } else {
          setVisualOpacities({
            earthAtmosphereOpacity: 0.05,
            earthCityLabelsOpacity: 0,
            planetaryLabelsOpacity: 0.45,
            cosmicBackdropOpacity: 1,
          })
        }
      }
    } else if (transitionState === 'idle') {
      if (mode === 'earth') {
        setVisualOpacities({
          earthAtmosphereOpacity: 1,
          earthCityLabelsOpacity: 1,
          planetaryLabelsOpacity: 0,
          cosmicBackdropOpacity: 0,
        })
      } else if (mode === 'planetary') {
        setVisualOpacities({
          earthAtmosphereOpacity: 0.1,
          earthCityLabelsOpacity: 0,
          planetaryLabelsOpacity: 1,
          cosmicBackdropOpacity: 0,
        })
      } else {
        setVisualOpacities({
          earthAtmosphereOpacity: 0.05,
          earthCityLabelsOpacity: 0,
          planetaryLabelsOpacity: 0.45,
          cosmicBackdropOpacity: 1,
        })
      }
    }
  })

  return null
}
