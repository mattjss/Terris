export type { PersistenceAdapter, PersistenceLoadResult } from '@/persistence/persistenceAdapter'
export {
  createLearningJournalPersistence,
  loadMergedJournal,
} from '@/persistence/createLearningJournalPersistence'
export {
  LEARNING_JOURNAL_STORAGE_VERSION,
  type LearningJournalBlobV1,
  defaultLearningJournalBlob,
  mergeLearningJournalBlob,
  defaultSessionSnapshot,
} from '@/persistence/learningJournalBlob'
export { createLocalStorageLearningJournalAdapter } from '@/persistence/localStorageAdapter'
export { createMemoryLearningJournalAdapter } from '@/persistence/memoryAdapter'
