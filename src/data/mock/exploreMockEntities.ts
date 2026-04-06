/**
 * Editorial mocks for planetary / cosmic search — complements Boston hub (Earth).
 */
import type { TerrisEntity } from '@/data/types/terrisEntity'

export const TERRIS_ENTITY_ROME: TerrisEntity = {
  id: 'terris-place-rome',
  name: 'Rome',
  mode: 'earth',
  type: 'place',
  placeName: 'Rome',
  regionName: 'Lazio',
  countryName: 'Italy',
  coords: { lat: 41.9028, lon: 12.4964 },
  startYear: -753,
  endYear: null,
  summary:
    'Ancient capital turned modern metropolis — republic, empire, and baroque layers in one walkable city.',
  fullDescription:
    'Rome compresses millennia into one topography: republican forums, imperial baths, medieval churches, and baroque piazzas. Terris treats it as a place hub for civic time and stone memory.',
  facts: [
    { id: 'rome-f1', label: 'Region', value: 'Lazio', source: 'terris' },
    { id: 'rome-f2', label: 'River', value: 'Tiber', source: 'terris' },
  ],
  timeline: [
    {
      id: 'rome-t1',
      label: 'Legendary founding',
      startYear: -753,
      endYear: null,
      summary: 'Traditional date for Rome’s foundation.',
    },
  ],
  relatedEntities: [],
  nearby: [],
  media: [
    {
      id: 'rome-m1',
      type: 'image',
      title: 'Roman Forum',
      sourceName: 'Wikimedia Commons',
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Forum_Romanum_04_2025_1.jpg/1024px-Forum_Romanum_04_2025_1.jpg',
      thumbnailUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Forum_Romanum_04_2025_1.jpg/400px-Forum_Romanum_04_2025_1.jpg',
      caption: 'Forum Romanum — civic spine of the ancient city.',
      credit: 'Wikimedia Commons contributor',
      license: 'CC BY-SA 4.0',
      isInterpretive: false,
    },
  ],
  sources: { wikipediaTitle: 'Rome' },
}

/** Transcontinental trade network — editorial hub for Afro-Eurasian exchange. */
export const TERRIS_ENTITY_SILK_ROAD: TerrisEntity = {
  id: 'terris-empire-silk-road',
  name: 'Silk Road',
  mode: 'earth',
  type: 'empire',
  placeName: 'Eurasia',
  regionName: 'Central Asia · East Asia',
  countryName: null,
  coords: { lat: 39.6, lon: 75.2 },
  startYear: -130,
  endYear: 1453,
  summary:
    'Afro-Eurasian trade routes linking silk, faith, disease, and tech across deserts and steppes for millennia.',
  fullDescription:
    'From Han diplomatic missions to Mongol post-stations, the “Silk Road” names a braided network of roads, ' +
    'sea lanes, and caravan cities. Terris treats it as a place-spanning hub for material culture, religion, ' +
    'and epidemic history—not a single highway.',
  facts: [
    { id: 'sr-f1', label: 'Goods', value: 'Silk, spices, paper, glass, horses', source: 'terris' },
    { id: 'sr-f2', label: 'Key nodes', value: 'Samarqand, Dunhuang, Kashgar, Chang’an', source: 'terris' },
    { id: 'sr-f3', label: 'Also moved', value: 'Buddhism, Islam, plague DNA', source: 'terris' },
  ],
  timeline: [
    {
      id: 'sr-t1',
      label: 'Zhang Qian missions',
      startYear: -130,
      endYear: null,
      summary: 'Han contacts open documented east–west diplomatic threads.',
    },
    {
      id: 'sr-t2',
      label: 'Mongol peace',
      startYear: 1200,
      endYear: 1368,
      summary: 'Pax Mongolica lowers tariffs for some caravan traffic.',
    },
  ],
  relatedEntities: [
    {
      mode: 'earth',
      id: 'terris-place-rome',
      kind: 'place',
      name: 'Rome',
      role: 'Western terminus of luxury trade (via intermediaries)',
    },
  ],
  nearby: [],
  media: [
    {
      id: 'sr-m1',
      type: 'image',
      title: 'Silk Road routes (overview)',
      sourceName: 'Wikimedia Commons',
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Silk_Route.jpg/1024px-Silk_Route.jpg',
      thumbnailUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Silk_Route.jpg/400px-Silk_Route.jpg',
      caption: 'Schematic map of major overland corridors.',
      credit: 'Map compilation · Wikimedia Commons',
      license: 'Public domain',
      isInterpretive: false,
    },
  ],
  sources: { wikipediaTitle: 'Silk_Road' },
}

