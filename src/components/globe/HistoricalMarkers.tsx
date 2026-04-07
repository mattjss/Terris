import { useRef, useMemo, useCallback, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import {
  type HistoricalEntity,
  latLngToVec3,
  GLOBE_RADIUS,
} from '@/data/historical'
import { useExploreScaleStore } from '@/state/exploreScaleStore'
import { useAtlasStore, useVisibleEntities } from '@/store/atlas'

const _camDir = new THREE.Vector3()
const _markerDir = new THREE.Vector3()
const _markerTint = new THREE.Color()
const TYPE_SCALE: Record<string, number> = {
  place: 1,
  empire: 1.2,
  architecture: 1,
  battle: 1.1,
}

function Marker({ entity }: { entity: HistoricalEntity }) {
  const groupRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const dotRef = useRef<THREE.Mesh>(null)
  const selectedRingRef = useRef<THREE.Mesh>(null)
  const [markerVisible, setMarkerVisible] = useState(true)
  const prevFacingRef = useRef<boolean | null>(null)

  const labelOpacity = useExploreScaleStore((s) => s.earthCityLabelsOpacity)
  const selectedId = useAtlasStore((s) => s.selectedId)
  const hoveredId = useAtlasStore((s) => s.hoveredId)

  const position = useMemo(
    () => new THREE.Vector3(...latLngToVec3(entity.lat, entity.lng, GLOBE_RADIUS)),
    [entity.lat, entity.lng],
  )

  const quaternion = useMemo(() => {
    const obj = new THREE.Object3D()
    obj.position.copy(position)
    obj.lookAt(0, 0, 0)
    return obj.quaternion.clone()
  }, [position])

  const isSelected = selectedId === entity.id
  const isHovered = hoveredId === entity.id
  const scale = TYPE_SCALE[entity.type] ?? 1

  const handleClick = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation()
      useAtlasStore.getState().setSelected(isSelected ? null : entity.id)
    },
    [isSelected, entity.id],
  )

  const handleOver = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation()
      useAtlasStore.getState().setHovered(entity.id)
      document.body.style.cursor = 'pointer'
    },
    [entity.id],
  )

  const handleOut = useCallback(() => {
    useAtlasStore.getState().setHovered(null)
    document.body.style.cursor = ''
  }, [])

  useFrame(({ camera }) => {
    if (!groupRef.current) return

    _camDir.copy(camera.position).normalize()
    _markerDir.copy(position).normalize()
    const facing = _markerDir.dot(_camDir) > -0.1
    groupRef.current.visible = facing
    if (prevFacingRef.current !== facing) {
      prevFacingRef.current = facing
      setMarkerVisible(facing)
    }

    _markerTint.set(entity.color)

    if (dotRef.current) {
      const target = isHovered || isSelected ? 1.4 : 1
      const s = dotRef.current.scale.x
      dotRef.current.scale.setScalar(s + (target - s) * 0.15)
      const dotMat = dotRef.current.material as THREE.MeshBasicMaterial
      dotMat.color.copy(_markerTint)
    }

    if (ringRef.current) {
      ;(ringRef.current.material as THREE.MeshBasicMaterial).color.copy(_markerTint)
      ringRef.current.scale.setScalar(1)
    }
    if (selectedRingRef.current) {
      ;(selectedRingRef.current.material as THREE.MeshBasicMaterial).color.copy(_markerTint)
      selectedRingRef.current.scale.setScalar(1.1)
    }
  })

  return (
    <group ref={groupRef} position={position} quaternion={quaternion}>
      <mesh
        visible={false}
        onClick={handleClick}
        onPointerOver={handleOver}
        onPointerOut={handleOut}
      >
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <mesh ref={dotRef}>
        <sphereGeometry args={[0.012 * scale, 10, 10]} />
        <meshBasicMaterial />
      </mesh>

      <mesh ref={ringRef}>
        <ringGeometry args={[0.026 * scale, 0.031 * scale, 32]} />
        <meshBasicMaterial
          color={entity.color}
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {isSelected && (
        <mesh ref={selectedRingRef}>
          <ringGeometry args={[0.028 * scale, 0.034 * scale, 32]} />
          <meshBasicMaterial
            color={entity.color}
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {isHovered && markerVisible && labelOpacity > 0.04 && (
        <Html
          distanceFactor={8}
          style={{ pointerEvents: 'none', userSelect: 'none', opacity: labelOpacity }}
          center
          position={[0, 0, 0.1]}
        >
          <div
            style={{
              background: 'rgba(6,8,14,0.95)',
              backdropFilter: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 0,
              padding: '4px 8px',
              whiteSpace: 'nowrap',
              transform: 'translateY(-22px)',
              animation: 'fadeIn 0.15s ease-out',
            }}
          >
            <p style={{ fontSize: '10px', fontFamily: 'Geist Mono, monospace', fontWeight: 500, color: 'rgba(255,255,255,0.9)', margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' as const }}>
              {entity.name}
            </p>
            <p style={{ fontSize: '9px', fontFamily: 'Geist Mono, monospace', color: entity.color, margin: 0, marginTop: '2px', opacity: 0.6, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
              {entity.type === 'battle' ? 'Battle' : entity.type === 'empire' ? 'Empire' : entity.type === 'architecture' ? 'Landmark' : 'City'}
            </p>
          </div>
        </Html>
      )}
    </group>
  )
}

export function HistoricalMarkers() {
  const visible = useVisibleEntities()

  const markerable = useMemo(
    () => visible.filter((e) => e.type !== 'trade-route'),
    [visible],
  )

  return (
    <group>
      {markerable.map((entity) => (
        <Marker key={entity.id} entity={entity} />
      ))}
    </group>
  )
}
