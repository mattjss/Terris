import { useRef, useMemo, useCallback, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Text } from '@react-three/drei'
import * as THREE from 'three'
import { latLngToVec3, GLOBE_RADIUS } from '@/data/historical'
import {
  type TerrisPoi,
  TERRIS_POI_SEED,
  isTerrisPoiVisibleAtYear,
} from '@/data/terrisPoi'
import { useExploreScaleStore } from '@/state/exploreScaleStore'
import { useTerrisStore } from '@/state/useTerrisStore'
import { resolveTerrisEntityForPoi } from '@/ui/terrisPoiToTerrisEntity'

const DOT_RADIUS = 0.014
const HIT_RADIUS = 0.07

const _colorDim = new THREE.Color('#b8b8b8')
const _colorBright = new THREE.Color('#ffffff')

function PoiMarker({ entity }: { entity: TerrisPoi }) {
  const groupRef = useRef<THREE.Group>(null)
  const dotRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  const labelOpacity = useExploreScaleStore((s) => s.earthCityLabelsOpacity)
  const year = useTerrisStore((s) => s.year)
  const selectedEntity = useTerrisStore((s) => s.selectedEntity)
  const uiMode = useTerrisStore((s) => s.uiMode)
  const enterPlaceDetail = useTerrisStore((s) => s.enterPlaceDetail)
  const exitPlaceDetail = useTerrisStore((s) => s.exitPlaceDetail)

  const visible = isTerrisPoiVisibleAtYear(entity, year)
  const isSelected = selectedEntity?.id === entity.id
  const emphasize = hovered || isSelected

  const position = useMemo(
    () =>
      new THREE.Vector3(
        ...latLngToVec3(entity.lat, entity.lon, GLOBE_RADIUS),
      ),
    [entity.lat, entity.lon],
  )

  const quaternion = useMemo(() => {
    const obj = new THREE.Object3D()
    obj.position.copy(position)
    obj.lookAt(0, 0, 0)
    return obj.quaternion.clone()
  }, [position])

  const handleClick = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation()
      if (isSelected && uiMode === 'place_detail') {
        exitPlaceDetail()
        return
      }
      enterPlaceDetail(resolveTerrisEntityForPoi(entity))
    },
    [entity, isSelected, uiMode, enterPlaceDetail, exitPlaceDetail],
  )

  const handleOver = useCallback((e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }, [])

  const handleOut = useCallback(() => {
    setHovered(false)
    document.body.style.cursor = ''
  }, [])

  useFrame(() => {
    const dot = dotRef.current
    if (!dot) return
    const mat = dot.material as THREE.MeshBasicMaterial
    const targetScale = emphasize ? 1.2 : 1
    const s = dot.scale.x
    dot.scale.setScalar(s + (targetScale - s) * 0.18)
    mat.color.lerp(emphasize ? _colorBright : _colorDim, 0.14)
  })

  if (!visible) return null

  return (
    <group ref={groupRef} position={position} quaternion={quaternion}>
      <mesh
        visible={false}
        onClick={handleClick}
        onPointerOver={handleOver}
        onPointerOut={handleOut}
      >
        <sphereGeometry args={[HIT_RADIUS, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <mesh ref={dotRef}>
        <sphereGeometry args={[DOT_RADIUS, 10, 10]} />
        <meshBasicMaterial color={_colorDim} />
      </mesh>

      {emphasize && labelOpacity > 0.04 ? (
        <Billboard follow lockX={false} lockY={false} lockZ={false}>
          <Text
            position={[0, 0.1, 0]}
            fontSize={0.032}
            maxWidth={1.6}
            textAlign="center"
            color="#f4f6fa"
            fillOpacity={labelOpacity}
            outlineWidth={0.0025}
            outlineColor="#08090c"
            anchorX="center"
            anchorY="bottom"
          >
            {entity.name}
          </Text>
        </Billboard>
      ) : null}
    </group>
  )
}

export function TerrisPoiMarkers() {
  return (
    <group>
      {TERRIS_POI_SEED.map((entity) => (
        <PoiMarker key={entity.id} entity={entity} />
      ))}
    </group>
  )
}
