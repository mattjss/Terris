/**
 * Animated 0 = Atlas, 1 = Explorer — updated in `GlobeVisualBlendDriver` via `useFrame`.
 * Kept in a ref so Three.js layers read every frame without Zustand re-renders.
 */
export const globeVisualBlendRef = { current: 0 }
