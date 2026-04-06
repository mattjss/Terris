import type { LearningPathway } from '@/data/learning/pathwayTypes'
import { BOSTON_HUB_ID } from '@/data/mock/bostonEntityHub'

/**
 * First guided pathways — each step maps to a mock catalog entity where possible.
 */
export const SEED_LEARNING_PATHWAYS: LearningPathway[] = [
  {
    id: 'pathway-boston-time',
    title: 'Boston Through Time',
    description:
      'Move from harbor to ballpark along real places and turning points — a grounded way to practice reading the timeline.',
    ageRange: 'all',
    mode: 'earth',
    theme: 'history',
    estimatedDuration: '25–35 min',
    steps: [
      {
        id: 'bos-1',
        title: 'City as a palimpsest',
        entityId: BOSTON_HUB_ID,
        mode: 'earth',
        goal: 'Orient to Boston as one place with stacked eras.',
        prompt:
          'Start with the overview: notice how summary, facts, and media work together before you zoom a single year.',
        year: 1850,
        sheetTab: 'overview',
      },
      {
        id: 'bos-2',
        title: 'Harbor protest',
        entityId: 'terris-event-tea-party',
        mode: 'earth',
        goal: 'Connect a famous event to place and date.',
        prompt:
          'Open the timeline entry for this event — what changes if you scrub the global year before and after?',
        year: 1773,
        sheetTab: 'timeline',
      },
      {
        id: 'bos-3',
        title: 'Civic stone',
        entityId: 'terris-landmark-old-state-house',
        mode: 'earth',
        goal: 'Link architecture to civic life.',
        prompt:
          'Use Facts to anchor what was happening here; then glance at Media for how the building reads today.',
        year: 1770,
        sheetTab: 'facts',
      },
      {
        id: 'bos-4',
        title: 'Networks of warning',
        entityId: 'terris-person-revere',
        mode: 'earth',
        goal: 'Follow a person across related places.',
        prompt:
          'Check Related — how does Terris suggest connections without forcing a single story?',
        sheetTab: 'related',
      },
      {
        id: 'bos-5',
        title: 'Modern ritual, old land',
        entityId: 'terris-venue-fenway',
        mode: 'earth',
        goal: 'Contrast industrial-era leisure with earlier civic layers.',
        prompt:
          'In Media, compare documentary shots with any interpretive stills — what is evidence vs illustration?',
        year: 1912,
        sheetTab: 'media',
        mediaFocus: 'Compare archival and interpretive items.',
      },
    ],
  },
  {
    id: 'pathway-ancient-rome',
    title: 'Ancient Rome',
    description:
      'Layer republic, empire, and stone memory in one city hub — revisit the same place through different lenses.',
    ageRange: '13-17',
    mode: 'earth',
    theme: 'history',
    estimatedDuration: '20–30 min',
    steps: [
      {
        id: 'rome-1',
        title: 'Forum as spine',
        entityId: 'terris-place-rome',
        mode: 'earth',
        goal: 'Frame Rome as a long-duration place, not a single date.',
        prompt:
          'Read the overview slowly — what questions would you ask a class about change vs continuity?',
        year: -50,
        sheetTab: 'overview',
      },
      {
        id: 'rome-2',
        title: 'Deep time on the timeline',
        entityId: 'terris-place-rome',
        mode: 'earth',
        goal: 'Practice moving between legend and record.',
        prompt:
          'Skim timeline events — which entries are traditional dates vs firmer archaeology?',
        year: -753,
        sheetTab: 'timeline',
      },
      {
        id: 'rome-3',
        title: 'Terrain and river',
        entityId: 'terris-place-rome',
        mode: 'earth',
        goal: 'Ground geography before narrative.',
        prompt:
          'In Facts, list what is fixed (river, region) vs what shifts politically.',
        sheetTab: 'facts',
      },
      {
        id: 'rome-4',
        title: 'Seeing the past responsibly',
        entityId: 'terris-place-rome',
        mode: 'earth',
        goal: 'Separate documentary media from teaching reconstructions.',
        prompt:
          'In Media, read captions for interpretive items — what uncertainty does Terris surface?',
        sheetTab: 'media',
        mediaFocus: 'Interpretive reconstruction labels.',
      },
    ],
  },
  {
    id: 'pathway-journey-mars',
    title: 'Journey to Mars',
    description:
      'Leave Earth’s hub, tour Mars, then widen to moons and robotic witnesses — scale as a story.',
    ageRange: 'all',
    mode: 'planetary',
    theme: 'space',
    estimatedDuration: '25–40 min',
    steps: [
      {
        id: 'mars-1',
        title: 'Home port',
        entityId: BOSTON_HUB_ID,
        mode: 'earth',
        goal: 'Anchor human scale before leaving the planet.',
        prompt:
          'Notice coordinates and era on Earth — you’ll contrast this with bodies that have no “city”.',
        sheetTab: 'overview',
      },
      {
        id: 'mars-2',
        title: 'The Red Planet',
        entityId: 'terris-planet-mars',
        mode: 'planetary',
        goal: 'Read Mars as a world with geology and seasons.',
        prompt:
          'Switching scale is intentional — let the sheet refocus; skim facts before media.',
        sheetTab: 'overview',
      },
      {
        id: 'mars-3',
        title: 'Ice moon neighbor',
        entityId: 'terris-moon-europa',
        mode: 'planetary',
        goal: 'Compare a moon’s story to Mars’s dry history.',
        prompt:
          'Ask: what questions does ice unlock that sand doesn’t?',
        sheetTab: 'facts',
      },
      {
        id: 'mars-4',
        title: 'Robotic witness',
        entityId: 'terris-spacecraft-voyager1',
        mode: 'planetary',
        goal: 'Connect instruments to how we know distant places.',
        prompt:
          'Timeline + related links show how missions braid together — optional rabbit holes welcome.',
        sheetTab: 'timeline',
      },
    ],
  },
  {
    id: 'pathway-silk-road',
    title: 'The Silk Road',
    description:
      'Treat exchange as a braided network — then land in a western hub to feel distance and delay.',
    ageRange: '13-17',
    mode: 'earth',
    theme: 'culture',
    estimatedDuration: '25–35 min',
    steps: [
      {
        id: 'sr-1',
        title: 'Network, not a line',
        entityId: 'terris-empire-silk-road',
        mode: 'earth',
        goal: 'Replace a cartoon “road” with goods, faiths, and genes.',
        prompt:
          'Start with the hub summary — what moves besides silk?',
        year: 200,
        sheetTab: 'overview',
      },
      {
        id: 'sr-2',
        title: 'Caravan years',
        entityId: 'terris-empire-silk-road',
        mode: 'earth',
        goal: 'See long arcs and Mongol-era peace as hypotheses, not vibes.',
        prompt:
          'Use the timeline to compare eras — which claims need a second source?',
        sheetTab: 'timeline',
      },
      {
        id: 'sr-3',
        title: 'A western terminus',
        entityId: 'terris-place-rome',
        mode: 'earth',
        goal: 'Connect Afro-Eurasian exchange to a concrete city.',
        prompt:
          'From Rome, open Related — how does Terris keep “far trade” tied to place?',
        year: 100,
        sheetTab: 'related',
      },
      {
        id: 'sr-4',
        title: 'Maps and imagination',
        entityId: 'terris-empire-silk-road',
        mode: 'earth',
        goal: 'Read map media critically.',
        prompt:
          'In Media, compare schematic maps to interpretive stills — what is modeled vs photographed?',
        sheetTab: 'media',
        mediaFocus: 'Schematic vs interpretive.',
      },
    ],
  },
  {
    id: 'pathway-earth-to-solar-system',
    title: 'Earth to the Solar System',
    description:
      'Pull back from a familiar city to planets, moons, and galaxies — one continuous zoom of curiosity.',
    ageRange: 'all',
    mode: 'earth',
    theme: 'science',
    estimatedDuration: '30–45 min',
    steps: [
      {
        id: 'e2s-1',
        title: 'Ground truth',
        entityId: BOSTON_HUB_ID,
        mode: 'earth',
        goal: 'Start where human senses already work.',
        prompt:
          'Earth mode: use the globe and sheet together — this is your calibration point.',
        sheetTab: 'overview',
      },
      {
        id: 'e2s-2',
        title: 'Next world out',
        entityId: 'terris-planet-mars',
        mode: 'planetary',
        goal: 'Feel the mode switch as a change of questions.',
        prompt:
          'Planetary scale drops street addresses — what replaces them?',
        sheetTab: 'overview',
      },
      {
        id: 'e2s-3',
        title: 'Another ocean',
        entityId: 'terris-moon-europa',
        mode: 'planetary',
        goal: 'Contrast icy moon geology with Mars rock.',
        prompt:
          'Note how summaries change tone when water hides under ice.',
        sheetTab: 'facts',
      },
      {
        id: 'e2s-4',
        title: 'Home galaxy',
        entityId: 'terris-galaxy-milky-way',
        mode: 'cosmic',
        goal: 'Situate the solar system inside the Milky Way.',
        prompt:
          'Cosmic mode is sparse on purpose — read slowly; let scale feel big.',
        sheetTab: 'overview',
      },
      {
        id: 'e2s-5',
        title: 'Neighbor galaxy',
        entityId: 'terris-galaxy-andromeda',
        mode: 'cosmic',
        goal: 'End with a future encounter, not a quiz.',
        prompt:
          'Optional: compare Andromeda’s facts to the Milky Way — what patterns repeat?',
        sheetTab: 'facts',
      },
    ],
  },
]

const byId = new Map(SEED_LEARNING_PATHWAYS.map((p) => [p.id, p]))

export function getPathwayById(id: string): LearningPathway | undefined {
  return byId.get(id)
}

export function listLearningPathways(): LearningPathway[] {
  return [...SEED_LEARNING_PATHWAYS]
}
