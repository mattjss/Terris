import * as THREE from 'three'
import { latLngToVec3 } from '@/data/historical'

/**
 * Inverse of {@link latLngToVec3} for a point in the same local space (sphere center at origin).
 */
export function vec3ToLatLng(v: THREE.Vector3): { lat: number; lng: number } {
  const n = v.clone()
  const r = n.length()
  if (r < 1e-8) return { lat: 0, lng: 0 }
  n.multiplyScalar(1 / r)
  const phi = Math.acos(THREE.MathUtils.clamp(n.y, -1, 1))
  const lat = 90 - (phi * 180) / Math.PI
  const theta = Math.atan2(n.z, -n.x)
  const lng = (theta * 180) / Math.PI - 180
  return { lat, lng }
}

export function lngLatToVec3(lng: number, lat: number, radius: number): THREE.Vector3 {
  const [x, y, z] = latLngToVec3(lat, lng, radius)
  return new THREE.Vector3(x, y, z)
}

/** Continuous line through coordinates (GeoJSON order: lng, lat). */
export function lineStringToGeometry(
  coords: [number, number][],
  radius: number,
): THREE.BufferGeometry {
  const n = coords.length
  if (n < 2) {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(0), 3))
    return g
  }
  const positions = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const [lng, lat] = coords[i]
    const [x, y, z] = latLngToVec3(lat, lng, radius)
    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  return geo
}

/** Closed ring (first point repeated at end in GeoJSON; LineLoop does not need duplicate). */
export function ringToLineLoopGeometry(
  coords: [number, number][],
  radius: number,
): THREE.BufferGeometry {
  const n = coords.length
  if (n < 3) return lineStringToGeometry(coords, radius)
  const positions = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const [lng, lat] = coords[i]
    const [x, y, z] = latLngToVec3(lat, lng, radius)
    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  return geo
}
