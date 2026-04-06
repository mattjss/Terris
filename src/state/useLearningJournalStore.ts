import { create } from 'zustand'
import type { PersistenceAdapter } from '@/persistence/persistenceAdapter'
import type { LearningJournalBlobV1 } from '@/persistence/learningJournalBlob'
import { defaultLearningJournalBlob } from '@/persistence/learningJournalBlob'
import { loadMergedJournal } from '@/persistence/createLearningJournalPersistence'
import type {
  EntityFieldNote,
  JournalCollection,
  PathwayJournalNote,
  PathwayStepCheckpoint,
  SessionSnapshot,
} from '@/state/learningJournalTypes'
import { checkpointKey } from '@/state/learningJournalTypes'

const MAX_RECENT = 30

function now() {
  return Date.now()
}

function uniq(ids: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const id of ids) {
    if (seen.has(id)) continue
    seen.add(id)
    out.push(id)
  }
  return out
}

function blobFromState(s: LearningJournalState): LearningJournalBlobV1 {
  return {
    version: 1,
    bookmarkedEntityIds: s.bookmarkedEntityIds,
    savedPathwayIds: s.savedPathwayIds,
    recentEntityIds: s.recentEntityIds,
    collections: s.collections,
    entityNotes: s.entityNotes,
    pathwayNotes: s.pathwayNotes,
    checkpointsByKey: s.checkpointsByKey,
    session: s.session,
  }
}

type LearningJournalState = {
  hydrated: boolean
  persistenceAvailable: boolean
  adapter: PersistenceAdapter<LearningJournalBlobV1> | null
  bookmarkedEntityIds: string[]
  savedPathwayIds: string[]
  recentEntityIds: string[]
  collections: JournalCollection[]
  entityNotes: Record<string, EntityFieldNote>
  pathwayNotes: Record<string, PathwayJournalNote>
  checkpointsByKey: Record<string, PathwayStepCheckpoint>
  session: SessionSnapshot
}

let saveTimer: ReturnType<typeof setTimeout> | null = null
function scheduleSave(get: () => LearningJournalStore) {
  if (saveTimer !== null) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    const state = get()
    if (!state.hydrated || !state.adapter) return
    try {
      state.adapter.save(blobFromState(state))
    } catch {
      /* adapter must not throw per contract; extra guard */
    }
  }, 450)
}

type LearningJournalStore = LearningJournalState & {
  hydrate: (
    adapter: PersistenceAdapter<LearningJournalBlobV1>,
    persistenceAvailable: boolean,
  ) => void

  toggleBookmarkEntity: (entityId: string) => void
  toggleSavedPathway: (pathwayId: string) => void
  recordRecentEntity: (entityId: string) => void

  addEntityToCollection: (collectionId: string, entityId: string) => void
  removeEntityFromCollection: (collectionId: string, entityId: string) => void
  addPathwayToCollection: (collectionId: string, pathwayId: string) => void
  removePathwayFromCollection: (collectionId: string, pathwayId: string) => void
  createCollection: (name: string) => void
  removeCollection: (collectionId: string) => void

  setEntityNote: (entityId: string, text: string) => void
  clearEntityNote: (entityId: string) => void
  setPathwayNote: (pathwayId: string, text: string) => void

  setPathwayCheckpoint: (
    pathwayId: string,
    stepId: string,
    promptEcho: string,
    patch: { reflection: string; whatLearned: string },
  ) => void

  /** Called from LearningJournalSync when exploration state changes */
  syncSessionSnapshot: (patch: Partial<SessionSnapshot>) => void
}

function applyBlobToState(blob: LearningJournalBlobV1): Partial<LearningJournalState> {
  return {
    bookmarkedEntityIds: blob.bookmarkedEntityIds,
    savedPathwayIds: blob.savedPathwayIds,
    recentEntityIds: blob.recentEntityIds,
    collections: blob.collections,
    entityNotes: blob.entityNotes,
    pathwayNotes: blob.pathwayNotes,
    checkpointsByKey: blob.checkpointsByKey,
    session: blob.session,
  }
}

