import { useCallback, useId, useMemo, useState } from 'react'
import { Button } from '@base-ui/react/button'
import { Dialog } from '@base-ui/react/dialog'
import { getMockEntityById } from '@/data/services/entityService'
import { getPathwayById } from '@/data/learning/seedPathways'
import { useExploreScaleStore } from '@/state/exploreScaleStore'
import { useLearningJournalStore } from '@/state/useLearningJournalStore'
import { useTerrisStore } from '@/state/useTerrisStore'

export function ContinueLearningBanner() {
  const uid = useId()
  const [open, setOpen] = useState(false)

  const hydrated = useLearningJournalStore((s) => s.hydrated)
  const persistenceAvailable = useLearningJournalStore((s) => s.persistenceAvailable)
  const session = useLearningJournalStore((s) => s.session)
  const recentEntityIds = useLearningJournalStore((s) => s.recentEntityIds)
  const bookmarkedEntityIds = useLearningJournalStore((s) => s.bookmarkedEntityIds)
  const savedPathwayIds = useLearningJournalStore((s) => s.savedPathwayIds)
  const collections = useLearningJournalStore((s) => s.collections)

  const setYear = useTerrisStore((s) => s.setYear)
  const enterPlaceDetail = useTerrisStore((s) => s.enterPlaceDetail)
  const restoreGuidedPathway = useTerrisStore((s) => s.restoreGuidedPathway)
  const setExploreMode = useExploreScaleStore((s) => s.setMode)

  const resumeLabel = useMemo(() => {
    const eid = session.lastEntityId
    if (!eid) return null
    const e = getMockEntityById(eid)
    return e?.name ?? eid
  }, [session.lastEntityId])

  const onResume = useCallback(() => {
    const { lastEntityId, lastPathwayId, lastPathwayStepIndex, lastMode, lastYear } = session
    if (!lastEntityId) return
    const entity = getMockEntityById(lastEntityId)
    if (!entity) return
    if (lastPathwayId && getPathwayById(lastPathwayId)) {
      setExploreMode(lastMode)
      setYear(lastYear)
      restoreGuidedPathway(lastPathwayId, lastPathwayStepIndex)
      return
    }
    setExploreMode(lastMode)
    setYear(lastYear)
    enterPlaceDetail(entity)
  }, [enterPlaceDetail, restoreGuidedPathway, session, setExploreMode, setYear])

  const onOpenEntity = useCallback(
    (entityId: string) => {
      const e = getMockEntityById(entityId)
      if (!e) return
      setExploreMode(e.mode)
      enterPlaceDetail(e)
      setOpen(false)
    },
    [enterPlaceDetail, setExploreMode],
  )

  if (!hydrated) return null

  return (
    <div className="terris-continue-learning">
      <div className="terris-continue-learning__row">
        {resumeLabel ? (
          <Button type="button" className="terris-continue-learning__resume" onClick={onResume}>
            Continue with <strong>{resumeLabel}</strong>
          </Button>
        ) : (
          <span className="terris-continue-learning__idle">Pick a place or journey to begin.</span>
        )}
        <Button
          type="button"
          className="terris-continue-learning__log-btn"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls={`${uid}-journal-dialog`}
        >
          Exploration log
        </Button>
        {!persistenceAvailable ? (
          <span className="terris-continue-learning__warn" title="Storage unavailable">
            In-memory only
          </span>
        ) : null}
      </div>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="terris-search-dialog-backdrop" />
          <Dialog.Viewport className="terris-search-dialog-viewport">
            <Dialog.Popup
              className="terris-journal-dialog panel"
              id={`${uid}-journal-dialog`}
              initialFocus={undefined}
            >
              <Dialog.Title className="terris-journal-dialog__title">Exploration log</Dialog.Title>
              <p className="terris-journal-dialog__lede">
                Recent stops, saved places, and journeys — like a field journal, not a gradebook.
              </p>

              <section className="terris-journal-dialog__section">
                <h3 className="terris-journal-dialog__h">Recently opened</h3>
                {recentEntityIds.length === 0 ? (
                  <p className="terris-journal-dialog__empty">Nothing here yet.</p>
                ) : (
                  <ul className="terris-journal-dialog__list">
                    {recentEntityIds.slice(0, 12).map((id) => {
                      const e = getMockEntityById(id)
                      return (
                        <li key={id}>
                          <button
                            type="button"
                            className="terris-journal-dialog__link"
                            onClick={() => onOpenEntity(id)}
                          >
                            {e?.name ?? id}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>

              <section className="terris-journal-dialog__section">
                <h3 className="terris-journal-dialog__h">Saved places</h3>
                {bookmarkedEntityIds.length === 0 ? (
                  <p className="terris-journal-dialog__empty">Use “Save” on a place sheet.</p>
                ) : (
                  <ul className="terris-journal-dialog__list">
                    {bookmarkedEntityIds.map((id) => {
                      const e = getMockEntityById(id)
                      return (
                        <li key={id}>
                          <button
                            type="button"
                            className="terris-journal-dialog__link"
                            onClick={() => onOpenEntity(id)}
                          >
                            {e?.name ?? id}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>

              <section className="terris-journal-dialog__section">
                <h3 className="terris-journal-dialog__h">Saved journeys</h3>
                {savedPathwayIds.length === 0 ? (
                  <p className="terris-journal-dialog__empty">Star a pathway from the journey picker.</p>
                ) : (
                  <ul className="terris-journal-dialog__list">
                    {savedPathwayIds.map((pid) => {
                      const p = getPathwayById(pid)
                      return (
                        <li key={pid}>
                          <span className="terris-journal-dialog__static">{p?.title ?? pid}</span>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>

              <section className="terris-journal-dialog__section">
                <h3 className="terris-journal-dialog__h">Collections</h3>
                <ul className="terris-journal-dialog__collections">
                  {collections.map((c) => (
                    <li key={c.id}>
                      <span className="terris-journal-dialog__static">{c.name}</span>
                      <span className="terris-journal-dialog__meta">
                        {c.entityIds.length} places · {c.pathwayIds.length} journeys
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <Button
                type="button"
                className="terris-journal-dialog__close"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
