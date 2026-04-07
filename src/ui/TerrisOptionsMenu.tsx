import { useId, useState } from 'react'
import { Settings } from 'lucide-react'
import {
  TerrisModalBackdrop,
  TerrisModalPanel,
  TerrisModalRoot,
  TerrisModalViewport,
} from '@/ui/primitives'
import { ContentDepthPicker } from '@/ui/ContentDepthPicker'
import { useTerrisStore } from '@/state/useTerrisStore'

export function TerrisOptionsMenu() {
  const uid = useId()
  const [open, setOpen] = useState(false)
  const bumpUserInteraction = useTerrisStore((s) => s.bumpUserInteraction)

  return (
    <>
      <button
        type="button"
        className="terris-options-trigger"
        aria-label="Settings"
        aria-expanded={open}
        aria-controls={`${uid}-options`}
        onClick={() => {
          bumpUserInteraction()
          setOpen(true)
        }}
      >
        <Settings size={16} strokeWidth={1.5} aria-hidden />
      </button>

      <TerrisModalRoot open={open} onOpenChange={setOpen}>
        <TerrisModalBackdrop className="terris-search-dialog-backdrop" />
        <TerrisModalViewport className="terris-search-dialog-viewport">
          <TerrisModalPanel
            className="terris-options-dialog terris-surface"
            id={`${uid}-options`}
          >
            <h2 className="terris-options-dialog__title">Settings</h2>

            <section className="terris-options-dialog__section">
              <h3 className="terris-options-dialog__h">Detail level</h3>
              <ContentDepthPicker />
            </section>

            <button
              type="button"
              className="terris-options-dialog__close"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </TerrisModalPanel>
        </TerrisModalViewport>
      </TerrisModalRoot>
    </>
  )
}