export const useLearningJournalStore = create<LearningJournalStore>((set, get) => ({
  hydrated: false,
  persistenceAvailable: true,
  adapter: null,

  bookmarkedEntityIds: [],
  savedPathwayIds: [],
  recentEntityIds: [],
  collections: defaultLearningJournalBlob().collections,
  entityNotes: {},
  pathwayNotes: {},
  checkpointsByKey: {},
  session: defaultLearningJournalBlob().session,

  hydrate: (adapter, persistenceAvailable) => {
    const merged = loadMergedJournal(adapter)
    set({
      hydrated: true,
      adapter,
      persistenceAvailable,
      ...applyBlobToState(merged),
    })
  },

  toggleBookmarkEntity: (entityId) => {
    set((s) => {
      const has = s.bookmarkedEntityIds.includes(entityId)
      const bookmarkedEntityIds = has
        ? s.bookmarkedEntityIds.filter((id) => id !== entityId)
        : [...s.bookmarkedEntityIds, entityId]
      return { bookmarkedEntityIds }
    })
    scheduleSave(get)
  },

  toggleSavedPathway: (pathwayId) => {
    set((s) => {
      const has = s.savedPathwayIds.includes(pathwayId)
      const savedPathwayIds = has
        ? s.savedPathwayIds.filter((id) => id !== pathwayId)
        : [...s.savedPathwayIds, pathwayId]
      return { savedPathwayIds }
    })
    scheduleSave(get)
  },

  recordRecentEntity: (entityId) => {
    set((s) => {
      const rest = s.recentEntityIds.filter((id) => id !== entityId)
      const recentEntityIds = [entityId, ...rest].slice(0, MAX_RECENT)
      return { recentEntityIds }
    })
    scheduleSave(get)
  },

  addEntityToCollection: (collectionId, entityId) => {
    set((s) => ({
      collections: s.collections.map((c) =>
        c.id !== collectionId
          ? c
          : {
              ...c,
              entityIds: uniq([...c.entityIds, entityId]),
              updatedAt: now(),
            },
      ),
    }))
    scheduleSave(get)
  },

  removeEntityFromCollection: (collectionId, entityId) => {
    set((s) => ({
      collections: s.collections.map((c) =>
        c.id !== collectionId
          ? c
          : {
              ...c,
              entityIds: c.entityIds.filter((id) => id !== entityId),
              updatedAt: now(),
            },
      ),
    }))
    scheduleSave(get)
  },

  addPathwayToCollection: (collectionId, pathwayId) => {
    set((s) => ({
      collections: s.collections.map((c) =>
        c.id !== collectionId
          ? c
          : {
              ...c,
              pathwayIds: uniq([...c.pathwayIds, pathwayId]),
              updatedAt: now(),
            },
      ),
    }))
    scheduleSave(get)
  },

  removePathwayFromCollection: (collectionId, pathwayId) => {
    set((s) => ({
      collections: s.collections.map((c) =>
        c.id !== collectionId
          ? c
          : {
              ...c,
              pathwayIds: c.pathwayIds.filter((id) => id !== pathwayId),
              updatedAt: now(),
            },
      ),
    }))
    scheduleSave(get)
  },

  createCollection: (name) => {
    const t = now()
    const id = `col-${t}-${Math.random().toString(36).slice(2, 9)}`
    set((s) => ({
      collections: [
        ...s.collections,
        {
          id,
          name: name.trim() || 'Untitled',
          isPreset: false,
          entityIds: [],
          pathwayIds: [],
          createdAt: t,
          updatedAt: t,
        },
      ],
    }))
    scheduleSave(get)
  },

  removeCollection: (collectionId) => {
    set((s) => ({
      collections: s.collections.filter((c) => c.id !== collectionId || c.isPreset),
    }))
    scheduleSave(get)
  },

  setEntityNote: (entityId, text) => {
    const trimmed = text.trim()
    set((s) => {
      const next = { ...s.entityNotes }
      if (!trimmed) {
        delete next[entityId]
      } else {
        next[entityId] = {
          entityId,
          text: trimmed,
          updatedAt: now(),
        }
      }
      return { entityNotes: next }
    })
    scheduleSave(get)
  },

  clearEntityNote: (entityId) => {
    set((s) => {
      const next = { ...s.entityNotes }
      delete next[entityId]
      return { entityNotes: next }
    })
    scheduleSave(get)
  },

  setPathwayNote: (pathwayId, text) => {
    const trimmed = text.trim()
    set((s) => {
      const next = { ...s.pathwayNotes }
      if (!trimmed) {
        delete next[pathwayId]
      } else {
        next[pathwayId] = { pathwayId, text: trimmed, updatedAt: now() }
      }
      return { pathwayNotes: next }
    })
    scheduleSave(get)
  },

  setPathwayCheckpoint: (pathwayId, stepId, promptEcho, patch) => {
    const key = checkpointKey(pathwayId, stepId)
    const reflection = patch.reflection.trim()
    const whatLearned = patch.whatLearned.trim()
    set((s) => {
      const checkpointsByKey = { ...s.checkpointsByKey }
      if (!reflection && !whatLearned) {
        delete checkpointsByKey[key]
        return { checkpointsByKey }
      }
      checkpointsByKey[key] = {
        pathwayId,
        stepId,
        promptEcho,
        reflection: patch.reflection,
        whatLearned: patch.whatLearned,
        updatedAt: now(),
      }
      return { checkpointsByKey }
    })
    scheduleSave(get)
  },

  syncSessionSnapshot: (patch) => {
    set((s) => ({
      session: {
        ...s.session,
        ...patch,
        updatedAt: now(),
      },
    }))
    scheduleSave(get)
  },
}))

export function isEntityBookmarked(entityId: string): boolean {
  return useLearningJournalStore.getState().bookmarkedEntityIds.includes(entityId)
}
