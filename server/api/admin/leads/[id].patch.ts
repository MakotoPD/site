import { z } from 'zod'
export default defineEventHandler(async (event) => {
  const data = validate(
    z.object({
      status: z.enum(['new', 'contacted', 'proposal', 'won', 'closed']),
      notes: z.string().max(10000),
    }),
    await safeBody(event, 15000),
  )
  const id = getRouterParam(event, 'id')!
  const lead = (await allLeads()).find((l) => l.id === id)
  if (!lead) throw createError({ statusCode: 404, statusMessage: 'Nie znaleziono zgłoszenia.' })
  const updated = { ...lead, ...data, updatedAt: new Date().toISOString() }
  await sql('UPDATE leads SET value=$1::jsonb WHERE id::text=$2', [JSON.stringify(updated), id])
  return updated
})
