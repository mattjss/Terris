import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'

type ModalCtx = { close: () => void }

const ModalContext = createContext<ModalCtx | null>(null)

export function TerrisModalRoot({
  open,
  onOpenChange,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onOpenChange(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  if (!open) return null

  return createPortal(
    <ModalContext.Provider value={{ close: () => onOpenChange(false) }}>
      {children}
    </ModalContext.Provider>,
    document.body,
  )
}

export function TerrisModalBackdrop({ className }: { className?: string }) {
  const ctx = useContext(ModalContext)
  return (
    <div
      className={className}
      role="presentation"
      tabIndex={-1}
      onClick={() => ctx?.close()}
    />
  )
}

export function TerrisModalViewport({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={className}>{children}</div>
}

export function TerrisModalPanel({
  className,
  children,
  id,
  'aria-labelledby': ariaLabelledBy,
  'aria-label': ariaLabel,
  initialFocusRef,
}: {
  className?: string
  children: ReactNode
  id?: string
  'aria-labelledby'?: string
  'aria-label'?: string
  initialFocusRef?: RefObject<HTMLElement | null>
}) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const target =
      initialFocusRef?.current ??
      ref.current?.querySelector<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
    target?.focus({ preventScroll: true })
  }, [initialFocusRef])

  return (
    <div
      ref={ref}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </div>
  )
}
