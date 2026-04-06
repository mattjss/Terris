/**
 * Terris point-of-interest seed data for globe markers (independent of main historical catalog).
 */

export type TerrisPoiType =
  | 'place'
  | 'route'
  | 'empire'
  | 'person'
  | 'architecture'
  | 'event'
  | 'natural'

export interface TerrisPoi {
  id: string
  name: string
  type: TerrisPoiType
  lat: number
  lon: number
  yearStart: number
  yearEnd: number
}

export const TERRIS_POI_SEED: TerrisPoi[] = [
  {
    id: 'poi-rome',
    name: 'Rome',
    type: 'place',
    lat: 41.9028,
    lon: 12.4964,
    yearStart: -753,
    yearEnd: 2025,
  },
  {
    id: 'poi-alexandria',
    name: 'Alexandria',
    type: 'place',
    lat: 31.2001,
    lon: 29.9187,
    yearStart: -331,
    yearEnd: 2025,
  },
  {
    id: 'poi-giza',
    name: 'Giza',
    type: 'place',
    lat: 29.9792,
    lon: 31.1342,
    yearStart: -2580,
    yearEnd: 2025,
  },
  {
    id: 'poi-silk-road',
    name: 'Silk Road',
    type: 'route',
    lat: 39.5,
    lon: 66.0,
    yearStart: -200,
    yearEnd: 1450,
  },
  {
    id: 'poi-mongol-empire',
    name: 'Mongol Empire',
    type: 'empire',
    lat: 47.2047,
    lon: 102.8263,
    yearStart: 1206,
    yearEnd: 1368,
  },
  {
    id: 'poi-leonardo-da-vinci',
    name: 'Leonardo da Vinci',
    type: 'person',
    lat: 43.784,
    lon: 10.9259,
    yearStart: 1452,
    yearEnd: 1519,
  },
  {
    id: 'poi-great-library',
    name: 'Great Library',
    type: 'architecture',
    lat: 31.2132,
    lon: 29.8925,
    yearStart: -285,
    yearEnd: 272,
  },
  {
    id: 'poi-olympic-games',
    name: 'Olympic Games',
    type: 'event',
    lat: 37.6379,
    lon: 21.63,
    yearStart: -776,
    yearEnd: 2025,
  },
  {
    id: 'poi-amazon-rainforest',
    name: 'Amazon Rainforest',
    type: 'natural',
    lat: -3.119,
    lon: -60.0217,
    yearStart: -8000,
    yearEnd: 2025,
  },
  {
    id: 'poi-mount-vesuvius',
    name: 'Mount Vesuvius',
    type: 'natural',
    lat: 40.8214,
    lon: 14.4265,
    yearStart: -2000,
    yearEnd: 2025,
  },
  /** Editorial entity-hub examples (see `src/data/mock/bostonEntityHub.ts`). */
  {
    id: 'terris-hub-boston',
    name: 'Boston',
    type: 'place',
    lat: 42.3601,
    lon: -71.0589,
    yearStart: 1630,
    yearEnd: 2025,
  },
  {
    id: 'terris-venue-fenway',
    name: 'Fenway Park',
    type: 'architecture',
    lat: 42.3467,
    lon: -71.0972,
    yearStart: 1912,
    yearEnd: 2025,
  },
  {
    id: 'terris-event-tea-party',
    name: 'Boston Tea Party',
    type: 'event',
    lat: 42.3522,
    lon: -71.0513,
    yearStart: 1773,
    yearEnd: 1773,
  },
  {
    id: 'terris-person-revere',
    name: 'Paul Revere',
    type: 'person',
    lat: 42.3668,
    lon: -71.0544,
    yearStart: 1735,
    yearEnd: 1818,
  },
  {
    id: 'terris-landmark-old-state-house',
    name: 'Old State House',
    type: 'architecture',
    lat: 42.3573,
    lon: -71.0594,
    yearStart: 1713,
    yearEnd: 2025,
  },
  {
    id: 'terris-place-rome',
    name: 'Rome',
    type: 'place',
    lat: 41.9028,
    lon: 12.4964,
    yearStart: -753,
    yearEnd: 2025,
  },
]

export function findTerrisPoiById(id: string): TerrisPoi | undefined {
  return TERRIS_POI_SEED.find((p) => p.id === id)
}

export function isTerrisPoiVisibleAtYear(poi: TerrisPoi, year: number): boolean {
  return year >= poi.yearStart && year <= poi.yearEnd
}
