import * as THREE from 'three'
import { vec3ToLatLng } from '@/lib/geoToThree'
import { useTerrisStore } from '@/state/useTerrisStore'
import { GLOBE_WORLD_CENTER } from './globeConstants'

const _globeCenter = new THREE.Vector3(
  GLOBE_WORLD_CENTER.x,
  GLOBE_WORLD_CENTER.y,
  GLOBE_WORLD_CENTER.z,
)
const _raycaster = new THREE.Raycaster()

/**
 * Raycast from NDC against the Earth mesh; returns lat/lon in degrees or null if no hit.
 */
export function raycastEarthMeshLatLng(
  camera: THREE.Camera,
  ndc: THREE.Vector2,
  earthMesh: THREE.Mesh,
): { lat: number; lon: number } | null {
  _raycaster.setFromCamera(ndc, camera)
  const hits = _raycaster.intersectObject(earthMesh, false)
  if (hits.length === 0) return null
  const local = hits[0].point.clone().sub(_globeCenter)
  const { lat, lng } = vec3ToLatLng(local)
  return { lat, lon: lng }
}

/**
 * Updates Terris hovered coordinates from a pointer in normalized device coordinates.
 */
export function syncHoveredCoordsFromEarthMesh(
  camera: THREE.Camera,
  pointerNdc: THREE.Vector2,
  earthMesh: THREE.Mesh,
): void {
  const coords = raycastEarthMeshLatLng(camera, pointerNdc, earthMesh)
  useTerrisStore.getState().setHoveredCoords(coords)
}
