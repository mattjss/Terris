/**
 * Editorial mock hub — Boston with Fenway Park and related data.
 * Media uses `sourceName` + optional `license` for editorial / compliance.
 */
import type { TerrisEntity } from '@/data/types/terrisEntity'

export const BOSTON_HUB_ID = 'terris-hub-boston'

const bostonSkylineImg =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Boston_skyline_from_Longfellow_Bridge_September_2017_panorama_2.jpg/1024px-Boston_skyline_from_Longfellow_Bridge_September_2017_panorama_2.jpg'

const fenwayImg =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Fenway_Park_from_high_above.jpg/1024px-Fenway_Park_from_high_above.jpg'

const bostonMapArchival =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Boston_1880_map.jpg/800px-Boston_1880_map.jpg'

const bostonHarborImg =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Boston_Harbor_and_Skyline_from_Water_2016.jpg/1024px-Boston_Harbor_and_Skyline_from_Water_2016.jpg'

const bostonOldPhoto =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Boston_1915.jpg/800px-Boston_1915.jpg'

export const TERRIS_ENTITY_BOSTON: TerrisEntity = {
  id: BOSTON_HUB_ID,
  name: 'Boston',
  mode: 'earth',
  type: 'place',
  placeName: 'Boston',
  regionName: 'New England',
  countryName: 'United States',
  coords: { lat: 42.3601, lon: -71.0589 },
  startYear: 1630,
  endYear: null,
  summary:
    'Boston is a coastal New England city where Revolutionary politics, Atlantic trade, immigrant neighborhoods, ' +
    'and world-class universities stack on one another—readable today in brick, harbor, and ballpark.',
  fullDescription:
    'From a Puritan settlement on the Shawmut Peninsula, Boston became a cockpit of the American Revolution: ' +
    'mass meetings, harbor protests, and siege lines that shaped the new republic’s imagination. The 19th century ' +
    'added railroads, Irish and Italian immigration, and industrial muscle; the 20th layered hospitals, research ' +
    'campuses, and a dense transit network. The “Big Dig” rewired the harbor’s edge; the knowledge economy and ' +
    'biotech clusters now anchor the regional economy. Terris treats Boston as a place hub where you can read ' +
    'time through streets, institutions, and rituals—from the Freedom Trail to the Green Monster.',
  facts: [
    { id: 'boston-f1', label: 'Historic county', value: 'Suffolk County, Massachusetts', source: 'terris' },
    { id: 'boston-f2', label: 'Chartered as a city', value: '1822', source: 'terris' },
    { id: 'boston-f3', label: 'Metro population (approx.)', value: '~4.9 million', source: 'terris' },
    { id: 'boston-f4', label: 'Notable universities', value: 'Harvard, MIT, Tufts, Northeastern, BU, BC', source: 'terris' },
    { id: 'boston-f5', label: 'Major sports franchises', value: 'Red Sox, Celtics, Bruins, Patriots (region)', source: 'terris' },
    { id: 'boston-f6', label: 'Harbor & port', value: 'Historic Atlantic port; modern cruise + container activity', source: 'terris' },
    { id: 'boston-f7', label: 'Immigrant layers', value: 'Irish, Italian, and later global waves', source: 'terris' },
    { id: 'boston-f8', label: 'Transit spine', value: 'MBTA “T” subway, bus, commuter rail', source: 'terris' },
    { id: 'boston-f9', label: 'Public parks milestone', value: 'Boston Common (1634)—among earliest public spaces in North America', source: 'terris' },
    { id: 'boston-f10', label: 'Climate context', value: 'Humid continental · snowy winters, warm summers', source: 'terris' },
  ],
  timeline: [
    {
      id: 'boston-t1',
      label: 'English settlement founded',
      startYear: 1630,
      endYear: null,
      summary: 'Puritan colonists establish Boston on the Shawmut Peninsula.',
    },
    {
      id: 'boston-t2',
      label: 'American Revolution focal point',
      startYear: 1765,
      endYear: 1783,
      summary: 'Stamp Act resistance, Boston Massacre, Tea Party, Siege of Boston.',
    },
    {
      id: 'boston-t3',
      label: 'Incorporated as a city',
      startYear: 1822,
      endYear: null,
      summary: 'Municipal charter consolidates a growing Atlantic port.',
    },
    {
      id: 'boston-t4',
      label: 'Industrial & immigrant city',
      startYear: 1840,
      endYear: 1920,
      summary: 'Railroads, manufacturing, Irish and Italian neighborhoods expand the urban fabric.',
    },
    {
      id: 'boston-t5',
      label: 'Great Boston Fire',
      startYear: 1872,
      endYear: 1872,
      summary: 'Downtown conflagration accelerates rebuilding and fire codes.',
    },
    {
      id: 'boston-t6',
      label: 'Harbor & highway era',
      startYear: 1950,
      endYear: 1990,
      summary: 'Urban renewal debates; elevated highway later replaced by Big Dig project.',
    },
    {
      id: 'boston-t7',
      label: 'Knowledge economy era',
      startYear: 1950,
      endYear: null,
      summary: 'Universities, hospitals, and tech reshape land use along the Charles and the harbor.',
    },
    {
      id: 'boston-t8',
      label: 'Central Artery / Tunnel project',
      startYear: 1991,
      endYear: 2007,
      summary: 'Major infrastructure project reclaims downtown waterfront for public space.',
    },
    {
      id: 'boston-t9',
      label: 'Contemporary resilience focus',
      startYear: 2010,
      endYear: null,
      summary: 'Climate adaptation, coastal resilience, and transit investment remain civic priorities.',
    },
  ],
  relatedEntities: [
    {
      mode: 'earth',
      id: 'terris-venue-fenway',
      kind: 'venue',
      name: 'Fenway Park',
      role: 'Historic ballpark · team anchor',
    },
    {
      mode: 'earth',
      id: 'terris-event-tea-party',
      kind: 'event',
      name: 'Boston Tea Party',
      role: 'Revolutionary protest (1773)',
    },
    {
      mode: 'earth',
      id: 'terris-person-revere',
      kind: 'person',
      name: 'Paul Revere',
      role: 'Silversmith · midnight ride',
    },
    {
      mode: 'earth',
      id: 'terris-landmark-old-state-house',
      kind: 'landmark',
      name: 'Old State House',
      role: 'Colonial civic heart',
    },
  ],
  nearby: [
    {
      mode: 'earth',
      id: 'terris-venue-fenway',
      kind: 'venue',
      name: 'Fenway Park',
      role: 'Major venue · ~3 km west of downtown core',
    },
    {
      mode: 'earth',
      id: 'terris-landmark-old-state-house',
      kind: 'landmark',
      name: 'Old State House',
      role: 'Historic civic landmark · Financial District',
    },
  ],
  media: [
    {
      id: 'boston-m1',
      type: 'image',
      title: 'Skyline from Longfellow Bridge',
      sourceName: 'Wikimedia Commons',
      url: bostonSkylineImg,
      caption: 'Contemporary photograph of the downtown skyline and Charles River crossing.',
      credit: 'Wikimedia Commons contributor',
      license: 'CC BY-SA 4.0',
      isInterpretive: false,
      thumbnailUrl: bostonSkylineImg,
    },
    {
      id: 'boston-m2',
      type: 'archival',
      title: 'Boston & environs (late 19th c. map)',
      sourceName: 'Wikimedia Commons · historical map scan',
      url: bostonMapArchival,
      caption: 'Plate-style map useful for harbor blocks, rail approaches, and shoreline fill patterns.',
      credit: 'Archival cartography',
      license: 'Public domain',
      isInterpretive: false,
      thumbnailUrl: bostonMapArchival,
    },
    {
      id: 'boston-m3',
      type: 'image',
      title: 'Harbor and skyline from the water',
      sourceName: 'Wikimedia Commons',
      url: bostonHarborImg,
      caption: 'Maritime perspective on the city’s relationship with the Atlantic.',
      credit: 'Wikimedia Commons contributor',
      license: 'CC BY-SA 4.0',
      isInterpretive: false,
      thumbnailUrl: bostonHarborImg,
    },
    {
      id: 'boston-m4',
      type: 'archival',
      title: 'Boston streetscape (1915)',
      sourceName: 'Wikimedia Commons',
      url: bostonOldPhoto,
      caption: 'Early 20th-century urban fabric—electrics, streetcars, dense masonry.',
      credit: 'Historical photograph scan',
      license: 'Public domain',
      isInterpretive: false,
      thumbnailUrl: bostonOldPhoto,
    },
    {
      id: 'boston-m5',
      type: 'video',
      title: 'City atmosphere (placeholder)',
      sourceName: 'Terris sample embed',
      url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      caption: 'Replace with licensed aerial or harbor B-roll when rights allow.',
      credit: 'Sample video · swap for editorial asset',
      license: 'CC0 (sample)',
      isInterpretive: false,
      thumbnailUrl: bostonSkylineImg,
    },
    {
      id: 'boston-m6',
      type: 'reconstruction',
      title: 'Interpretive mesh · harbor + downtown blocks',
      sourceName: 'Terris editorial model (mock)',
      url: fenwayImg,
      caption:
        'Non-photographic reconstruction for navigation context—geometry is approximate; compare to archival plates.',
      credit: 'Terris interpretive layer · not surveyed',
      license: 'Terris editorial (mock)',
      isInterpretive: true,
      thumbnailUrl: fenwayImg,
    },
  ],
  sources: { wikidataId: 'Q100', wikipediaTitle: 'Boston' },
}

