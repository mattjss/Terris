import type { PersistenceAdapter } from '@/persistence/persistenceAdapter'
import type { LearningJournalBlobV1 } from '@/persistence/learningJournalBlob'
import { createLocalStorageLearningJournalAdapter } from '@/persistence/localStorageAdapter'
import { createMemoryLearningJournalAdapter } from '@/persistence/memoryAdapter'
import { mergeLearningJournalBlob } from '@/persistence/learningJournalBlob'

/**
 * Prefer localStorage; fall back to in-memory if unavailable or corrupt.
 * Callers should treat persistence as best-effort.
 */
export function createLearningJournalPersistence(): {
  adapter: PersistenceAdapter<LearningJournalBlobV1>
  persistenceAvailable: boolean
} {
  const local = createLocalStorageLearningJournalAdapter()
  const mem = createMemoryLearningJournalAdapter()
  const probe = local.load()
  if (probe.ok) {
    return { adapter: local, persistenceAvailable: true }
  }
  const memoryFallback = probe.reason === 'unavailable' || probe.reason === 'corrupt'
  if (memoryFallback) {
    return { adapter: mem, persistenceAvailable: false }
  }
  /* empty — start fresh on localStorage */
  return { adapter: local, persistenceAvailable: true }
}

export function loadMergedJournal(
  adapter: PersistenceAdapter<LearningJournalBlobV1>,
): LearningJournalBlobV1 {
  const r = adapter.load()
  if (r.ok) return mergeLearningJournalBlob(r.data)
  return mergeLearningJournalBlob(null)
}
