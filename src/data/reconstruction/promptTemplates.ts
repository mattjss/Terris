/**
 * Educational prompt templates for interpretive reconstructions.
 * Copy is museum-style: specific, cautious, suitable for classroom use.
 * Replace {{placeholders}} at generation time.
 */

export type TerrisPromptTemplateId =
  | 'historical-city-scene'
  | 'landmark-era'
  | 'event-moment'
  | 'ancient-daily-life'
  | 'planetary-surface-education'

export type TerrisPromptTemplate = {
  id: TerrisPromptTemplateId
  title: string
  /** Template string with {{tokens}} for entity-specific fill-in. */
  body: string
  /** What sources should constrain the scene. */
  basisHint: string
}

export const TERRIS_PROMPT_TEMPLATES: readonly TerrisPromptTemplate[] = [
  {
    id: 'historical-city-scene',
    title: 'Historical city scene',
    body:
      'Educational wide view of {{city}} in {{period}}, showing {{landmarks}} and typical street activity. ' +
      'Neutral daylight, no modern vehicles or anachronisms. Style: clear, atlas-like, not cinematic fantasy.',
    basisHint: 'Period maps, surviving architecture, archaeological reports.',
  },
  {
    id: 'landmark-era',
    title: 'Landmark in a given era',
    body:
      'Interpretive exterior or interior of {{landmark}} as it may have appeared in {{era}}. ' +
      'Emphasize {{materials}} and scale from documented measurements where available; otherwise label as approximate.',
    basisHint: 'Measured drawings, excavation data, dated photographs of surviving fabric.',
  },
  {
    id: 'event-moment',
    title: 'Event moment',
    body:
      'Non-sensational classroom illustration of {{event}} at {{location}} on {{date_context}}. ' +
      'Focus on setting, clothing, and props consistent with {{sources}}; avoid graphic violence unless age-appropriate and noted.',
    basisHint: 'Primary accounts, court records, or standard secondary syntheses.',
  },
  {
    id: 'ancient-daily-life',
    title: 'Ancient daily life scene',
    body:
      'Calm slice-of-life scene: {{people_roles}} in {{settlement_type}} during {{period}}. ' +
      'Activities: {{activities}}. No modern objects; lighting natural; composition like a museum diorama.',
    basisHint: 'Material culture from digs, frescoes, or written descriptions (with uncertainty called out).',
  },
  {
    id: 'planetary-surface-education',
    title: 'Planetary surface (educational)',
    body:
      'Labeled educational view of {{body}} at {{feature}}: {{terrain_notes}}. ' +
      'Include scale cues or rover for size reference if appropriate. Style: science-museum panel, not sci-fi poster.',
    basisHint: 'Orbital imagery, rover photometry, peer-reviewed geology.',
  },
] as const

export function getPromptTemplateById(
  id: TerrisPromptTemplateId,
): TerrisPromptTemplate | undefined {
  return TERRIS_PROMPT_TEMPLATES.find((t) => t.id === id)
}