export const TERRIS_ENTITY_FENWAY: TerrisEntity = {
  id: 'terris-venue-fenway',
  name: 'Fenway Park',
  mode: 'earth',
  type: 'venue',
  placeName: 'Fenway Park',
  regionName: 'Massachusetts',
  countryName: 'United States',
  coords: { lat: 42.3467, lon: -71.0972 },
  startYear: 1912,
  endYear: null,
  summary:
    'Home of the Boston Red Sox; the oldest active ballpark in Major League Baseball, woven into the city’s civic identity.',
  fullDescription:
    'Opened in 1912, Fenway’s asymmetry—the Green Monster, shallow right field, cramped grandstand—is a living ' +
    'argument against generic stadium design. It sits inside a dense neighborhood, not a parking crater: fans ' +
    'arrive by transit and foot, and the park’s rhythms (day games, night lights, October crowds) synchronize ' +
    'with Boston’s academic calendar and harbor weather. Terris treats Fenway as a venue hub linked to the city ' +
    'place entity and to modern sporting culture.',
  facts: [
    { id: 'fenway-f1', label: 'Team', value: 'Boston Red Sox (MLB)', source: 'terris' },
    { id: 'fenway-f2', label: 'Seating (approx.)', value: '~37,000', source: 'terris' },
    { id: 'fenway-f3', label: 'Signature feature', value: 'Green Monster (left-field wall)', source: 'terris' },
    { id: 'fenway-f4', label: 'Neighborhood', value: 'Fenway–Kenmore', source: 'terris' },
  ],
  timeline: [
    {
      id: 'fenway-t1',
      label: 'Ballpark opens',
      startYear: 1912,
      endYear: null,
      summary: 'Red Sox defeat New York Highlanders in debut; the park’s quirks begin accumulating lore immediately.',
    },
    {
      id: 'fenway-t2',
      label: 'Lights installed',
      startYear: 1947,
      endYear: null,
      summary: 'Night baseball arrives; schedule and neighborhood soundscapes shift.',
    },
  ],
  relatedEntities: [
    {
      mode: 'earth',
      id: BOSTON_HUB_ID,
      kind: 'place',
      name: 'Boston',
      role: 'Host city',
    },
    {
      mode: 'earth',
      id: 'terris-landmark-old-state-house',
      kind: 'landmark',
      name: 'Old State House',
      role: 'Colonial civic anchor · walkable from the park',
    },
    {
      mode: 'earth',
      id: 'terris-event-tea-party',
      kind: 'event',
      name: 'Boston Tea Party',
      role: 'Shared civic story (same harbor city)',
    },
  ],
  nearby: [
    {
      mode: 'earth',
      id: 'terris-landmark-old-state-house',
      kind: 'landmark',
      name: 'Old State House',
      role: 'Downtown landmark · reachable by transit from Kenmore',
    },
  ],
  media: [
    {
      id: 'fenway-m1',
      type: 'image',
      title: 'Fenway from above',
      sourceName: 'Wikimedia Commons',
      url: fenwayImg,
      caption: 'Aerial context for the park within a dense urban block pattern.',
      credit: 'Wikimedia Commons contributor',
      license: 'CC BY-SA 3.0',
      isInterpretive: false,
      thumbnailUrl: fenwayImg,
    },
    {
      id: 'fenway-m2',
      type: 'video',
      title: 'Ballpark atmosphere (placeholder)',
      sourceName: 'Terris mock embed',
      url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      caption: 'Replace with licensed ballpark B-roll or broadcast excerpt when rights allow.',
      credit: 'Sample video · swap for editorial asset',
      license: 'CC0 (sample)',
      isInterpretive: false,
      thumbnailUrl: fenwayImg,
    },
    {
      id: 'fenway-m3',
      type: 'reconstruction',
      title: 'Green Monster · interpretive solid',
      sourceName: 'Terris editorial model (mock)',
      url: fenwayImg,
      caption: 'Modeled wall height and foul geometry for wayfinding—not a survey drawing.',
      credit: 'AI-assisted reconstruction · verify against field measurements',
      license: 'Terris editorial (mock)',
      isInterpretive: true,
      thumbnailUrl: fenwayImg,
    },
  ],
  sources: { wikidataId: 'Q1329645', wikipediaTitle: 'Fenway_Park' },
}

