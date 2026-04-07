import {
  createContext,
  useContext,
  type KeyboardEvent,
  type ReactNode,
} from 'react'

type TabsCtx = {
  value: string
  setValue: (v: string) => void
  panelPrefix: string
}

const TabsContext = createContext<TabsCtx | null>(null)

export function TerrisTabsRoot({
  value,
  onValueChange,
  className,
  panelPrefix,
  children,
}: {
  value: string
  onValueChange: (v: string) => void
  className?: string
  panelPrefix: string
  children: ReactNode
}) {
  return (
    <TabsContext.Provider value={{ value, setValue: onValueChange, panelPrefix }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TerrisTabsList({
  className,
  'aria-label': ariaLabel,
  children,
}: {
  className?: string
  'aria-label'?: string
  children: ReactNode
}) {
  const ctx = useContext(TabsContext)

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!ctx) return
    const tabs = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
    )
    if (tabs.length === 0) return
    const i = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true')
    const cur = i >= 0 ? i : 0
    let next = cur
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (cur + 1) % tabs.length
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
      next = (cur - 1 + tabs.length) % tabs.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = tabs.length - 1
    else return
    e.preventDefault()
    const v = tabs[next].dataset.tabValue
    if (v) ctx.setValue(v)
    tabs[next].focus()
  }

  return (
    <div role="tablist" aria-label={ariaLabel} className={className} onKeyDown={onKeyDown}>
      {children}
    </div>
  )
}

export function TerrisTabsTab({
  value,
  id,
  className,
  children,
}: {
  value: string
  id: string
  className?: string
  children: ReactNode
}) {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('TerrisTabsTab must be inside TerrisTabsRoot')
  const selected = ctx.value === value
  const panelId = `${ctx.panelPrefix}-${value}`
  return (
    <button
      type="button"
      role="tab"
      id={id}
      data-tab-value={value}
      aria-selected={selected}
      aria-controls={panelId}
      tabIndex={selected ? 0 : -1}
      className={className}
      onClick={() => ctx.setValue(value)}
    >
      {children}
    </button>
  )
}

export function TerrisTabsPanel({
  value,
  id,
  tabId,
  className,
  children,
}: {
  value: string
  id: string
  tabId: string
  className?: string
  children: ReactNode
}) {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('TerrisTabsPanel must be inside TerrisTabsRoot')
  const selected = ctx.value === value
  return (
    <div
      role="tabpanel"
      id={id}
      aria-labelledby={tabId}
      hidden={!selected}
      className={className}
      tabIndex={0}
    >
      {children}
    </div>
  )
}
