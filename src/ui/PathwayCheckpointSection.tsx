import { useEffect, useId, useState } from 'react'
import { checkpointKey } from '@/state/learningJournalTypes'
import { useLearningJournalStore } from '@/state/useLearningJournalStore'

type PathwayCheckpointSectionProps = {
  pathwayId: string
  stepId: string
  /** Shown as context — usually the step prompt */
  promptEcho: string
}

/**
 * Lightweight reflection — not a quiz; saved locally with the pathway step.
 */
export function PathwayCheckpointSection({
  pathwayId,
  stepId,
  promptEcho,
}: PathwayCheckpointSectionProps) {
  const uid = useId()
  const setPathwayCheckpoint = useLearningJournalStore((s) => s.setPathwayCheckpoint)

  const [reflection, setReflection] = useState('')
  const [whatLearned, setWhatLearned] = useState('')

  useEffect(() => {
    const k = checkpointKey(pathwayId, stepId)
    const entry = useLearningJournalStore.getState().checkpointsByKey[k]
    setReflection(entry?.reflection ?? '')
    setWhatLearned(entry?.whatLearned ?? '')
  }, [pathwayId, stepId])

  const persist = () => {
    setPathwayCheckpoint(pathwayId, stepId, promptEcho, {
      reflection,
      whatLearned,
    })
  }

  return (
    <div className="terris-pathway-checkpoint">
      <h4 className="terris-pathway-checkpoint__title">Checkpoint</h4>
      <p className="terris-pathway-checkpoint__prompt">{promptEcho}</p>
      <label className="terris-pathway-checkpoint__label" htmlFor={`${uid}-refl`}>
        A quick reflection (optional)
      </label>
      <textarea
        id={`${uid}-refl`}
        className="terris-pathway-checkpoint__textarea"
        rows={2}
        placeholder="What stood out to you here?"
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
        onBlur={persist}
      />
      <label className="terris-pathway-checkpoint__label" htmlFor={`${uid}-learn`}>
        What did you learn? (optional)
      </label>
      <textarea
        id={`${uid}-learn`}
        className="terris-pathway-checkpoint__textarea"
        rows={2}
        placeholder="One sentence is enough."
        value={whatLearned}
        onChange={(e) => setWhatLearned(e.target.value)}
        onBlur={persist}
      />
      <button type="button" className="terris-pathway-checkpoint__save" onClick={persist}>
        Save note
      </button>
    </div>
  )
}