export const TERRIS_ENTITY_TEA_PARTY: TerrisEntity = {
  id: 'terris-event-tea-party',
  name: 'Boston Tea Party',
  mode: 'earth',
  type: 'event',
  placeName: 'Boston Harbor',
  regionName: 'Massachusetts',
  countryName: 'United States',
  coords: { lat: 42.3522, lon: -71.0513 },
  startYear: 1773,
  endYear: 1773,
  summary:
    'Direct action against the Tea Act: colonists destroyed taxed tea in Boston Harbor to contest Parliamentary authority.',
  fullDescription:
    'On December 16, 1773, protesters boarded ships and dumped chests of tea. The event escalated imperial ' +
    'response (Coercive Acts) and sharpened intercolonial solidarity. In Terris it anchors a political timeline ' +
    'thread for Boston as a place hub.',
  facts: [
    { id: 'tea-f1', label: 'Target', value: 'East India Company tea shipments', source: 'terris' },
    { id: 'tea-f2', label: 'Parliamentary context', value: 'Tea Act, 1773', source: 'terris' },
  ],
  timeline: [
    {
      id: 'tea-t1',
      label: 'Tea destroyed',
      startYear: 1773,
      endYear: 1773,
      summary: 'Harbor protest becomes a transatlantic diplomatic crisis.',
    },
  ],
  relatedEntities: [
    {
      mode: 'earth',
      id: BOSTON_HUB_ID,
      kind: 'place',
      name: 'Boston',
      role: 'Location',
    },
    {
      mode: 'earth',
      id: 'terris-landmark-old-state-house',
      kind: 'landmark',
      name: 'Old State House',
      role: 'Nearby civic stage',
    },
  ],
  nearby: [],
  media: [],
  sources: { wikipediaTitle: 'Boston_Tea_Party' },
}

