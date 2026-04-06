import type { PersistenceAdapter, PersistenceLoadResult } from '@/persistence/persistenceAdapter'
import type { LearningJournalBlobV1 } from '@/persistence/learningJournalBlob'
import { mergeLearningJournalBlob } from '@/persistence/learningJournalBlob'

/** Fallback when localStorage is missing or fails — session-only memory */
export function createMemoryLearningJournalAdapter(): PersistenceAdapter<LearningJournalBlobV1> {
  let mem: LearningJournalBlobV1 | null = null
  return {
    name: 'memory',
    load(): PersistenceLoadResult<LearningJournalBlobV1> {
      if (!mem) return { ok: false, reason: 'empty' }
      return { ok: true, data: mergeLearningJournalBlob(mem) }
    },
    save(data: LearningJournalBlobV1) {
      mem = mergeLearningJournalBlob(data)
    },
    clear() {
      mem = null
    },
  }
}
