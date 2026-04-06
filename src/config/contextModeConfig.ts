import type {
  AgeRange,
  ContentDepth,
  ContextMode,
  ReadingLevel,
  TeacherGuideState,
} from '@/state/educationalContextTypes'
import type { PlaceSheetTabId } from '@/ui/placeSheetTypes'

const ALL_TABS: PlaceSheetTabId[] = [
  'overview',
  'timeline',
  'facts',
  'media',
  'related',
  'nearby',
  'reconstruction',
]

const STANDARD_QUICK_TABS: PlaceSheetTabId[] = ['overview', 'related', 'nearby']

const FAMILY_STANDARD_TABS: PlaceSheetTabId[] = [
  'overview',
  'timeline',
  'facts',
  'media',
  'related',
  'nearby',
]

export type ContextModeProfile = {
  label: string
  description: string
  defaultReadingLevel: ReadingLevel
  defaultAgeRange: AgeRange | null
  defaultContentDepth: ContentDepth
  defaultLockedNavigation: boolean
  /** When true, hide Kind / Mode / Coarse coords in entity metadata by default. */
  metadataCompact: boolean
  /** Tabs shown at each depth (falls back to standard / deep). */
  placeSheetTabs: {
    quick: PlaceSheetTabId[]
    standard: PlaceSheetTabId[]
    deep: PlaceSheetTabId[]
  }
  /** Search bar first-line hint (Earth scale; planetary/cosmic follow placeholders). */
  searchBarHint: string
  /** Empty place sheet copy. */
  emptyPlaceTeaser: string
  /** Suggested journey label (family). */
  familyJourneyTeaser: string
}

export const CONTEXT_MODE_PROFILES: Record<ContextMode, ContextModeProfile> = {
  standard: {
    label: 'Standard',
    description: 'Full Terris exploration for individual learners.',
    defaultReadingLevel: 'adult',
    defaultAgeRange: null,
    defaultContentDepth: 'standard',
    defaultLockedNavigation: false,
    metadataCompact: false,
    placeSheetTabs: {
      quick: STANDARD_QUICK_TABS,
      standard: ALL_TABS,
      deep: ALL_TABS,
    },
    searchBarHint: 'Search places, people, worlds…',
    emptyPlaceTeaser:
      'Choose a marker or search result to open a multimedia atlas dossier—sources, timeline, and interpretive views.',
    familyJourneyTeaser: '',
  },
  teacher: {
    label: 'Teacher',
    description: 'Presentation-friendly layout with goals, prompts, and pacing.',
    defaultReadingLevel: 'adult',
    defaultAgeRange: null,
    defaultContentDepth: 'standard',
    defaultLockedNavigation: false,
    metadataCompact: false,
    placeSheetTabs: {
      quick: ['overview', 'timeline', 'related'],
      standard: ALL_TABS,
      deep: ALL_TABS,
    },
    searchBarHint: 'Jump to a topic for your class…',
    emptyPlaceTeaser:
      'Pick a place or topic to project—timeline, media, and discussion prompts stay readable at a distance.',
    familyJourneyTeaser: '',
  },
  family: {
    label: 'Family',
    description: 'Warmer language, gentler density, and short journeys.',
    defaultReadingLevel: 'middle',
    defaultAgeRange: { min: 6, max: 14 },
    defaultContentDepth: 'quick',
    defaultLockedNavigation: false,
    metadataCompact: true,
    placeSheetTabs: {
      quick: ['overview', 'related', 'nearby'],
      standard: FAMILY_STANDARD_TABS,
      deep: ALL_TABS,
    },
    searchBarHint: 'Find something fun to explore together…',
    emptyPlaceTeaser:
      'Tap the map or search together—stories are short, pictures first, and you can always go deeper.',
    familyJourneyTeaser: 'Try: Boston → Fenway Park → Old State House',
  },
  kiosk: {
    label: 'Exhibit',
    description: 'Touch-first, large targets, reduced chrome, idle attract.',
    defaultReadingLevel: 'adult',
    defaultAgeRange: null,
    defaultContentDepth: 'quick',
    defaultLockedNavigation: true,
    metadataCompact: true,
    placeSheetTabs: {
      quick: ['overview', 'media', 'related'],
      standard: ['overview', 'timeline', 'facts', 'media', 'related'],
      deep: ALL_TABS,
    },
    searchBarHint: 'Tap to search the exhibit…',
    emptyPlaceTeaser:
      'Touch the globe or search to begin—stories are sized for shared screens and quick reads.',
    familyJourneyTeaser: '',
  },
}

export const DEFAULT_TEACHER_GUIDE: TeacherGuideState = {
  learningObjective: 'Compare how place and protest shaped the American Revolution.',
  discussionPrompt: 'What would change if this event happened in a different harbor city?',
  anchorEntityId: null,
  anchorYear: null,
  pathwayStepIndex: 0,
  /** Sample pacing scaffold — advance with “Next step” in the teacher strip. */
  pathwayTotalSteps: 3,
}

export function resolvePlaceSheetTabs(
  mode: ContextMode,
  depth: ContentDepth,
): PlaceSheetTabId[] {
  const p = CONTEXT_MODE_PROFILES[mode]
  const { quick, standard, deep } = p.placeSheetTabs
  if (depth === 'quick') return quick
  if (depth === 'standard') return standard
  return deep
}

export function applyContextModeDefaults(mode: ContextMode): {
  readingLevel: ReadingLevel
  ageRange: AgeRange | null
  contentDepth: ContentDepth
  lockedNavigation: boolean
} {
  const p = CONTEXT_MODE_PROFILES[mode]
  return {
    readingLevel: p.defaultReadingLevel,
    ageRange: p.defaultAgeRange,
    contentDepth: p.defaultContentDepth,
    lockedNavigation: p.defaultLockedNavigation,
  }
}
