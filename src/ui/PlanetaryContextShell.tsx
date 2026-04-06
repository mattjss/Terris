type PlanetaryContextShellProps = {
  /** “Planetary view” vs “Galactic context”. */
  variant: 'planetary' | 'cosmic'
}

/**
 * Soft contextual control shell when Earth history rail is not primary.
 * Placeholder for future orbital / body controls — no sci-fi HUD chrome.
 */
export function PlanetaryContextShell({ variant }: PlanetaryContextShellProps) {
  const title = variant === 'cosmic' ? 'Galactic context' : 'Planetary view'
  const hint =
    variant === 'cosmic'
      ? 'Earth timeline is paused while you navigate the wider field.'
      : 'Earth timeline is paused while you explore the solar neighborhood.'

  return (
    <div className="terris-planetary-shell">
      <p className="terris-planetary-shell__eyebrow">Context</p>
      <p className="terris-planetary-shell__title">{title}</p>
      <p className="terris-planetary-shell__hint">{hint}</p>
    </div>
  )
}
