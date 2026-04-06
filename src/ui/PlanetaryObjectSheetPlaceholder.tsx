/**
 * Reserved slot for future planet / body detail sheets in planetary mode.
 */
export function PlanetaryObjectSheetPlaceholder() {
  return (
    <aside
      className="terris-planetary-sheet-placeholder"
      role="complementary"
      aria-label="Body details"
    >
      <div className="terris-planetary-sheet-placeholder__inner">
        <p className="terris-planetary-sheet-placeholder__eyebrow">Selection</p>
        <p className="terris-planetary-sheet-placeholder__title">Planetary details</p>
        <p className="terris-planetary-sheet-placeholder__body">
          Orbits, missions, and surface context will appear here.
        </p>
      </div>
    </aside>
  )
}
