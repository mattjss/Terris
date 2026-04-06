import type { TerrisEntityKind } from '@/data/types/terrisEntity'

const LABEL: Record<TerrisEntityKind, string> = {
  place: 'Places',
  person: 'People',
  event: 'Events',
  empire: 'Empires',
  landmark: 'Landmarks',
  venue: 'Venues',
  museum: 'Museums',
  artwork: 'Artwork',
  animal: 'Animals',
  planet: 'Planets',
  moon: 'Moons',
  mission: 'Missions',
  rover: 'Rovers',
  spacecraft: 'Spacecraft',
  crater: 'Craters',
  mountain: 'Mountains',
  'atmosphere-feature': 'Atmosphere',
  galaxy: 'Galaxies',
  nebula: 'Nebulae',
  'black-hole': 'Black holes',
  exoplanet: 'Exoplanets',
  star: 'Stars',
  constellation: 'Constellations',
  observatory: 'Observatories',
  'cosmic-event': 'Cosmic events',
}

export function entityKindGroupLabel(kind: TerrisEntityKind): string {
  return LABEL[kind] ?? kind
}
