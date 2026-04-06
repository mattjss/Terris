import type { PersistenceAdapter, PersistenceLoadResult } from '@/persistence/persistenceAdapter'
import type { LearningJournalBlobV1 } from '@/persistence/learningJournalBlob'
import { mergeLearningJournalBlob } from '@/persistence/learningJournalBlob'

const KEY = 'terris.learningJournal.v1'

export function createLocalStorageLearningJournalAdapter(): PersistenceAdapter<LearningJournalBlobV1> {
  return {
    name: 'localStorage',
    load(): PersistenceLoadResult<LearningJournalBlobV1> {
      if (typeof localStorage === 'undefined') {
        return { ok: false, reason: 'unavailable' }
      }
      try {
        const raw = localStorage.getItem(KEY)
        if (raw === null || raw === '') return { ok: false, reason: 'empty' }
        const parsed = JSON.parse(raw) as unknown
        if (!parsed || typeof parsed !== 'object') return { ok: false, reason: 'corrupt' }
        const data = mergeLearningJournalBlob(parsed as Partial<LearningJournalBlobV1>)
        return { ok: true, data }
      } catch {
        return { ok: false, reason: 'corrupt' }
      }
    },
    save(data: LearningJournalBlobV1) {
      if (typeof localStorage === 'undefined') return
      try {
        localStorage.setItem(KEY, JSON.stringify(data))
      } catch {
        /* quota, private mode, etc. */
      }
    },
    clear() {
      if (typeof localStorage === 'undefined') return
      try {
        localStorage.removeItem(KEY)
      } catch {
        /* ignore */
      }
    },
  }
}