export const TERRIS_ENTITY_MARS: TerrisEntity = {
  id: 'terris-planet-mars',
  name: 'Mars',
  mode: 'planetary',
  type: 'planet',
  placeName: null,
  regionName: null,
  countryName: null,
  coords: null,
  startYear: null,
  endYear: null,
  summary:
    'The Red Planet — polar ice caps, volcanoes, and a thin CO₂ sky; our closest neighbor for deep-time geology.',
  fullDescription:
    'Mars preserves ancient surfaces: Valles Marineris, Olympus Mons, and river valleys that speak of wetter epochs. Robotic missions have mapped chemistry and seasons; humans remain a horizon question.',
  facts: [
    { id: 'mars-f1', label: 'Mean radius', value: '3,390 km', source: 'terris' },
    { id: 'mars-f2', label: 'Day length', value: '~24.6 h', source: 'terris' },
    { id: 'mars-f3', label: 'Atmosphere', value: '~95% CO₂', source: 'terris' },
  ],
  timeline: [
    {
      id: 'mars-t1',
      label: 'Mariner 4 flyby',
      startYear: 1965,
      endYear: null,
      summary: 'First close-up images; cratered world confirmed.',
    },
  ],
  relatedEntities: [
    {
      mode: 'planetary',
      id: 'terris-moon-europa',
      kind: 'moon',
      name: 'Europa',
      role: 'Ice moon (Jupiter) — not Martian, but solar-system neighbor',
    },
    {
      mode: 'planetary',
      id: 'terris-spacecraft-voyager1',
      kind: 'spacecraft',
      name: 'Voyager 1',
      role: 'Deep-space mission context',
    },
  ],
  nearby: [],
  media: [
    {
      id: 'mars-m1',
      type: 'image',
      title: 'Mars true color',
      sourceName: 'Wikimedia Commons · OSIRIS',
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/1024px-OSIRIS_Mars_true_color.jpg',
      thumbnailUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/400px-OSIRIS_Mars_true_color.jpg',
      caption: 'Global view from Mars Express.',
      credit: 'ESA / OSIRIS',
      license: 'CC BY-SA 3.0 IGO',
      isInterpretive: false,
    },
  ],
}

export const TERRIS_ENTITY_EUROPA: TerrisEntity = {
  id: 'terris-moon-europa',
  name: 'Europa',
  mode: 'planetary',
  type: 'moon',
  placeName: null,
  regionName: null,
  countryName: null,
  coords: null,
  startYear: null,
  endYear: null,
  summary:
    'Jupiter’s icy moon — a fractured shell and a suspected ocean beneath; a prime target for life-detection.',
  fullDescription:
    'Europa’s chaos terrain and double ridges hint at exchange between ice and brine. Future missions aim to profile chemistry and habitability without assuming life.',
  facts: [
    { id: 'europa-f1', label: 'Parent planet', value: 'Jupiter', source: 'terris' },
    { id: 'europa-f2', label: 'Orbital period', value: '~3.55 days', source: 'terris' },
  ],
  timeline: [
    {
      id: 'europa-t1',
      label: 'Galileo reconnaissance',
      startYear: 1996,
      endYear: 2003,
      summary: 'Multiple flybys; magnetometer signatures consistent with ocean.',
    },
  ],
  relatedEntities: [
    {
      mode: 'planetary',
      id: 'terris-planet-mars',
      kind: 'planet',
      name: 'Mars',
      role: 'Comparative planetary science',
    },
  ],
  nearby: [],
  media: [
    {
      id: 'europa-m1',
      type: 'image',
      title: 'Europa with Jupiter',
      sourceName: 'Wikimedia Commons · NASA',
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Europa-moon-with-Jupiter.jpg/1024px-Europa-moon-with-Jupiter.jpg',
      thumbnailUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Europa-moon-with-Jupiter.jpg/400px-Europa-moon-with-Jupiter.jpg',
      caption: 'Galileo-era composite.',
      credit: 'NASA',
      license: 'Public domain',
      isInterpretive: false,
    },
  ],
}

