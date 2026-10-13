import { randomUUID } from 'node:crypto'
import { calculateQuote } from '#shared/pricing'
export default defineEventHandler(async (event) => {
  await rateLimit(event, 'form', 5, 15)
  const data = validate(leadSchema, await safeBody(event, 15000))
  if (data.website) return { success: true }
  if (
    data.source === 'calculator' &&
    !data.configuration &&
    !(data.brief?.goal === 'unsure' && data.brief.undecided.includes('project'))
  )
    throw createError({ statusCode: 400, statusMessage: 'Brakuje konfiguracji wyceny.' })
  let quote = null
  if (data.configuration) {
    try {
      quote = {
        ...calculateQuote(data.configuration, await getSettings()),
        configuration: data.configuration,
      }
    } catch {
      throw createError({ statusCode: 400, statusMessage: 'Nieprawidłowa konfiguracja wyceny.' })
    }
  }
  await requireTurnstile(
    event,
    data.token,
    data.source === 'calculator' ? 'quote-form' : 'contact-form',
  )
  const now = new Date().toISOString()
  const lead = {
    id: randomUUID(),
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    message: data.message,
    city: data.city,
    originPage: data.originPage,
    source: data.source,
    quote,
    brief: data.brief || null,
    status: 'new',
    notes: '',
    createdAt: now,
    updatedAt: now,
  }
  await sql('INSERT INTO leads VALUES($1,$2::jsonb,$3)', [lead.id, JSON.stringify(lead), now])
  // The lead is already stored, so a mail outage must not reject the form.
  notifyLead(lead).catch((error) =>
    console.error('Powiadomienie e-mail o zgłoszeniu nie wyszło:', error?.message || error),
  )
  setResponseStatus(event, 201)
  return { success: true, id: lead.id }
})
