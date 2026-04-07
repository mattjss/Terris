import type OpenAI from 'openai'
import { eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { entitiesTable } from '../db/schema.js'
import { TERRIS_CHAT_MODEL } from './constants.js'
import {
  TERRIS_SYSTEM_ATLAS_ASSISTANT,
  terrisUserSummarize,
} from './prompts.js'

export type SummarizeBody = {
  entityId?: string
  year?: number
  q?: string
}

export async function runAtlasSummarize(
  openai: OpenAI,
  body: SummarizeBody,
): Promise<{ text: string; disclaimer: string }> {
  let context = ''
  if (body.entityId) {
    const row = await db
      .select()
      .from(entitiesTable)
      .where(eq(entitiesTable.id, body.entityId))
      .limit(1)
    if (row[0]) {
      context = JSON.stringify(row[0].payload)
    }
  }

  const completion = await openai.chat.completions.create({
    model: TERRIS_CHAT_MODEL,
    temperature: 0.3,
    messages: [
      { role: 'system', content: TERRIS_SYSTEM_ATLAS_ASSISTANT },
      {
        role: 'user',
        content: terrisUserSummarize({
          year: body.year,
          entityJson: context,
          question: body.q?.trim() || 'Summarize this place or era.',
        }),
      },
    ],
  })

  const text = completion.choices[0]?.message?.content ?? ''
  return { text, disclaimer: 'Generated — verify with sources.' }
}
