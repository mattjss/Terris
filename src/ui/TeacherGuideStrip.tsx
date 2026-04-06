import { useEffect } from 'react'
import { useTerrisStore } from '@/state/useTerrisStore'
import { getMockEntityById } from '@/data/services/entityService'

/**
 * Presentation-friendly strip: objectives, prompts, anchors — teacher context only.
 */
export function TeacherGuideStrip() {
  const contextMode = useTerrisStore((s) => s.contextMode)
  const sessionGoal = useTerrisStore((s) => s.sessionGoal)
  const setSessionGoal = useTerrisStore((s) => s.setSessionGoal)
  const guide = useTerrisStore((s) => s.teacherGuide)
  const setTeacherGuide = useTerrisStore((s) => s.setTeacherGuide)
  const year = useTerrisStore((s) => s.year)
  const selectedEntity = useTerrisStore((s) => s.selectedEntity)

  useEffect(() => {
    if (contextMode !== 'teacher' || !selectedEntity) return
    setTeacherGuide({ anchorEntityId: selectedEntity.id })
  }, [contextMode, selectedEntity?.id, setTeacherGuide])

  if (contextMode !== 'teacher') return null

  const anchorEntity = guide.anchorEntityId
    ? getMockEntityById(guide.anchorEntityId)
    : null

  return (
    <div className="terris-teacher-strip" role="region" aria-label="Teaching guide">
      <div className="terris-teacher-strip__row">
        <span className="terris-teacher-strip__eyebrow">Session goal</span>
        <input
          type="text"
          className="terris-teacher-strip__input"
          value={sessionGoal ?? ''}
          onChange={(e) => setSessionGoal(e.target.value || null)}
          placeholder="e.g. Compare civic protest and imperial response"
          aria-label="Session learning goal"
        />
      </div>

      <div className="terris-teacher-strip__grid">
        <div>
          <span className="terris-teacher-strip__eyebrow">Learning objective</span>
          <p className="terris-teacher-strip__text">{guide.learningObjective}</p>
        </div>
        <div>
          <span className="terris-teacher-strip__eyebrow">Discuss</span>
          <p className="terris-teacher-strip__text">{guide.discussionPrompt}</p>
        </div>
      </div>

      <div className="terris-teacher-strip__anchors">
        <div className="terris-teacher-strip__anchor">
          <span className="terris-teacher-strip__eyebrow">Time focus</span>
          <button
            type="button"
            className="terris-teacher-strip__linkish"
            onClick={() => setTeacherGuide({ anchorYear: year })}
          >
            Use timeline year ({year})
          </button>
          {guide.anchorYear !== null ? (
            <span className="terris-teacher-strip__pill">Pinned: {guide.anchorYear}</span>
          ) : null}
        </div>
        <div className="terris-teacher-strip__anchor">
          <span className="terris-teacher-strip__eyebrow">Starting place</span>
          <span className="terris-teacher-strip__text">
            {anchorEntity ? anchorEntity.name : 'Open a place card to anchor the lesson'}
          </span>
        </div>
      </div>

      {guide.pathwayTotalSteps > 0 ? (
        <div className="terris-teacher-strip__path">
          <span className="terris-teacher-strip__eyebrow">Pathway pacing</span>
          <div className="terris-teacher-strip__path-row">
            <span className="terris-teacher-strip__text">
              Step {guide.pathwayStepIndex + 1} of {guide.pathwayTotalSteps}
            </span>
            <button
              type="button"
              className="terris-teacher-strip__step-btn"
              onClick={() => {
                const n = guide.pathwayTotalSteps
                setTeacherGuide({
                  pathwayStepIndex: (guide.pathwayStepIndex + 1) % n,
                })
              }}
            >
              Next step
            </button>
          </div>
        </div>
      ) : null}
      <p className="terris-teacher-strip__hint">
        Tip: keep this panel visible while projecting — objectives stay legible at a distance.
      </p>
    </div>
  )
}
