import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { getMockEntityById } from '@/data/services/entityService'
import { getPathwayById, listLearningPathways } from '@/data/learning/seedPathways'
import { useExploreScaleStore } from '@/state/exploreScaleStore'
import { useLearningJournalStore } from '@/state/useLearningJournalStore'
import { useTerrisStore } from '@/state/useTerrisStore'
import { CompactContinueExploring } from '@/ui/EntityRecommendations'
import { PathwayCheckpointSection } from '@/ui/PathwayCheckpointSection'

function themeLabel(theme: string): string {
  switch (theme) {
    case 'history':
      return 'History'
    case 'geography':
      return 'Geography'
    case 'science':
      return 'Science'
    case 'culture':
      return 'Culture'
    case 'space':
      return 'Space'
    default:
      return theme
  }
}

export function GuidedPathwayDock() {
  const uid = useId()
  const pathwayId = useTerrisStore((s) => s.guidedPathwayId)
  const stepIndex = useTerrisStore((s) => s.guidedStepIndex)
  const startGuidedPathway = useTerrisStore((s) => s.startGuidedPathway)
  const exitGuidedMode = useTerrisStore((s) => s.exitGuidedMode)
  const selectedEntity = useTerrisStore((s) => s.selectedEntity)
  const enterPlaceDetail = useTerrisStore((s) => s.enterPlaceDetail)
  const setExploreMode = useExploreScaleStore((s) => s.setMode)
  const goToGuidedStep = useTerrisStore((s) => s.goToGuidedStep)
  const advanceGuidedStep = useTerrisStore((s) => s.advanceGuidedStep)
  const previousGuidedStep = useTerrisStore((s) => s.previousGuidedStep)

  const [open, setOpen] = useState(false)
  const [showAllSteps, setShowAllSteps] = useState(false)

  const pathway = pathwayId ? getPathwayById(pathwayId) : undefined
  const step = pathway?.steps[stepIndex]
  const total = pathway?.steps.length ?? 0

  const progressLine = useMemo(() => {
    if (!total) return 0
    return ((stepIndex + 1) / total) * 100
  }, [stepIndex, total])

  const onStart = useCallback(
    (id: string) => {
      startGuidedPathway(id)
      setOpen(true)
      setShowAllSteps(false)
    },
    [startGuidedPathway],
  )

  const onLeave = useCallback(() => {
    exitGuidedMode()
    setShowAllSteps(false)
  }, [exitGuidedMode])

  const onOpenRecEntity = useCallback(
    (entityId: string) => {
      const next = getMockEntityById(entityId)
      if (next) {
        setExploreMode(next.mode)
        enterPlaceDetail(next)
      }
    },
    [enterPlaceDetail, setExploreMode],
  )

  const pathways = useMemo(() => listLearningPathways(), [])

  const savedPathwayIds = useLearningJournalStore((s) => s.savedPathwayIds)
  const toggleSavedPathway = useLearningJournalStore((s) => s.toggleSavedPathway)
  const pathwayNotes = useLearningJournalStore((s) => s.pathwayNotes)
  const setPathwayNote = useLearningJournalStore((s) => s.setPathwayNote)

  const [pathwayJournalDraft, setPathwayJournalDraft] = useState('')
  useEffect(() => {
    if (!pathwayId) return
    setPathwayJournalDraft(pathwayNotes[pathwayId]?.text ?? '')
  }, [pathwayId, pathwayNotes])

  return (
    <div className="terris-guided-dock">
      <div className="terris-guided-dock__header">
        <button
          type="button"
          className="terris-guided-dock__eyebrow-btn"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={`${uid}-guided-panel`}
        >
          <span className="terris-guided-dock__eyebrow">Learning journeys</span>
          <span className="terris-guided-dock__chevron" aria-hidden>
            {open ? '▾' : '▸'}
          </span>
        </button>
        {pathway ? (
          <>
            <span className="terris-guided-dock__pathway-pill" title={pathway.description}>
              {pathway.title}
            </span>
            <button
              type="button"
              className={
                'terris-guided-dock__pathway-star' +
                (savedPathwayIds.includes(pathway.id) ? ' terris-guided-dock__pathway-star--on' : '')
              }
              onClick={() => toggleSavedPathway(pathway.id)}
              aria-pressed={savedPathwayIds.includes(pathway.id)}
              aria-label="Save this journey"
            >
              {savedPathwayIds.includes(pathway.id) ? (
                <BookmarkCheck className="size-4" aria-hidden />
              ) : (
                <Bookmark className="size-4" aria-hidden />
              )}
            </button>
          </>
        ) : null}
      </div>

      {open ? (
        <div
          id={`${uid}-guided-panel`}
          className="terris-guided-dock__panel terris-surface"
          role="region"
          aria-label="Guided learning"
        >
          {!pathway ? (
            <div className="terris-guided-dock__picker">
              <p className="terris-guided-dock__intro">
                Curated paths through the atlas — you can leave anytime and keep exploring freely.
              </p>
              <ul className="terris-guided-dock__pathway-list">
                {pathways.map((p) => (
                  <li key={p.id} className="terris-guided-dock__pathway-card">
                    <div className="terris-guided-dock__pathway-card-head">
                      <span className="terris-guided-dock__pathway-title">{p.title}</span>
                      <span className="terris-guided-dock__pathway-meta">
                        {themeLabel(p.theme)} · {p.estimatedDuration}
                      </span>
                    </div>
                    <p className="terris-guided-dock__pathway-desc">{p.description}</p>
                    <div className="terris-guided-dock__pathway-actions">
                      <button
                        type="button"
                        className="terris-guided-dock__start"
                        onClick={() => onStart(p.id)}
                      >
                        Start
                      </button>
                      <button
                        type="button"
                        className="terris-guided-dock__save-journey"
                        onClick={() => toggleSavedPathway(p.id)}
                        aria-pressed={savedPathwayIds.includes(p.id)}
                      >
                        {savedPathwayIds.includes(p.id) ? 'Saved' : 'Save journey'}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="terris-guided-dock__active">
              <p className="terris-guided-dock__support">
                Follow the prompts or wander — the map stays yours. Skip ahead or revisit whenever
                you like.
              </p>

              {pathwayId ? (
                <label className="terris-guided-dock__pathway-note">
                  <span className="terris-guided-dock__pathway-note-k">Journey note</span>
                  <textarea
                    className="terris-guided-dock__pathway-note-input"
                    rows={2}
                    placeholder="Optional note for this whole pathway…"
                    value={pathwayJournalDraft}
                    onChange={(e) => setPathwayJournalDraft(e.target.value)}
                    onBlur={() => pathwayId && setPathwayNote(pathwayId, pathwayJournalDraft)}
                  />
                </label>
              ) : null}

              <div className="terris-guided-dock__progress" aria-hidden>
                <div className="terris-guided-dock__progress-track">
                  <div
                    className="terris-guided-dock__progress-fill"
                    style={{ width: `${progressLine}%` }}
                  />
                </div>
                <p className="terris-guided-dock__progress-label">
                  Step {stepIndex + 1} of {total}
                </p>
              </div>

              {step ? (
                <div className="terris-guided-dock__step">
                  <h3 className="terris-guided-dock__step-title">{step.title}</h3>
                  <p className="terris-guided-dock__step-goal">
                    <span className="terris-guided-dock__step-goal-k">Focus</span> {step.goal}
                  </p>
                  <p className="terris-guided-dock__step-prompt">{step.prompt}</p>
                  {step.mediaFocus ? (
                    <p className="terris-guided-dock__step-media">{step.mediaFocus}</p>
                  ) : null}
                </div>
              ) : null}

              {pathway && step ? (
                <PathwayCheckpointSection
                  pathwayId={pathway.id}
                  stepId={step.id}
                  promptEcho={step.prompt}
                />
              ) : null}

              <div className="terris-guided-dock__next">
                <span className="terris-guided-dock__next-k">Next stop</span>
                <span className="terris-guided-dock__next-v">
                  {stepIndex + 1 < total
                    ? pathway.steps[stepIndex + 1]?.title ?? '—'
                    : 'End of this journey — explore freely or pick another path.'}
                </span>
              </div>

              <div className="terris-guided-dock__nav">
                <button
                  type="button"
                  className="terris-guided-dock__btn terris-guided-dock__btn--ghost"
                  onClick={() => previousGuidedStep()}
                  disabled={stepIndex <= 0}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="terris-guided-dock__btn terris-guided-dock__btn--primary"
                  onClick={() => advanceGuidedStep()}
                  disabled={stepIndex >= total - 1}
                >
                  {stepIndex >= total - 1 ? 'At last step' : 'Next step'}
                </button>
              </div>

              {selectedEntity ? (
                <CompactContinueExploring
                  entity={selectedEntity}
                  onOpenEntity={onOpenRecEntity}
                  max={2}
                />
              ) : null}

              <button
                type="button"
                className="terris-guided-dock__all-toggle"
                onClick={() => setShowAllSteps((s) => !s)}
                aria-expanded={showAllSteps}
              >
                {showAllSteps ? 'Hide all steps' : 'See all steps'}
              </button>

              {showAllSteps ? (
                <ol className="terris-guided-dock__step-jump" aria-label="Jump to step">
                  {pathway.steps.map((s, i) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        className={
                          'terris-guided-dock__jump-btn' +
                          (i === stepIndex ? ' terris-guided-dock__jump-btn--current' : '')
                        }
                        onClick={() => goToGuidedStep(i)}
                      >
                        <span className="terris-guided-dock__jump-n">{i + 1}</span>
                        {s.title}
                      </button>
                    </li>
                  ))}
                </ol>
              ) : null}

              <button type="button" className="terris-guided-dock__leave" onClick={onLeave}>
                Leave journey
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
