/**
 * Pluggable persistence — localStorage today, account/API later.
 * Implementations must never throw to callers; use Result or silent fail.
 */

export type PersistenceLoadResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: 'unavailable' | 'corrupt' | 'empty' }

export interface PersistenceAdapter<T> {
  readonly name: string
  load(): PersistenceLoadResult<T>
  save(data: T): void
  clear(): void
}