export const TERRIS_ENTITY_VOYAGER1: TerrisEntity = {
  id: 'terris-spacecraft-voyager1',
  name: 'Voyager 1',
  mode: 'planetary',
  type: 'spacecraft',
  placeName: null,
  regionName: null,
  countryName: null,
  coords: null,
  startYear: 1977,
  endYear: null,
  summary:
    'Grand Tour spacecraft; now in interstellar space carrying the Golden Record.',
  fullDescription:
    'Launched in 1977, Voyager 1 toured Jupiter and Saturn, then climbed above the ecliptic. It crossed the heliopause and still returns telemetry from the deep quiet.',
  facts: [
    { id: 'v1-f1', label: 'Launch', value: '1977-09-05', source: 'terris' },
    { id: 'v1-f2', label: 'Status', value: 'Interstellar mission', source: 'terris' },
  ],
  timeline: [
    {
      id: 'v1-t1',
      label: 'Jupiter encounter',
      startYear: 1979,
      endYear: null,
      summary: 'Volcanic Io and ring discoveries.',
    },
  ],
  relatedEntities: [
    {
      mode: 'cosmic',
      id: 'terris-galaxy-milky-way',
      kind: 'galaxy',
      name: 'Milky Way',
      role: 'Host galaxy',
    },
  ],
  nearby: [],
  media: [],
}

export const TERRIS_ENTITY_MILKY_WAY: TerrisEntity = {
  id: 'terris-galaxy-milky-way',
  name: 'Milky Way',
  mode: 'cosmic',
  type: 'galaxy',
  placeName: null,
  regionName: null,
  countryName: null,
  coords: null,
  startYear: null,
  endYear: null,
  summary:
    'Barred spiral galaxy home to the Sun — billions of stars, gas, dust, and dark matter in slow rotation.',
  fullDescription:
    'From inside the disk we see the Milky Way as a river of light. Gaia and radio surveys map arms, bulge, and halo; the center hides a supermassive black hole.',
  facts: [
    { id: 'mw-f1', label: 'Morphology', value: 'Barred spiral (SBc)', source: 'terris' },
    { id: 'mw-f2', label: 'Sun’s location', value: '~8 kpc from center', source: 'terris' },
  ],
  timeline: [
    {
      id: 'mw-t1',
      label: 'Modern survey era',
      startYear: 2013,
      endYear: null,
      summary: 'Gaia astrometry transforms the galactic census.',
    },
  ],
  relatedEntities: [
    {
      mode: 'cosmic',
      id: 'terris-galaxy-andromeda',
      kind: 'galaxy',
      name: 'Andromeda',
      role: 'Local Group neighbor',
    },
  ],
  nearby: [],
  media: [],
}

export const TERRIS_ENTITY_ANDROMEDA: TerrisEntity = {
  id: 'terris-galaxy-andromeda',
  name: 'Andromeda Galaxy',
  mode: 'cosmic',
  type: 'galaxy',
  placeName: null,
  regionName: null,
  countryName: null,
  coords: null,
  startYear: null,
  endYear: null,
  summary:
    'M31 — nearest large spiral; on a long approach with the Milky Way.',
  fullDescription:
    'Andromeda dominates the Local Group mass. Its disk and satellite system calibrate distance ladders and merger physics for the far future.',
  facts: [
    { id: 'm31-f1', label: 'Designation', value: 'M31 · NGC 224', source: 'terris' },
    { id: 'm31-f2', label: 'Distance', value: '~765 kpc (order-of-magnitude)', source: 'terris' },
  ],
  timeline: [
    {
      id: 'm31-t1',
      label: 'Great Debate context',
      startYear: 1920,
      endYear: null,
      summary: 'Island universe controversy — Andromeda as external galaxy.',
    },
  ],
  relatedEntities: [
    {
      mode: 'cosmic',
      id: 'terris-galaxy-milky-way',
      kind: 'galaxy',
      name: 'Milky Way',
      role: 'Future merger partner (billions of years)',
    },
  ],
  nearby: [],
  media: [],
}

export const EXPLORE_MOCK_CATALOG: Record<string, TerrisEntity> = {
  'terris-place-rome': TERRIS_ENTITY_ROME,
  'terris-planet-mars': TERRIS_ENTITY_MARS,
  'terris-moon-europa': TERRIS_ENTITY_EUROPA,
  'terris-spacecraft-voyager1': TERRIS_ENTITY_VOYAGER1,
  'terris-galaxy-milky-way': TERRIS_ENTITY_MILKY_WAY,
  'terris-galaxy-andromeda': TERRIS_ENTITY_ANDROMEDA,
}
