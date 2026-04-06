import type { ExplorerMode } from '@/data/types/terrisEntity'

/** Lightweight collection — like tabs in a field journal */
export type JournalCollection = {
  id: string
  name: string
  /** User-created vs seeded defaults */
  isPreset: boolean
  entityIds: string[]
  pathwayIds: string[]
  createdAt: number
  updatedAt: number
}

export type EntityFieldNote = {
  entityId: string
  text: string
  updatedAt: number
}

export type PathwayJournalNote = {
  pathwayId: string
  text: string
  updatedAt: number
}

/** Per-step reflection — not graded; for memory and teaching */
export type PathwayStepCheckpoint = {
  pathwayId: string
  stepId: string
  /** Short prompt shown in UI (can mirror pathway step) */
  promptEcho: string
  reflection: string
  whatLearned: string
  updatedAt: number
}

/** Persisted “where you left off” — local-first; sync-ready shape */
export type SessionSnapshot = {
  lastEntityId: string | null
  lastPathwayId: string | null
  lastPathwayStepIndex: number
  lastMode: ExplorerMode
  lastYear: number
  updatedAt: number
}

export function checkpointKey(pathwayId: string, stepId: string): string {
  return `${pathwayId}::${stepId}`
}
