# Terris product roadmap

Living summary of what exists in the repo, what is actively evolving, and what is still out of scope or blocked.

## Implemented

- **Globe & exploration**: Three.js globe with Earth atlas, atmosphere, clouds, historical overlays, Terris POI markers, scale modes (earth → planetary → cosmic) with `ExploreScaleBridge`, orbit limits, and cinematic opacity choreography.
- **Unified domain model**: `TerrisEntity` with `mode` (`earth` | `planetary` | `cosmic`), typed kinds per scale, coords, facts, timeline, related/nearby refs, media, optional provenance (`sources`).
- **Search**: Mode-filtered command palette over unified mock catalog; grouped results by entity type; Zustand store for query, placeholder, results, selection.
- **Editorial mocks**: Boston hub, Fenway and related Boston entities, explore bodies (Rome, Mars, Europa, Voyager 1, Milky Way, Andromeda); merged `MOCK_ENTITY_CATALOG`.
- **Data clients (live-capable)**: Wikipedia REST summary, Wikidata REST + SPARQL, Wikibase REST stubs, Mapillary placeholder, Natural Earth, historical GeoJSON loaders; adapters map Wikidata → `TerrisEntity`.
- **UI shell**: Brand, mode-aware search bar, layer dock, bottom rail (time minimap ↔ planetary context), place detail sheet with tabs, responsive layout, Geist / Geist Mono typography baseline.
- **Editorial entity sheet**: Hero media strip, title + Geist Mono metadata block (place / region / country / coords / era / mode), summary lede, tabbed sections; facts as a responsive card grid; media gallery with licensing; reconstruction tab with explicit interpretive / AI banner.
- **API placeholder exports**: `wikipediaLeadImageClient`, `wikimediaCommonsClient`, `iiifClient`, `aiReconstructionClient`, `aiShortVideoClient` re-exported from `src/data/clients/index.ts` for future wiring.

## In progress

- None tracked here — open a PR to list active work.

## Next up

- Persisted user sessions and saved places (requires backend or sync story).
- Live Wikimedia Commons search + IIIF manifest ingestion into `TerrisMediaItem[]`.
- Mapillary / street-level parity with bbox queries and attribution.
- Cosmic/planetary sheet variants (orbital diagrams, mission timelines) beyond shared layout.
- Accessibility audit (focus order, reduced motion) on new sheet chrome.

## Blocked / missing

- **Rights & licensing automation**: Committed license strings in mocks; production needs per-asset clearance and CC resolver.
- **AI reconstruction**: No provider keys; placeholders only until policy + cost controls.
- **Real-time collaboration / classrooms**: Not started.
- **Mobile native**: Web-first; no Capacitor or native shell in repo.

---

*Generated from the Terris codebase; update this file when major features land.*
