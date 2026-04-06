/**
 * Editorial mock hub — Boston with Fenway Park and related data.
 * Media uses `sourceName` + optional `license` for editorial / compliance.
 */
import { buildInterpretiveReconstructionStill } from '@/data/reconstruction'
import { buildInterpretiveVideoPlaceholder } from '@/data/clients/interpretiveVideoArchitecture'
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
    'and world-class universities stack on one another—readable today in brick, harbor, and ballpark. It rewards ' +
    'learners who think in layers: geography first, then institutions, then the stories people tell about both.',
  fullDescription:
    'From a Puritan settlement on the Shawmut Peninsula, Boston became a cockpit of the American Revolution: ' +
    'mass meetings, harbor protests, and siege lines that shaped the new republic’s imagination. The 19th century ' +
    'added railroads, Irish and Italian immigration, and industrial muscle; the 20th layered hospitals, research ' +
    'campuses, and a dense transit network. The “Big Dig” rewired the harbor’s edge; the knowledge economy and ' +
    'biotech clusters now anchor the regional economy. Walking the Freedom Trail or watching the tide at Long Wharf, ' +
    'you are reading the same harbor geometry that once moved tea, timber, and ideas. Terris treats Boston as a ' +
    'place dossier where chronology, facts, and related venues (including Fenway Park) interlock for classroom ' +
    'and museum-style study.',
  facts: [
    {
      id: 'boston-f1',
      label: 'Primary designation',
      value: 'City · county seat of Suffolk County, Massachusetts',
      category: 'identity',
      sourceName: 'Terris editorial',
    },
    {
      id: 'boston-f2',
      label: 'Charter',
      value: 'Incorporated as a city · 1822',
      category: 'dates',
      sourceName: 'Terris editorial',
    },
    {
      id: 'boston-f3',
      label: 'Setting',
      value: 'Shawmut Peninsula · Atlantic seaboard · Charles River estuary',
      category: 'location',
      sourceName: 'Terris editorial',
    },
    {
      id: 'boston-f4',
      label: 'Metro population (approx.)',
      value: '~4.9 million (combined statistical area)',
      category: 'dimensions',
      sourceName: 'Round figures for teaching',
    },
    {
      id: 'boston-f5',
      label: 'Revolutionary corridor',
      value: 'Harbor protests, Massacre site, Tea Party, Siege of Boston',
      category: 'significance',
      sourceName: 'U.S. history survey framing',
    },
    {
      id: 'boston-f6',
      label: 'Research universities',
      value: 'Harvard, MIT, Tufts, Northeastern, BU, BC — dense R&D cluster',
      category: 'institutions',
      sourceName: 'Terris editorial',
    },
    {
      id: 'boston-f7',
      label: 'Major sports anchors',
      value: 'Red Sox (MLB), Celtics (NBA), Bruins (NFL region: Patriots)',
      category: 'institutions',
      sourceName: 'League affiliations · teaching list',
    },
    {
      id: 'boston-f8',
      label: 'Transit spine',
      value: 'MBTA “T” subway, bus, commuter rail · walkable core',
      category: 'location',
      sourceName: 'MBTA branding',
    },
    {
      id: 'boston-f9',
      label: 'Public space milestone',
      value: 'Boston Common (1634) — among the earliest shared urban greens in North America',
      category: 'significance',
      sourceName: 'Commons history summaries',
    },
    {
      id: 'boston-f10',
      label: 'Immigrant layers',
      value: 'Irish, Italian, and successive global waves — visible in parishes, foodways, and neighborhoods',
      category: 'significance',
      sourceName: 'Terris editorial',
    },
    {
      id: 'boston-f11',
      label: 'Climate type',
      value: 'Humid continental · snowy winters, warm summers, coastal moderation',
      category: 'location',
      sourceName: 'Köppen-style shorthand',
    },
    {
      id: 'boston-f12',
      label: 'Infrastructure note',
      value: 'Big Dig (1991–2007) reclaimed downtown waterfront for parks and development',
      category: 'dates',
      sourceName: 'MassDOT / public narrative',
    },
  ],
  timeline: [
    {
      id: 'boston-t1',
      title: 'English settlement founded',
      dateLabel: '1630',
      year: 1630,
      type: 'point',
      summary: 'Puritan colonists establish Boston on the Shawmut Peninsula.',
    },
    {
      id: 'boston-t2',
      title: 'American Revolution focal point',
      dateLabel: '1765–1783',
      year: 1765,
      type: 'era',
      endYear: 1783,
      summary: 'Stamp Act resistance, Boston Massacre, Tea Party, Siege of Boston.',
    },
    {
      id: 'boston-t3',
      title: 'Incorporated as a city',
      dateLabel: '1822',
      year: 1822,
      type: 'point',
      summary: 'Municipal charter consolidates a growing Atlantic port.',
    },
    {
      id: 'boston-t4',
      title: 'Industrial & immigrant city',
      dateLabel: '1840–1920',
      year: 1840,
      type: 'era',
      endYear: 1920,
      summary: 'Railroads, manufacturing, Irish and Italian neighborhoods expand the urban fabric.',
    },
    {
      id: 'boston-t5',
      title: 'Great Boston Fire',
      dateLabel: '1872',
      year: 1872,
      type: 'point',
      summary: 'Downtown conflagration accelerates rebuilding and fire codes.',
    },
    {
      id: 'boston-t6',
      title: 'Harbor & highway tension',
      dateLabel: '1950–1990',
      year: 1950,
      type: 'era',
      endYear: 1990,
      summary: 'Urban renewal debates; elevated Central Artery later replaced by tunnel project.',
    },
    {
      id: 'boston-t7',
      title: 'Knowledge economy acceleration',
      dateLabel: '1950–present',
      year: 1950,
      type: 'era',
      endYear: null,
      summary: 'Universities, hospitals, and tech reshape land use along the Charles and the harbor.',
    },
    {
      id: 'boston-t8',
      title: 'Central Artery / Tunnel project',
      dateLabel: '1991–2007',
      year: 1991,
      type: 'range',
      endYear: 2007,
      summary: 'Major infrastructure project reclaims downtown waterfront for public space.',
    },
    {
      id: 'boston-t9',
      title: 'Climate resilience planning',
      dateLabel: '2010–present',
      year: 2010,
      type: 'era',
      endYear: null,
      summary: 'Coastal flooding, transit investment, and district-scale adaptation enter civic debate.',
    },
    {
      id: 'boston-t10',
      title: 'Fenway Park opens (Red Sox)',
      dateLabel: '1912',
      year: 1912,
      type: 'point',
      summary: 'Neighborhood ballpark becomes a civic ritual anchor—see Fenway dossier.',
      relatedEntityIds: ['terris-venue-fenway'],
    },
    {
      id: 'boston-t11',
      title: 'Boston Tea Party',
      dateLabel: '1773 · Dec 16',
      year: 1773,
      type: 'point',
      summary: 'Harbor protest sharpens imperial response and colonial solidarity.',
      relatedEntityIds: ['terris-event-tea-party'],
    },
    {
      id: 'boston-t12',
      title: 'Boston Massacre',
      dateLabel: '1770 · Mar 5',
      year: 1770,
      type: 'point',
      summary: 'Street conflict becomes propaganda material for Patriot printers.',
      relatedEntityIds: ['terris-landmark-old-state-house'],
    },
  ],
  relatedEntities: [
    {
      mode: 'earth',
      id: 'terris-venue-fenway',
      kind: 'venue',
      name: 'Fenway Park',
      role: 'Historic ballpark · Red Sox home since 1912',
      group: 'venues',
    },
    {
      mode: 'earth',
      id: 'terris-event-tea-party',
      kind: 'event',
      name: 'Boston Tea Party',
      role: 'Revolutionary protest (1773)',
      group: 'events',
    },
    {
      mode: 'earth',
      id: 'terris-person-revere',
      kind: 'person',
      name: 'Paul Revere',
      role: 'Messenger · crafts network',
      group: 'people',
    },
    {
      mode: 'earth',
      id: 'terris-landmark-old-state-house',
      kind: 'landmark',
      name: 'Old State House',
      role: 'Colonial civic heart · Freedom Trail',
      group: 'places',
    },
  ],
  nearby: [
    {
      mode: 'earth',
      id: 'terris-venue-fenway',
      kind: 'venue',
      name: 'Fenway Park',
      role: 'Major league venue · ~3 km west of downtown core',
      anchorKind: 'venue',
    },
    {
      mode: 'earth',
      id: 'terris-landmark-old-state-house',
      kind: 'landmark',
      name: 'Old State House',
      role: 'Georgian civic landmark · Financial District',
      anchorKind: 'landmark',
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
    buildInterpretiveReconstructionStill({
      id: 'boston-m6',
      title: 'Harbor and downtown blocks · navigation context',
      url: fenwayImg,
      thumbnailUrl: fenwayImg,
      caption:
        'Modeled massing for orientation—not a surveyed map. Compare to archival photographs and harbor charts.',
      credit: 'Terris interpretive model',
      license: 'Terris editorial (mock)',
      sourceName: 'Terris · interpretive reconstruction',
      reconstructionMeta: {
        prompt:
          'Educational oblique view of Boston harbor edge and downtown blocks for atlas navigation; neutral daylight.',
        historicalPeriod: 'Early 20th-century fabric (approximate for massing)',
        confidenceLabel: 'Illustrative geometry — not cadastral survey',
        interpretationNotes:
          'Street grid, rooflines, and water edge are simplified; exact building footprints vary by source.',
        sourceBasis: 'Historical maps, aerial photography, and harbor navigation charts (mixed eras).',
        promptTemplateId: 'historical-city-scene',
      },
    }),
    buildInterpretiveVideoPlaceholder({
      id: 'boston-vinterp1',
      title: 'Harbor tide and skyline (planned clip)',
      thumbnailUrl: bostonHarborImg,
      caption: 'Short interpretive scene for classroom use — not documentary footage.',
      credit: 'Terris · clip placeholder (no file yet)',
      description:
        'Slow pan across harbor readership: ferries, masts, and Back Bay roofline silhouettes for civic geography lessons.',
      whatIsUncertain:
        'Weather, vessel mix, and seasonal lighting would vary; clip is a teaching mood board, not a dated record.',
      sourceName: 'Terris · interpretive clip (pending)',
    }),
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
    'Home of the Boston Red Sox—the oldest active ballpark in Major League Baseball. Its asymmetry (the Green ' +
    'Monster, Pesky’s Pole, cramped grandstand) is a lesson in pre-modern urban design: the field was fitted into ' +
    'a neighborhood, not a parking bowl.',
  fullDescription:
    'Opened in 1912, Fenway’s quirks are the opposite of a retractable-roof template: shallow right field, a ' +
    '37-foot left-field wall, manually operated scoreboard, and seats that hug the foul lines. Fans arrive by ' +
    'transit and foot; the park’s rhythms—day games, night lights, October crowds—sync with Boston’s academic ' +
    'calendar and harbor weather. Historians read Fenway as both sports infrastructure and civic ritual space: ' +
    'where labor, leisure, and city politics meet in one noisy block. Terris links Fenway back to the Boston place ' +
    'dossier so learners can compare institutional time (franchise eras) with urban time (neighborhood change).',
  facts: [
    {
      id: 'fenway-f1',
      label: 'Tenant franchise',
      value: 'Boston Red Sox (American League · MLB)',
      category: 'identity',
      sourceName: 'MLB',
    },
    {
      id: 'fenway-f2',
      label: 'Opened',
      value: 'April 20, 1912 — inaugural win vs. New York Highlanders',
      category: 'dates',
      sourceName: 'Terris editorial',
    },
    {
      id: 'fenway-f3',
      label: 'Seating capacity (approx.)',
      value: '~37,000 — varies with reconfigurations',
      category: 'dimensions',
      sourceName: 'Ballpark references',
    },
    {
      id: 'fenway-f4',
      label: 'Signature structure',
      value: 'Green Monster — left-field wall (~37 ft)',
      category: 'dimensions',
      sourceName: 'Popular measurement lore',
    },
    {
      id: 'fenway-f5',
      label: 'Neighborhood context',
      value: 'Fenway–Kenmore — dense blocks, universities, hospitals',
      category: 'location',
      sourceName: 'Terris editorial',
    },
    {
      id: 'fenway-f6',
      label: 'Field orientation',
      value: 'Asymmetric outfield; short right porch; triangle in deep right center',
      category: 'dimensions',
      sourceName: 'Field diagrams · teaching',
    },
    {
      id: 'fenway-f7',
      label: 'Night baseball',
      value: 'Lights installed 1947 — schedule and neighborhood soundscape shift',
      category: 'significance',
      sourceName: 'Club history summaries',
    },
    {
      id: 'fenway-f8',
      label: 'Manual scoreboard',
      value: 'Deep left field — operator-updated plates inside the Monster',
      category: 'significance',
      sourceName: 'Ballpark tours · popular accounts',
    },
    {
      id: 'fenway-f9',
      label: 'Historic recognition',
      value: 'Listed on National Register of Historic Places (entries vary by parcel)',
      category: 'institutions',
      sourceName: 'NHRP (teaching note)',
    },
    {
      id: 'fenway-f10',
      label: 'Transit access',
      value: 'Kenmore Green Line · walk-up crowds on game days',
      category: 'location',
      sourceName: 'MBTA',
    },
    {
      id: 'fenway-f11',
      label: 'Civic role',
      value: 'Concert and community use outside baseball season — shared regional asset',
      category: 'significance',
      sourceName: 'Terris editorial',
    },
    {
      id: 'fenway-f12',
      label: 'Comparative note',
      value: 'Oldest active MLB ballpark — contrasts with suburban multi-use stadiums',
      category: 'other',
      sourceName: 'MLB historic ballparks framing',
    },
  ],
  timeline: [
    {
      id: 'fenway-t1',
      title: 'Ballpark opens',
      dateLabel: '1912 · Apr 20',
      year: 1912,
      type: 'point',
      summary: 'Red Sox defeat New York Highlanders in debut; quirks accumulate lore immediately.',
    },
    {
      id: 'fenway-t2',
      title: 'Lights installed',
      dateLabel: '1947',
      year: 1947,
      type: 'point',
      summary: 'Night baseball arrives; schedule and neighborhood soundscapes shift.',
    },
    {
      id: 'fenway-t3',
      title: 'Ted Williams era peak',
      dateLabel: '1939–1960',
      year: 1939,
      type: 'era',
      endYear: 1960,
      summary: 'Left-field porch and Monster become national broadcast icons.',
    },
    {
      id: 'fenway-t4',
      title: '"Impossible Dream" season',
      dateLabel: '1967',
      year: 1967,
      type: 'point',
      summary: 'Pennant after decades of also-ran seasons — civic morale story.',
    },
    {
      id: 'fenway-t5',
      title: 'New seating & Monster seats',
      dateLabel: '2003–2005',
      year: 2003,
      type: 'range',
      endYear: 2005,
      summary: 'Renovations add atop-the-Monster seats; debate over authenticity vs. revenue.',
    },
    {
      id: 'fenway-t6',
      title: '2013 championship run',
      dateLabel: '2013',
      year: 2013,
      type: 'point',
      summary: 'World Series after marathon-city spring — emotional civic narrative.',
    },
    {
      id: 'fenway-t7',
      title: '2018 championship',
      dateLabel: '2018',
      year: 2018,
      type: 'point',
      summary: 'Dominant postseason; park hosts duck-boat parade terminus.',
    },
    {
      id: 'fenway-t8',
      title: 'Pandemic-era baseball',
      dateLabel: '2020',
      year: 2020,
      type: 'point',
      summary: 'Shortened season; cardboard fans — stadium as broadcast studio.',
    },
  ],
  relatedEntities: [
    {
      mode: 'earth',
      id: BOSTON_HUB_ID,
      kind: 'place',
      name: 'Boston',
      role: 'Host city · harbor and institutional context',
      group: 'places',
    },
    {
      mode: 'earth',
      id: 'terris-landmark-old-state-house',
      kind: 'landmark',
      name: 'Old State House',
      role: 'Colonial civic anchor · reachable by transit',
      group: 'places',
    },
    {
      mode: 'earth',
      id: 'terris-event-tea-party',
      kind: 'event',
      name: 'Boston Tea Party',
      role: 'Shared harbor-city civic story',
      group: 'events',
    },
  ],
  nearby: [
    {
      mode: 'earth',
      id: 'terris-landmark-old-state-house',
      kind: 'landmark',
      name: 'Old State House',
      role: 'Downtown landmark · Orange/Red Line connections from Kenmore transfers',
      anchorKind: 'landmark',
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
    buildInterpretiveReconstructionStill({
      id: 'fenway-m3',
      title: 'Green Monster · height and foul line (illustrative)',
      url: fenwayImg,
      thumbnailUrl: fenwayImg,
      caption:
        'Wall height and left-field geometry for spatial learning—not a survey drawing or broadcast view.',
      credit: 'Terris interpretive model · verify against ballpark measurements',
      license: 'Terris editorial (mock)',
      sourceName: 'Terris · interpretive reconstruction',
      reconstructionMeta: {
        prompt:
          'Educational cross-section emphasis of the Green Monster with foul pole context; calm daylight; no crowd hero shots.',
        historicalPeriod: '1912 opening era (ballpark fabric) / modern scoreboard omitted unless noted',
        confidenceLabel: 'Illustrative — based on published dimensions and photos',
        interpretationNotes:
          'Manual scoreboard details, ad placement, and netting change by decade; scene is a teaching composite.',
        sourceBasis:
          'MLB and ballpark references for wall height; historic photographs for foul-line geometry; not a single game moment.',
        promptTemplateId: 'landmark-era',
      },
    }),
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
    {
      id: 'tea-f1',
      label: 'Target',
      value: 'East India Company tea shipments',
      category: 'significance',
      sourceName: 'Standard accounts',
    },
    {
      id: 'tea-f2',
      label: 'Parliamentary context',
      value: 'Tea Act, 1773',
      category: 'dates',
      sourceName: 'British statute framing',
    },
  ],
  timeline: [
    {
      id: 'tea-t1',
      title: 'Tea destroyed',
      dateLabel: '1773 · Dec 16',
      year: 1773,
      type: 'point',
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
      group: 'places',
    },
    {
      mode: 'earth',
      id: 'terris-landmark-old-state-house',
      kind: 'landmark',
      name: 'Old State House',
      role: 'Nearby civic stage',
      group: 'places',
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
    {
      id: 'rev-f1',
      label: 'Craft',
      value: 'Silversmith, engraver',
      category: 'identity',
      sourceName: 'Biographical summaries',
    },
    {
      id: 'rev-f2',
      label: 'Signal ride',
      value: 'April 18–19, 1775',
      category: 'dates',
      sourceName: 'Lexington & Concord campaigns',
    },
  ],
  timeline: [
    {
      id: 'rev-t1',
      title: 'Midnight ride',
      dateLabel: '1775 · Apr 18–19',
      year: 1775,
      type: 'point',
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
      group: 'places',
    },
    {
      mode: 'earth',
      id: 'terris-landmark-old-state-house',
      kind: 'landmark',
      name: 'Old State House',
      role: 'Civic context',
      group: 'places',
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
    {
      id: 'osh-f1',
      label: 'Architectural style',
      value: 'Georgian',
      category: 'identity',
      sourceName: 'Preservation framing',
    },
    {
      id: 'osh-f2',
      label: 'Boston Massacre',
      value: 'March 5, 1770 — intersection conflict',
      category: 'dates',
      sourceName: 'Colonial records',
    },
  ],
  timeline: [
    {
      id: 'osh-t1',
      title: 'Boston Massacre',
      dateLabel: '1770 · Mar 5',
      year: 1770,
      type: 'point',
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
      group: 'places',
    },
    {
      mode: 'earth',
      id: 'terris-event-tea-party',
      kind: 'event',
      name: 'Boston Tea Party',
      role: 'Revolutionary sequence',
      group: 'events',
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