export const TERRIS_ENTITY_PAUL_REVERE: TerrisEntity = {
  id: 'terris-person-revere',
  name: 'Paul Revere',
  mode: 'earth',
  type: 'person',
  placeName: 'Boston',
  regionName: 'Massachusetts',
  countryName: 'United States',
  coords: { lat: 42.3668, lon: -71.0544 },
  startYear: 1735,
  endYear: 1818,
  summary:
    'Artisan and messenger remembered for his midnight ride warning of British troop movement—one thread in Boston’s Revolutionary network.',
  fullDescription:
    'Revere’s silverwork and print shop anchored him in Boston’s material culture; his intelligence work linked ' +
    'towns along the Bay. Terris models him as a person hub with ties to events and civic landmarks.',
  facts: [
    { id: 'rev-f1', label: 'Craft', value: 'Silversmith, engraver', source: 'terris' },
    { id: 'rev-f2', label: 'Signal ride', value: 'April 18–19, 1775', source: 'terris' },
  ],
  timeline: [
    {
      id: 'rev-t1',
      label: 'Midnight ride',
      startYear: 1775,
      endYear: 1775,
      summary: 'Lexington and Concord warnings; later mythologized in Longfellow’s verse.',
    },
  ],
  relatedEntities: [
    {
      mode: 'earth',
      id: BOSTON_HUB_ID,
      kind: 'place',
      name: 'Boston',
      role: 'Home city',
    },
    {
      mode: 'earth',
      id: 'terris-landmark-old-state-house',
      kind: 'landmark',
      name: 'Old State House',
      role: 'Civic context',
    },
  ],
  nearby: [],
  media: [],
  sources: { wikipediaTitle: 'Paul_Revere' },
}

