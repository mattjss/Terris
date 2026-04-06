import { getMockEntityById } from '@/data/services/entityService'
import type { TerrisPoi, TerrisPoiType } from '@/data/terrisPoi'
import type { EarthEntityKind, TerrisEntity } from '@/data/types/terrisEntity'

const MOCK_DESCRIPTIONS: Record<string, string> = {
  'poi-rome':
    'Capital of the Roman Republic and Empire; hub of law, engineering, and civic life for centuries.',
  'poi-alexandria':
    'Harbor city at the Nile’s mouth; a Hellenistic center of trade, scholarship, and maritime power.',
  'poi-giza':
    'Plateau of the Fourth Dynasty pyramids and the Sphinx—enduring monuments of Old Kingdom Egypt.',
  'poi-silk-road':
    'Network of overland routes linking East Asia to the Mediterranean; silk, ideas, and faiths traveled both ways.',
  'poi-mongol-empire':
    'The largest contiguous land empire in history, forged under Genghis Khan and his successors.',
  'poi-leonardo-da-vinci':
    'Renaissance polymath: painter, anatomist, inventor, and chronicler of machines and flight.',
  'poi-great-library':
    'Legendary Alexandrian institution—symbol of ancient scholarship and the fragility of archives.',
  'poi-olympic-games':
    'Pan-Hellenic festival at Olympia; revived in the modern era as a global athletic tradition.',
  'poi-amazon-rainforest':
    'The planet’s largest tropical rainforest—immense biodiversity and a critical climate regulator.',
  'poi-mount-vesuvius':
    'Active stratovolcano near Naples; its 79 CE eruption buried Pompeii and Herculaneum.',
}

function poiTypeToKind(t: TerrisPoiType): EarthEntityKind {
  switch (t) {
    case 'person':
      return 'person'
    case 'empire':
      return 'empire'
    case 'event':
      return 'event'
    case 'architecture':
      return 'landmark'
    case 'place':
    case 'route':
    case 'natural':
    default:
      return 'place'
  }
}

/**
 * Lightweight globe POI → entity when no editorial mock exists.
 */
export function terrisPoiToMinimalTerrisEntity(poi: TerrisPoi): TerrisEntity {
  const desc =
    MOCK_DESCRIPTIONS[poi.id] ??
    'A Terris point of interest on the historical globe — full entity data will load when connected.'
  const summary = desc.length > 280 ? `${desc.slice(0, 277)}…` : desc
  return {
    id: poi.id,
    name: poi.name,
    mode: 'earth',
    type: poiTypeToKind(poi.type),
    placeName: poi.name,
    regionName: null,
    countryName: null,
    coords: { lat: poi.lat, lon: poi.lon },
    startYear: poi.yearStart,
    endYear: poi.yearEnd,
    summary,
    fullDescription: desc,
    facts: [],
    timeline: [],
    relatedEntities: [],
    nearby: [],
    media: [],
  }
}

/**
 * Prefer `MOCK_ENTITY_CATALOG` (e.g. Boston / Fenway) when `poi.id` matches an editorial entity id.
 */
export function resolveTerrisEntityForPoi(poi: TerrisPoi): TerrisEntity {
  const mock = getMockEntityById(poi.id)
  if (mock) return mock
  return terrisPoiToMinimalTerrisEntity(poi)
}
