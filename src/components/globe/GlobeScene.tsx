import { useRef, useCallback, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import { Suspense } from 'react'
import { EarthAtlas } from './EarthAtlas'
import { EarthProcedural } from './EarthProcedural'
import { CloudsLayer } from './CloudsLayer'
import { Atmosphere } from './Atmosphere'
import { StarField } from './StarField'
import { HistoricalMarkers } from './HistoricalMarkers'
import { TerrisPoiMarkers } from './TerrisPoiMarkers'
import { BoundaryPolygons } from './BoundaryPolygons'
import { TradeRoutes } from './TradeRoutes'
import { Coastlines } from './Coastlines'
import { LandOutlines } from './LandOutlines'
import { GLOBE_RADIUS, GLOBE_WORLD_CENTER } from './globeConstants'
import { syncHoveredCoordsFromEarthMesh } from './globeEarthHover'
import { useExploreScaleStore } from '@/state/exploreScaleStore'
import { useAtlasStore } from '@/store/atlas'
import { useTerrisStore } from '@/state/useTerrisStore'
import { entities, latLngToVec3 } from '@/data/historical'
import { vec3ToLatLng } from '@/lib/geoToThree'
import { CosmicPlaceholder } from './CosmicPlaceholder'
import { ExploreScaleBridge } from './ExploreScaleBridge'
import { SolarSystemPlaceholder } from './SolarSystemPlaceholder'

const _dir = new THREE.Vector3()
const _globeCenter = new THREE.Vector3(
  GLOBE_WORLD_CENTER.x,
  GLOBE_WORLD_CENTER.y,
  GLOBE_WORLD_CENTER.z,
)
const _globeSphere = new THREE.Sphere(_globeCenter.clone(), GLOBE_RADIUS)
const _rayHit = new THREE.Vector3()
const _screenCenterNdc = new THREE.Vector2(0, 0)
const _pointerNdc = new THREE.Vector2()
const _raycaster = new THREE.Raycaster()
const GLOBE_VIEW_SYNC_MS = 50

const FOCUS_DISTANCE: Record<string, number> = {
  place: 4.2,
  architecture: 3.8,
  battle: 4.2,
  empire: 5.4,
  'trade-route': 5.0,
}

const TERRIS_POI_FOCUS_DISTANCE = 4.2

/** Camera distance for Earth entity kinds (globe POI resolution). */
const _earthEntityFocusByType: Record<string, number> = {
  place: 4.2,
  route: 5.0,
  empire: 5.4,
  person: 4.0,
  architecture: 3.8,
  landmark: 3.8,
  venue: 4.0,
  museum: 4.0,
  event: 4.2,
  natural: 4.6,
  artwork: 4.0,
  animal: 4.6,
}

export function GlobeScene() {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const earthMeshRef = useRef<THREE.Mesh>(null)
  const targetPos = useRef<THREE.Vector3 | null>(null)
  const lastGlobeViewSync = useRef(0)
  const { camera, pointer } = useThree()
  const exploreMode = useExploreScaleStore((s) => s.mode)
  const orbitLimits = useMemo(() => {
    if (exploreMode === 'cosmic') {
      return { min: 22, max: 560 }
    }
    if (exploreMode === 'planetary') {
      return { min: 3.4, max: 150 }
    }
    return { min: 3.2, max: 10 }
  }, [exploreMode])
  const selectedId = useAtlasStore((s) => s.selectedId)
  const reducedMotion = useAtlasStore((s) => s.reducedMotion)
  const prevSelectedRef = useRef<string | null>(null)
  const prevGlobeFocusId = useRef(0)

  const handlePointerMissed = useCallback(() => {
    useAtlasStore.getState().setSelected(null)
    useTerrisStore.getState().exitPlaceDetail()
  }, [])

  useFrame(() => {
    const terris = useTerrisStore.getState()
    if (terris.globeFocusRequestId !== prevGlobeFocusId.current) {
      prevGlobeFocusId.current = terris.globeFocusRequestId
      const t = terris.globeFocusTarget
      if (t) {
        _dir.set(...latLngToVec3(t.lat, t.lon, 1)).normalize()
        const selected = terris.selectedEntity
        const dist =
          selected &&
          selected.mode === 'earth' &&
          _earthEntityFocusByType[selected.type] !== undefined
            ? _earthEntityFocusByType[selected.type]
            : TERRIS_POI_FOCUS_DISTANCE
        targetPos.current = _dir.clone().multiplyScalar(dist)
      }
    }

    if (selectedId !== prevSelectedRef.current) {
      prevSelectedRef.current = selectedId
      if (selectedId) {
        const entity = entities.find((e) => e.id === selectedId)
        if (entity) {
          _dir.set(...latLngToVec3(entity.lat, entity.lng, 1)).normalize()
          const dist = FOCUS_DISTANCE[entity.type] ?? 4.5
          targetPos.current = _dir.clone().multiplyScalar(dist)
        }
      } else {
        targetPos.current = null
      }
    }

    const exploreSuspended = useExploreScaleStore.getState().controlsSuspended
    if (!exploreSuspended && targetPos.current) {
      const factor = reducedMotion ? 1 : 0.025
      camera.position.lerp(targetPos.current, factor)
      if (camera.position.distanceTo(targetPos.current) < 0.015) {
        targetPos.current = null
      }
    }

    controlsRef.current?.update()

    const now = performance.now()
    if (now - lastGlobeViewSync.current >= GLOBE_VIEW_SYNC_MS) {
      lastGlobeViewSync.current = now
      _raycaster.setFromCamera(_screenCenterNdc, camera)
      const hitCenter = _raycaster.ray.intersectSphere(_globeSphere, _rayHit)
      if (hitCenter) {
        const local = _rayHit.clone().sub(_globeCenter)
        const { lat, lng } = vec3ToLatLng(local)
        const dist = camera.position.distanceTo(_globeCenter)
        useAtlasStore.getState().setGlobeView({
          centerLat: lat,
          centerLng: lng,
          distance: dist,
          autoRotating:
            !selectedId &&
            !reducedMotion &&
            useExploreScaleStore.getState().mode === 'earth',
        })
      }
    }

    const earth = earthMeshRef.current
    if (earth) {
      _pointerNdc.set(pointer.x, pointer.y)
      syncHoveredCoordsFromEarthMesh(camera, _pointerNdc, earth)
    }
  })

  return (
    <>
      <color attach="background" args={['#070a10']} />

      <ExploreScaleBridge controlsRef={controlsRef} />
      <CosmicPlaceholder />

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.048}
        minDistance={orbitLimits.min}
        maxDistance={orbitLimits.max}
        enablePan={false}
        autoRotate={!selectedId && !reducedMotion && exploreMode === 'earth'}
        autoRotateSpeed={0.055}
        rotateSpeed={0.42}
        makeDefault
      />

      {/* High-contrast key + cool fill; low ambient keeps the night side deep. */}
      <ambientLight intensity={0.022} color="#0c1118" />
      <directionalLight position={[5.2, 2.4, 3.6]} intensity={1.18} color="#e4e6ea" />
      <directionalLight
        position={[-3.8, -1.4, -2.8]}
        intensity={0.09}
        color="#5c6f82"
      />
      <directionalLight
        position={[0.2, -4.2, 1.2]}
        intensity={0.045}
        color="#1c2838"
      />

      <group position={[0.1, -0.05, 0]} onPointerMissed={handlePointerMissed}>
        <Suspense fallback={<EarthProcedural ref={earthMeshRef} />}>
          <EarthAtlas ref={earthMeshRef} />
          <CloudsLayer />
        </Suspense>
        <Coastlines />
        <LandOutlines />
        <Atmosphere />
        <BoundaryPolygons />
        <HistoricalMarkers />
        <TerrisPoiMarkers />
        <TradeRoutes />
      </group>
      <SolarSystemPlaceholder />
      <StarField />
    </>
  )
}
