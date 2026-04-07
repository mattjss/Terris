import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import type { TerrisEntity } from '@/data/types/terrisEntity'
import { useLearningJournalStore } from '@/state/useLearningJournalStore'

export function EntityFieldNotes({ entity }: { entity: TerrisEntity }) {
  const uid = useId()
  const noteId = `${uid}-note`

  const bookmarkedEntityIds = useLearningJournalStore((s) => s.bookmarkedEntityIds)
  const collections = useLearningJournalStore((s) => s.collections)
  const entityNotes = useLearningJournalStore((s) => s.entityNotes)
  const toggleBookmarkEntity = useLearningJournalStore((s) => s.toggleBookmarkEntity)
  const setEntityNote = useLearningJournalStore((s) => s.setEntityNote)
  const addEntityToCollection = useLearningJournalStore((s) => s.addEntityToCollection)
  const removeEntityFromCollection = useLearningJournalStore((s) => s.removeEntityFromCollection)

  const [collectionPick, setCollectionPick] = useState(() => collections[0]?.id ?? '')

  const bookmarked = bookmarkedEntityIds.includes(entity.id)
  const note = entityNotes[entity.id]

  const [draft, setDraft] = useState(note?.text ?? '')
  const committed = note?.text ?? ''

  useEffect(() => {
    const n = useLearningJournalStore.getState().entityNotes[entity.id]
    setDraft(n?.text ?? '')
  }, [entity.id])

  const onBlurSave = useCallback(() => {
    if (draft.trim() === committed.trim()) return
    setEntityNote(entity.id, draft)
  }, [committed, draft, entity.id, setEntityNote])

  const collectionsWithEntity = useMemo(
    () => collections.filter((c) => c.entityIds.includes(entity.id)),
    [collections, entity.id],
  )

  return (
    <aside className="terris-field-notes" aria-labelledby={`${noteId}-title`}>
      <div className="terris-field-notes__head">
        <h3 id={`${noteId}-title`} className="terris-field-notes__title">
          Field notes
        </h3>
        <span className="terris-field-notes__hint">
          Private to this browser — your exploration log.
        </span>
        <button
          type="button"
          className={
            'terris-field-notes__bookmark' + (bookmarked ? ' terris-field-notes__bookmark--on' : '')
          }
          onClick={() => toggleBookmarkEntity(entity.id)}
          aria-pressed={bookmarked}
          aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this place'}
        >
          {bookmarked ? (
            <BookmarkCheck className="size-4" aria-hidden />
          ) : (
            <Bookmark className="size-4" aria-hidden />
          )}
          <span>{bookmarked ? 'Saved' : 'Save'}</span>
        </button>
      </div>

      <div className="terris-field-notes__collections">
        <label className="terris-field-notes__label" htmlFor={`${noteId}-col`}>
          Add to a collection
        </label>
        <div className="terris-field-notes__collection-row">
          <select
            id={`${noteId}-col`}
            className="terris-field-notes__select"
            value={collectionPick}
            onChange={(e) => setCollectionPick(e.target.value)}
          >
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="terris-field-notes__add-btn"
            onClick={() => {
              if (!collectionPick) return
              addEntityToCollection(collectionPick, entity.id)
            }}
          >
            Add
          </button>
        </div>
        {collectionsWithEntity.length > 0 ? (
          <ul className="terris-field-notes__chips">
            {collectionsWithEntity.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className="terris-field-notes__chip"
                  onClick={() => removeEntityFromCollection(c.id, entity.id)}
                >
                  {c.name}
                  <span aria-hidden> ×</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <label className="terris-field-notes__label" htmlFor={`${noteId}-textarea`}>
        Your note
      </label>
      <textarea
        id={`${noteId}-textarea`}
        className="terris-field-notes__textarea"
        rows={3}
        placeholder="A line or two for class, curiosity, or a question to return to…"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={onBlurSave}
      />
    </aside>
  )
}
