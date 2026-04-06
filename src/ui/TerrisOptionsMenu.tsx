import { useId, useState } from 'react'
import { Settings2 } from 'lucide-react'
import { Button } from '@base-ui/react/button'
import { Dialog } from '@base-ui/react/dialog'
import { ContentDepthPicker } from '@/ui/ContentDepthPicker'
import { ContinueLearningBanner } from '@/ui/ContinueLearningBanner'
import { GuidedPathwayDock } from '@/ui/GuidedPathwayDock'
import { useTerrisStore } from '@/state/useTerrisStore'

/**
 * Secondary entry for reading depth, journal, and guided pathways — not primary chrome.
 */
export function TerrisOptionsMenu() {
  const uid = useId()
  const [open, setOpen] = useState(false)
  const bumpUserInteraction = useTerrisStore((s) => s.bumpUserInteraction)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        className="terris-options-trigger"
        aria-label="Terris options"
        aria-expanded={open}
        aria-controls={`${uid}-options`}
        onClick={() => {
          bumpUserInteraction()
          setOpen(true)
        }}
      >
        <Settings2 size={18} strokeWidth={1.75} aria-hidden />
        <span className="terris-options-trigger__label">Options</span>
      </Button>

      <Dialog.Portal>
        <Dialog.Backdrop className="terris-search-dialog-backdrop" />
        <Dialog.Viewport className="terris-search-dialog-viewport">
          <Dialog.Popup
            className="terris-options-dialog terris-surface"
            id={`${uid}-options`}
            initialFocus={undefined}
          >
            <Dialog.Title className="terris-options-dialog__title">Terris options</Dialog.Title>
            <p className="terris-options-dialog__lede">
              Reading depth, your exploration log, and guided journeys — when you need them.
            </p>

            <section className="terris-options-dialog__section" aria-labelledby={`${uid}-depth`}>
              <h3 id={`${uid}-depth`} className="terris-options-dialog__h">
                Reading depth
              </h3>
              <p className="terris-options-dialog__hint">
                Controls how much appears in place sheets (overview, tabs, and related links).
              </p>
              <ContentDepthPicker />
            </section>

            <section className="terris-options-dialog__section" aria-labelledby={`${uid}-journal`}>
              <h3 id={`${uid}-journal`} className="terris-options-dialog__h">
                Continue &amp; journal
              </h3>
              <ContinueLearningBanner />
            </section>

            <section className="terris-options-dialog__section" aria-labelledby={`${uid}-guided`}>
              <h3 id={`${uid}-guided`} className="terris-options-dialog__h">
                Guided pathways
              </h3>
              <GuidedPathwayDock />
            </section>

            <Button
              type="button"
              className="terris-options-dialog__close"
              onClick={() => setOpen(false)}
            >
              Done
            </Button>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
