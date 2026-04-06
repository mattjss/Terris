export type EntityType = 'place' | 'empire' | 'architecture' | 'battle' | 'trade-route'

export interface HistoricalEntity {
  id: string
  name: string
  type: EntityType
  lat: number
  lng: number
  yearStart: number
  yearEnd: number
  description: string
  color: string
  radius?: number
  path?: [number, number][]
  details?: { label: string; value: string }[]
  related?: string[]
}

export interface Era {
  label: string
  start: number
  end: number
}

export const GLOBE_RADIUS = 2
export const YEAR_MIN = -3000
export const YEAR_MAX = 2000
export const YEAR_DEFAULT = 100

export const ERAS: Era[] = [
  { label: 'Ancient', start: -3000, end: -500 },
  { label: 'Classical', start: -500, end: 500 },
  { label: 'Medieval', start: 500, end: 1500 },
  { label: 'Early Modern', start: 1500, end: 1800 },
  { label: 'Modern', start: 1800, end: 2000 },
]

export const ENTITY_TYPE_META: { id: EntityType; label: string; color: string }[] = [
  { id: 'place', label: 'Places', color: '#a0aec0' },
  { id: 'empire', label: 'Empires', color: '#9b7cb8' },
  { id: 'architecture', label: 'Architecture', color: '#d4a843' },
  { id: 'battle', label: 'Battles', color: '#e07a5f' },
  { id: 'trade-route', label: 'Trade Routes', color: '#4fd1c5' },
]

