import nodemailer from 'nodemailer'
import { quoteUndecidedLabels } from '../../shared/quote-content.ts'
import type { Lead } from '#shared/types'

type LeadMailInput = Pick<
  Lead,
  | 'name'
  | 'email'
  | 'phone'
  | 'company'
  | 'message'
  | 'city'
  | 'originPage'
  | 'source'
  | 'quote'
  | 'brief'
>
const oneLine = (value: string) => value.replace(/\s+/g, ' ').trim()

// Plain text only. Nothing typed by the visitor reaches a mail header with a line break in it.
export function leadMail(lead: LeadMailInput, site: string) {
  const calculator = lead.source === 'calculator'
  const details = [
    ['Imię', lead.name],
    ['E-mail', lead.email],
    ['Telefon', lead.phone],
    ['Firma', lead.company],
    ['Miejscowość', lead.city],
    ['Wysłano ze strony', lead.originPage],
  ].filter(([, value]) => value)
  const quote = lead.quote
    ? [
        '',
        `Orientacyjna wycena: ${lead.quote.total} zł` +
          (lead.quote.monthly ? ` + ${lead.quote.monthly} zł miesięcznie` : '') +
          (lead.quote.requiresIndividual ? ' (kwota początkowa, wycena indywidualna)' : ''),
        ...(lead.quote.selections || []).map((s) => `- ${s.label}: ${s.value}`),
      ]
    : []
  const undecided = (lead.brief?.undecided || []).map((id) => quoteUndecidedLabels[id] || id)
  return {
    subject: oneLine(`${calculator ? 'Nowa wycena' : 'Nowa wiadomość'} — ${lead.name}`),
    replyTo: { name: oneLine(lead.name), address: lead.email },
    text: [
      calculator
        ? 'Nowe zgłoszenie z kalkulatora wyceny.'
        : 'Nowa wiadomość z formularza kontaktowego.',
      '',
      ...details.map(([label, value]) => `${label}: ${value}`),
      ...quote,
      ...(undecided.length ? ['', 'Do omówienia: ' + undecided.join(', ')] : []),
      '',
      'Wiadomość:',
      lead.message,
      '',
      `Panel: ${site}/admin/zgloszenia`,
    ].join('\n'),
  }
}

let transport: ReturnType<typeof nodemailer.createTransport> | undefined
// Runs after the lead is stored. The caller ignores failures: a mail outage never rejects a form.
export async function notifyLead(lead: LeadMailInput) {
  const config = useRuntimeConfig(),
    smtp = config.smtp
  if (!smtp.host || !smtp.to) return
  transport ||= nodemailer.createTransport({
    host: smtp.host,
    port: Number(smtp.port),
    secure: Number(smtp.port) === 465,
    requireTLS: true,
    auth: { user: smtp.user, pass: smtp.password },
    connectionTimeout: 10000,
    socketTimeout: 20000,
  })
  await transport.sendMail({
    from: { name: 'Makoto — formularz', address: smtp.user },
    to: smtp.to,
    ...leadMail(lead, new URL(config.public.siteUrl).origin),
  })
}
