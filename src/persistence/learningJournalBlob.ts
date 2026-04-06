import type {
  EntityFieldNote,
  JournalCollection,
  PathwayJournalNote,
  PathwayStepCheckpoint,
  SessionSnapshot,
} from '@/state/learningJournalTypes'

/** Versioned envelope for migrations and future cloud sync */
export const LEARNING_JOURNAL_STORAGE_VERSION = 1 as const

export type LearningJournalBlobV1 = {
  version: typeof LEARNING_JOURNAL_STORAGE_VERSION
  bookmarkedEntityIds: string[]
  savedPathwayIds: string[]
  recentEntityIds: string[]
  collections: JournalCollection[]
  entityNotes: Record<string, EntityFieldNote>
  pathwayNotes: Record<string, PathwayJournalNote>
  checkpointsByKey: Record<string, PathwayStepCheckpoint>
  session: SessionSnapshot
}

export function defaultSessionSnapshot(): SessionSnapshot {
  return {
    lastEntityId: null,
    lastPathwayId: null,
    lastPathwayStepIndex: 0,
    lastMode: 'earth',
    lastYear: 100,
    updatedAt: 0,
  }
}

export function defaultLearningJournalBlob(): LearningJournalBlobV1 {
  const now = Date.now()
  return {
    version: LEARNING_JOURNAL_STORAGE_VERSION,
    bookmarkedEntityIds: [],
    savedPathwayIds: [],
    recentEntityIds: [],
    collections: defaultPresetCollections(now),
    entityNotes: {},
    pathwayNotes: {},
    checkpointsByKey: {},
    session: defaultSessionSnapshot(),
  }
}

function defaultPresetCollections(now: number): JournalCollection[] {
  const base = (id: string, name: string): JournalCollection => ({
    id,
    name,
    isPreset: true,
    entityIds: [],
    pathwayIds: [],
    createdAt: now,
    updatedAt: now,
  })
  return [
    base('col-favorites', 'Favorite places'),
    base('col-want', 'Want to explore'),
    base('col-space', 'Space discoveries'),
    base('col-ancient', 'Ancient history'),
    base('col-class', 'My class session'),
  ]
}

export function mergeLearningJournalBlob(
  partial: Partial<LearningJournalBlobV1> | null | undefined,
): LearningJournalBlobV1 {
  const d = defaultLearningJournalBlob()
  if (!partial || typeof partial !== 'object') return d
  const collections =
    partial.collections && partial.collections.length > 0
      ? partial.collections
      : d.collections
  return {
    version: LEARNING_JOURNAL_STORAGE_VERSION,
    bookmarkedEntityIds: partial.bookmarkedEntityIds ?? d.bookmarkedEntityIds,
    savedPathwayIds: partial.savedPathwayIds ?? d.savedPathwayIds,
    recentEntityIds: partial.recentEntityIds ?? d.recentEntityIds,
    collections,
    entityNotes: partial.entityNotes ?? d.entityNotes,
    pathwayNotes: partial.pathwayNotes ?? d.pathwayNotes,
    checkpointsByKey: partial.checkpointsByKey ?? d.checkpointsByKey,
    session: { ...d.session, ...partial.session },
  }
}