export const entities: HistoricalEntity[] = [
  // ── Places ──────────────────────────────────────────────
  {
    id: 'rome',
    name: 'Rome',
    type: 'place',
    lat: 41.9,
    lng: 12.5,
    yearStart: -753,
    yearEnd: 2000,
    description: 'The Eternal City — capital of the Roman Republic and Empire, and seat of the papacy for two millennia.',
    color: '#a0aec0',
    details: [
      { label: 'Region', value: 'Latium, Italy' },
      { label: 'Peak population', value: '~1 million (2nd c.)' },
      { label: 'Known for', value: 'Law, engineering, governance' },
    ],
    related: ['roman-empire', 'colosseum', 'mediterranean-route'],
  },
  {
    id: 'constantinople',
    name: 'Constantinople',
    type: 'place',
    lat: 41.01,
    lng: 28.98,
    yearStart: -660,
    yearEnd: 2000,
    description: 'Strategic crossroads between Europe and Asia, capital of the Byzantine and later Ottoman empires.',
    color: '#a0aec0',
    details: [
      { label: 'Modern name', value: 'Istanbul' },
      { label: 'Founded as', value: 'Byzantium (c. 660 BCE)' },
      { label: 'Known for', value: 'Trade, religion, siege warfare' },
    ],
    related: ['byzantine-empire', 'ottoman-empire', 'hagia-sophia', 'siege-constantinople'],
  },
  {
    id: 'alexandria',
    name: 'Alexandria',
    type: 'place',
    lat: 31.2,
    lng: 29.92,
    yearStart: -331,
    yearEnd: 2000,
    description: 'Hellenistic capital of knowledge, home to the Great Library and the Pharos lighthouse.',
    color: '#a0aec0',
    details: [
      { label: 'Region', value: 'Nile Delta, Egypt' },
      { label: 'Founded by', value: 'Alexander the Great' },
      { label: 'Known for', value: 'Scholarship, lighthouse, trade' },
    ],
    related: ['mediterranean-route', 'pyramids'],
  },
  {
    id: 'athens',
    name: 'Athens',
    type: 'place',
    lat: 37.97,
    lng: 23.72,
    yearStart: -1400,
    yearEnd: 2000,
    description: 'Birthplace of democracy, Western philosophy, and classical drama.',
    color: '#a0aec0',
    details: [
      { label: 'Region', value: 'Attica, Greece' },
      { label: 'Golden age', value: '5th century BCE' },
      { label: 'Known for', value: 'Democracy, philosophy, arts' },
    ],
    related: ['parthenon', 'marathon', 'thermopylae'],
  },
  {
    id: 'jerusalem',
    name: 'Jerusalem',
    type: 'place',
    lat: 31.77,
    lng: 35.23,
    yearStart: -1000,
    yearEnd: 2000,
    description: 'Holy city for Judaism, Christianity, and Islam — one of the most contested places in history.',
    color: '#a0aec0',
    details: [
      { label: 'Region', value: 'Judea / Levant' },
      { label: 'Sacred to', value: 'Three Abrahamic faiths' },
      { label: 'Known for', value: 'Temples, crusades, pilgrimages' },
    ],
    related: ['roman-empire', 'ottoman-empire'],
  },
  {
    id: 'beijing',
    name: 'Beijing',
    type: 'place',
    lat: 39.9,
    lng: 116.4,
    yearStart: -1045,
    yearEnd: 2000,
    description: 'Imperial capital of successive Chinese dynasties and the northern terminus of the Grand Canal.',
    color: '#a0aec0',
    details: [
      { label: 'Region', value: 'North China Plain' },
      { label: 'Also known as', value: 'Peking, Dadu, Yanjing' },
      { label: 'Known for', value: 'Forbidden City, imperial rule' },
    ],
    related: ['han-dynasty', 'mongol-empire', 'great-wall', 'silk-road'],
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    type: 'place',
    lat: 35.01,
    lng: 135.77,
    yearStart: 794,
    yearEnd: 2000,
    description: 'Imperial capital of Japan for over a thousand years, center of classical arts and Zen culture.',
    color: '#a0aec0',
    details: [
      { label: 'Region', value: 'Kansai, Japan' },
      { label: 'Capital until', value: '1868' },
      { label: 'Known for', value: 'Temples, tea ceremony, geisha' },
    ],
    related: [],
  },
  {
    id: 'tenochtitlan',
    name: 'Tenochtitlan',
    type: 'place',
    lat: 19.43,
    lng: -99.13,
    yearStart: 1325,
    yearEnd: 1521,
    description: 'Island capital of the Aztec Empire, built on Lake Texcoco with causeways and floating gardens.',
    color: '#a0aec0',
    details: [
      { label: 'Modern site', value: 'Mexico City' },
      { label: 'Population', value: '~200,000 at peak' },
      { label: 'Known for', value: 'Chinampas, temples, causeways' },
    ],
    related: ['aztec-empire', 'fall-tenochtitlan'],
  },
  {
    id: 'cusco',
    name: 'Cusco',
    type: 'place',
    lat: -13.52,
    lng: -71.97,
    yearStart: -1100,
    yearEnd: 2000,
    description: 'Navel of the Inca world, set high in the Andes with precision-cut stone walls.',
    color: '#a0aec0',
    details: [
      { label: 'Region', value: 'Andes, Peru' },
      { label: 'Elevation', value: '3,400 m' },
      { label: 'Known for', value: 'Inca stonework, Qorikancha' },
    ],
    related: ['inca-empire', 'machu-picchu'],
  },
  {
    id: 'cairo',
    name: 'Cairo',
    type: 'place',
    lat: 30.04,
    lng: 31.24,
    yearStart: 969,
    yearEnd: 2000,
    description: 'The City Victorious, gateway to the pyramids and cultural capital of the Arab world.',
    color: '#a0aec0',
    details: [
      { label: 'Region', value: 'Nile Valley, Egypt' },
      { label: 'Founded by', value: 'Fatimid dynasty' },
      { label: 'Known for', value: 'Al-Azhar, Citadel, bazaars' },
    ],
    related: ['pyramids', 'ottoman-empire'],
  },

  // ── Empires ─────────────────────────────────────────────
  {
    id: 'roman-empire',
    name: 'Roman Empire',
    type: 'empire',
    lat: 41.9,
    lng: 12.5,
    yearStart: -27,
    yearEnd: 476,
    description: 'From Augustus to Romulus Augustulus — the empire that shaped Western law, language, and engineering.',
    color: '#c9a84c',
    radius: 0.7,
    details: [
      { label: 'Capital', value: 'Rome' },
      { label: 'Peak extent', value: '5 million km² (117 CE)' },
      { label: 'Language', value: 'Latin' },
    ],
    related: ['rome', 'colosseum', 'constantinople', 'actium'],
  },
  {
    id: 'byzantine-empire',
    name: 'Byzantine Empire',
    type: 'empire',
    lat: 41.01,
    lng: 28.98,
    yearStart: 330,
    yearEnd: 1453,
    description: 'The eastern continuation of Rome, preserving classical knowledge through the medieval period.',
    color: '#9b7cb8',
    radius: 0.5,
    details: [
      { label: 'Capital', value: 'Constantinople' },
      { label: 'Duration', value: '1,123 years' },
      { label: 'Religion', value: 'Eastern Orthodox Christianity' },
    ],
    related: ['constantinople', 'hagia-sophia', 'siege-constantinople'],
  },
  {
    id: 'ottoman-empire',
    name: 'Ottoman Empire',
    type: 'empire',
    lat: 39.92,
    lng: 32.85,
    yearStart: 1299,
    yearEnd: 1922,
    description: 'A multiethnic empire spanning three continents, centered on Anatolia and the eastern Mediterranean.',
    color: '#c75c5c',
    radius: 0.6,
    details: [
      { label: 'Capital', value: 'Constantinople (1453–)' },
      { label: 'Peak extent', value: '5.2 million km²' },
      { label: 'Known for', value: 'Sultans, janissaries, architecture' },
    ],
    related: ['constantinople', 'siege-constantinople', 'jerusalem'],
  },
  {
    id: 'mongol-empire',
    name: 'Mongol Empire',
    type: 'empire',
    lat: 47.9,
    lng: 106.9,
    yearStart: 1206,
    yearEnd: 1368,
    description: 'The largest contiguous land empire in history, forged by Genghis Khan across the Eurasian steppe.',
    color: '#6b9b6b',
    radius: 1.0,
    details: [
      { label: 'Capital', value: 'Karakorum' },
      { label: 'Peak extent', value: '24 million km²' },
      { label: 'Founded by', value: 'Genghis Khan' },
    ],
    related: ['beijing', 'silk-road'],
  },
  {
    id: 'persian-empire',
    name: 'Persian Empire',
    type: 'empire',
    lat: 29.93,
    lng: 52.89,
    yearStart: -550,
    yearEnd: -330,
    description: 'The Achaemenid dynasty united the Near East under a tolerant and efficient administration.',
    color: '#5ba8a0',
    radius: 0.65,
    details: [
      { label: 'Capital', value: 'Persepolis' },
      { label: 'Peak extent', value: '5.5 million km²' },
      { label: 'Founded by', value: 'Cyrus the Great' },
    ],
    related: ['marathon', 'thermopylae', 'incense-route'],
  },
  {
    id: 'han-dynasty',
    name: 'Han Dynasty',
    type: 'empire',
    lat: 34.26,
    lng: 108.94,
    yearStart: -206,
    yearEnd: 220,
    description: 'A golden age of Chinese civilization that established the Silk Road and Confucian bureaucracy.',
    color: '#c77a4a',
    radius: 0.6,
    details: [
      { label: 'Capital', value: "Chang'an (Xi'an)" },
      { label: 'Population', value: '~60 million' },
      { label: 'Known for', value: 'Paper, Silk Road, civil service' },
    ],
    related: ['beijing', 'silk-road', 'great-wall'],
  },
  {
    id: 'aztec-empire',
    name: 'Aztec Empire',
    type: 'empire',
    lat: 19.43,
    lng: -99.13,
    yearStart: 1428,
    yearEnd: 1521,
    description: 'A Mesoamerican Triple Alliance dominating central Mexico through tribute and military conquest.',
    color: '#d4843a',
    radius: 0.25,
    details: [
      { label: 'Capital', value: 'Tenochtitlan' },
      { label: 'Population', value: '~5 million subjects' },
      { label: 'Known for', value: 'Pyramids, calendar, sacrifice' },
    ],
    related: ['tenochtitlan', 'fall-tenochtitlan'],
  },
  {
    id: 'inca-empire',
    name: 'Inca Empire',
    type: 'empire',
    lat: -13.52,
    lng: -71.97,
    yearStart: 1438,
    yearEnd: 1533,
    description: 'The largest empire in pre-Columbian America, connected by an extensive road network through the Andes.',
    color: '#8ba84c',
    radius: 0.3,
    details: [
      { label: 'Capital', value: 'Cusco' },
      { label: 'Road system', value: '40,000 km' },
      { label: 'Known for', value: 'Quipu, terracing, Machu Picchu' },
    ],
    related: ['cusco', 'machu-picchu'],
  },

  // ── Architecture ────────────────────────────────────────
  {
    id: 'pyramids',
    name: 'Pyramids of Giza',
    type: 'architecture',
    lat: 29.98,
    lng: 31.13,
    yearStart: -2560,
    yearEnd: 2000,
    description: 'The last surviving Wonder of the Ancient World, built as royal tombs during the Old Kingdom.',
    color: '#d4a843',
    details: [
      { label: 'Built for', value: 'Pharaohs Khufu, Khafre, Menkaure' },
      { label: 'Height', value: '146 m (original)' },
      { label: 'Style', value: 'Egyptian monumental' },
    ],
    related: ['cairo', 'alexandria'],
  },
  {
    id: 'parthenon',
    name: 'Parthenon',
    type: 'architecture',
    lat: 37.97,
    lng: 23.73,
    yearStart: -447,
    yearEnd: 2000,
    description: 'Temple of Athena atop the Acropolis, the pinnacle of Doric architecture.',
    color: '#d4a843',
    details: [
      { label: 'Architect', value: 'Ictinus, Callicrates' },
      { label: 'Dedicated to', value: 'Athena Parthenos' },
      { label: 'Style', value: 'Doric order' },
    ],
    related: ['athens'],
  },
  {
    id: 'colosseum',
    name: 'Colosseum',
    type: 'architecture',
    lat: 41.89,
    lng: 12.49,
    yearStart: 80,
    yearEnd: 2000,
    description: 'The Flavian Amphitheatre — Rome\'s arena for gladiatorial combat, seating 50,000 spectators.',
    color: '#d4a843',
    details: [
      { label: 'Commissioned by', value: 'Emperor Vespasian' },
      { label: 'Capacity', value: '50,000–80,000' },
      { label: 'Style', value: 'Roman imperial' },
    ],
    related: ['rome', 'roman-empire'],
  },
  {
    id: 'hagia-sophia',
    name: 'Hagia Sophia',
    type: 'architecture',
    lat: 41.01,
    lng: 28.98,
    yearStart: 537,
    yearEnd: 2000,
    description: 'Cathedral turned mosque turned museum — its massive dome defined Byzantine architecture.',
    color: '#d4a843',
    details: [
      { label: 'Commissioned by', value: 'Emperor Justinian I' },
      { label: 'Dome span', value: '31 m' },
      { label: 'Style', value: 'Byzantine' },
    ],
    related: ['constantinople', 'byzantine-empire'],
  },
  {
    id: 'angkor-wat',
    name: 'Angkor Wat',
    type: 'architecture',
    lat: 13.41,
    lng: 103.87,
    yearStart: 1150,
    yearEnd: 2000,
    description: 'The world\'s largest religious monument, built as a Hindu temple by the Khmer Empire.',
    color: '#d4a843',
    details: [
      { label: 'Built by', value: 'Suryavarman II' },
      { label: 'Area', value: '162.6 hectares' },
      { label: 'Style', value: 'Khmer classical' },
    ],
    related: [],
  },
  {
    id: 'machu-picchu',
    name: 'Machu Picchu',
    type: 'architecture',
    lat: -13.16,
    lng: -72.55,
    yearStart: 1450,
    yearEnd: 2000,
    description: 'Inca citadel set high above the Urubamba Valley, likely a royal estate for Pachacuti.',
    color: '#d4a843',
    details: [
      { label: 'Elevation', value: '2,430 m' },
      { label: 'Rediscovered', value: '1911 by Hiram Bingham' },
      { label: 'Style', value: 'Inca dry-stone' },
    ],
    related: ['cusco', 'inca-empire'],
  },
  {
    id: 'great-wall',
    name: 'Great Wall of China',
    type: 'architecture',
    lat: 40.43,
    lng: 116.57,
    yearStart: -700,
    yearEnd: 2000,
    description: 'A series of fortifications spanning thousands of kilometers, built across many dynasties.',
    color: '#d4a843',
    details: [
      { label: 'Total length', value: '21,196 km (all sections)' },
      { label: 'Major rebuilds', value: 'Qin, Han, Ming dynasties' },
      { label: 'Purpose', value: 'Northern frontier defense' },
    ],
    related: ['beijing', 'han-dynasty', 'mongol-empire'],
  },
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    type: 'architecture',
    lat: 27.17,
    lng: 78.04,
    yearStart: 1653,
    yearEnd: 2000,
    description: 'A white-marble mausoleum built by Mughal emperor Shah Jahan in memory of his wife Mumtaz Mahal.',
    color: '#d4a843',
    details: [
      { label: 'Commissioned by', value: 'Shah Jahan' },
      { label: 'Completed', value: '1653' },
      { label: 'Style', value: 'Mughal' },
    ],
    related: [],
  },

  // ── Battles ─────────────────────────────────────────────
  {
    id: 'marathon',
    name: 'Battle of Marathon',
    type: 'battle',
    lat: 38.17,
    lng: 24.0,
    yearStart: -490,
    yearEnd: -490,
    description: 'Athenian hoplites repelled a Persian invasion force on the plain of Marathon, preserving Greek independence.',
    color: '#e07a5f',
    details: [
      { label: 'Combatants', value: 'Athens vs. Persia' },
      { label: 'Outcome', value: 'Decisive Greek victory' },
      { label: 'Significance', value: 'Halted first Persian invasion' },
    ],
    related: ['athens', 'persian-empire'],
  },
  {
    id: 'thermopylae',
    name: 'Battle of Thermopylae',
    type: 'battle',
    lat: 38.8,
    lng: 22.55,
    yearStart: -480,
    yearEnd: -480,
    description: 'King Leonidas and 300 Spartans held the narrow pass against Xerxes\' vast army.',
    color: '#e07a5f',
    details: [
      { label: 'Combatants', value: 'Greek allies vs. Persia' },
      { label: 'Outcome', value: 'Persian victory, Greek delay' },
      { label: 'Significance', value: 'Iconic last stand, rallied Greece' },
    ],
    related: ['athens', 'persian-empire'],
  },
  {
    id: 'actium',
    name: 'Battle of Actium',
    type: 'battle',
    lat: 38.95,
    lng: 20.72,
    yearStart: -31,
    yearEnd: -31,
    description: 'Octavian\'s naval victory over Antony and Cleopatra ended the Roman Republic and began the Empire.',
    color: '#e07a5f',
    details: [
      { label: 'Combatants', value: 'Octavian vs. Antony & Cleopatra' },
      { label: 'Outcome', value: 'Decisive Octavian victory' },
      { label: 'Significance', value: 'Birth of the Roman Empire' },
    ],
    related: ['roman-empire', 'rome', 'alexandria'],
  },
  {
    id: 'hastings',
    name: 'Battle of Hastings',
    type: 'battle',
    lat: 50.91,
    lng: 0.49,
    yearStart: 1066,
    yearEnd: 1066,
    description: 'William the Conqueror defeated King Harold II, reshaping English language, law, and aristocracy.',
    color: '#e07a5f',
    details: [
      { label: 'Combatants', value: 'Normans vs. Anglo-Saxons' },
      { label: 'Outcome', value: 'Norman victory' },
      { label: 'Significance', value: 'Norman conquest of England' },
    ],
    related: [],
  },
  {
    id: 'siege-constantinople',
    name: 'Fall of Constantinople',
    type: 'battle',
    lat: 41.01,
    lng: 28.98,
    yearStart: 1453,
    yearEnd: 1453,
    description: 'Sultan Mehmed II breached the Theodosian Walls, ending the Byzantine Empire after 1,100 years.',
    color: '#e07a5f',
    details: [
      { label: 'Combatants', value: 'Ottoman Empire vs. Byzantium' },
      { label: 'Outcome', value: 'Ottoman victory' },
      { label: 'Significance', value: 'End of the Roman legacy in the East' },
    ],
    related: ['constantinople', 'byzantine-empire', 'ottoman-empire'],
  },
  {
    id: 'fall-tenochtitlan',
    name: 'Fall of Tenochtitlan',
    type: 'battle',
    lat: 19.43,
    lng: -99.13,
    yearStart: 1521,
    yearEnd: 1521,
    description: 'Hernán Cortés and indigenous allies besieged and captured the Aztec capital after a 75-day siege.',
    color: '#e07a5f',
    details: [
      { label: 'Combatants', value: 'Spain & allies vs. Aztec Empire' },
      { label: 'Outcome', value: 'Spanish victory' },
      { label: 'Significance', value: 'End of the Aztec Empire' },
    ],
    related: ['tenochtitlan', 'aztec-empire'],
  },

  // ── Trade Routes ────────────────────────────────────────
  {
    id: 'silk-road',
    name: 'Silk Road',
    type: 'trade-route',
    lat: 39.0,
    lng: 68.0,
    yearStart: -130,
    yearEnd: 1453,
    description: 'A network of overland routes linking China to the Mediterranean, carrying silk, spices, ideas, and disease.',
    color: '#4fd1c5',
    path: [
      [34.26, 108.94],
      [40.14, 94.66],
      [39.65, 66.96],
      [33.31, 44.37],
      [41.01, 28.98],
    ],
    details: [
      { label: 'Goods', value: 'Silk, spices, glassware, paper' },
      { label: 'Length', value: '~6,400 km' },
      { label: 'Named by', value: 'Ferdinand von Richthofen (1877)' },
    ],
    related: ['han-dynasty', 'roman-empire', 'mongol-empire', 'constantinople', 'beijing'],
  },
  {
    id: 'mediterranean-route',
    name: 'Mediterranean Trade',
    type: 'trade-route',
    lat: 37.0,
    lng: 18.0,
    yearStart: -800,
    yearEnd: 1500,
    description: 'Phoenician, Greek, and Roman sea lanes that linked every port of the inland sea.',
    color: '#4fd1c5',
    path: [
      [41.9, 12.5],
      [36.8, 10.18],
      [31.2, 29.92],
      [41.01, 28.98],
    ],
    details: [
      { label: 'Goods', value: 'Grain, olive oil, wine, pottery' },
      { label: 'Key ports', value: 'Rome, Carthage, Alexandria' },
    ],
    related: ['rome', 'alexandria', 'constantinople'],
  },
  {
    id: 'incense-route',
    name: 'Incense Route',
    type: 'trade-route',
    lat: 24.0,
    lng: 42.0,
    yearStart: -500,
    yearEnd: 200,
    description: 'Caravan trails carrying frankincense and myrrh from southern Arabia to the Mediterranean markets.',
    color: '#4fd1c5',
    path: [
      [17.02, 54.09],
      [15.35, 44.21],
      [30.33, 35.44],
      [31.5, 34.47],
    ],
    details: [
      { label: 'Goods', value: 'Frankincense, myrrh, spices' },
      { label: 'Key stops', value: "Dhofar, Ma'rib, Petra, Gaza" },
    ],
    related: ['jerusalem', 'persian-empire'],
  },
]

export function latLngToVec3(
  lat: number,
  lng: number,
  radius: number,
): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ]
}

export function formatYear(year: number): string {
  if (year <= 0) return `${Math.abs(year)} BCE`
  return `${year} CE`
}

export function formatYearRange(start: number, end: number): string {
  if (start === end) return formatYear(start)
  return `${formatYear(start)} – ${formatYear(end)}`
}

export function getTypeColor(type: EntityType): string {
  return ENTITY_TYPE_META.find((t) => t.id === type)?.color ?? '#a0aec0'
}

export function getTypeLabel(type: EntityType): string {
  return ENTITY_TYPE_META.find((t) => t.id === type)?.label ?? type
}

const BATTLE_VISIBILITY_BUFFER = 50

export function isVisibleAtYear(entity: HistoricalEntity, year: number): boolean {
  if (entity.type === 'battle') {
    return Math.abs(year - entity.yearStart) <= BATTLE_VISIBILITY_BUFFER
  }
  return year >= entity.yearStart && year <= entity.yearEnd
}