export const TERRIS_ENTITY_OLD_STATE_HOUSE: TerrisEntity = {
  id: 'terris-landmark-old-state-house',
  name: 'Old State House',
  mode: 'earth',
  type: 'landmark',
  placeName: 'Old State House',
  regionName: 'Massachusetts',
  countryName: 'United States',
  coords: { lat: 42.3573, lon: -71.0594 },
  startYear: 1713,
  endYear: null,
  summary:
    'Georgian civic building at the heart of colonial Boston; site of the Massacre and later a museum of the city’s layered past.',
  fullDescription:
    'The building’s balcony and intersection staged politics: crowds, readings, protests. It connects the harbor ' +
    'economy to inland roads—an architectural hinge in Boston’s timeline.',
  facts: [
    { id: 'osh-f1', label: 'Style', value: 'Georgian', source: 'terris' },
    { id: 'osh-f2', label: 'Massacre site', value: 'March 5, 1770', source: 'terris' },
  ],
  timeline: [
    {
      id: 'osh-t1',
      label: 'Boston Massacre',
      startYear: 1770,
      endYear: 1770,
      summary: 'Conflict between soldiers and townspeople becomes a revolutionary propaganda touchstone.',
    },
  ],
  relatedEntities: [
    {
      mode: 'earth',
      id: BOSTON_HUB_ID,
      kind: 'place',
      name: 'Boston',
      role: 'Urban context',
    },
    {
      mode: 'earth',
      id: 'terris-event-tea-party',
      kind: 'event',
      name: 'Boston Tea Party',
      role: 'Revolutionary sequence',
    },
  ],
  nearby: [],
  media: [],
  sources: { wikipediaTitle: 'Old_State_House_(Boston)' },
}

/** Lookup table for mock hydration and deep-link resolution. */
export const MOCK_ENTITY_CATALOG: Record<string, TerrisEntity> = {
  [BOSTON_HUB_ID]: TERRIS_ENTITY_BOSTON,
  'terris-venue-fenway': TERRIS_ENTITY_FENWAY,
  'terris-event-tea-party': TERRIS_ENTITY_TEA_PARTY,
  'terris-person-revere': TERRIS_ENTITY_PAUL_REVERE,
  'terris-landmark-old-state-house': TERRIS_ENTITY_OLD_STATE_HOUSE,
}

/** Ordered list for UI “related” exploration starting from the Boston hub. */
export const BOSTON_HUB_RELATED_ENTITIES: TerrisEntity[] = [
  TERRIS_ENTITY_FENWAY,
  TERRIS_ENTITY_TEA_PARTY,
  TERRIS_ENTITY_PAUL_REVERE,
  TERRIS_ENTITY_OLD_STATE_HOUSE,
]
