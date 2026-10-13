import { test } from 'node:test'
import assert from 'node:assert/strict'
import { leadMail } from '../server/utils/mail.ts'
const lead = {
  name: 'Jan Kowalski',
  email: 'jan@example.com',
  phone: '',
  company: 'Firma',
  message: 'Potrzebuję strony.\nTermin: listopad.',
  city: 'Toruń',
  originPage: '/kontakt',
  source: 'contact',
  quote: null,
  brief: null,
}
test('lead notification lists the contact details and replies to the visitor', () => {
  const mail = leadMail(lead, 'https://makoto.com.pl')
  assert.equal(mail.subject, 'Nowa wiadomość — Jan Kowalski')
  assert.deepEqual(mail.replyTo, { name: 'Jan Kowalski', address: 'jan@example.com' })
  assert.match(mail.text, /E-mail: jan@example\.com/)
  assert.match(mail.text, /Potrzebuję strony\.\nTermin: listopad\./)
  assert.doesNotMatch(mail.text, /Telefon:/)
  assert.match(mail.text, /https:\/\/makoto\.com\.pl\/admin\/zgloszenia/)
})
test('visitor input cannot add mail headers; calculator leads carry the quote', () => {
  const mail = leadMail(
    {
      ...lead,
      name: 'Jan\r\nBcc: attacker@example.com',
      source: 'calculator',
      quote: { total: 2500, monthly: 250, selections: [{ label: 'Projekt', value: 'Strona' }] },
      brief: { goal: 'website', undecided: ['pages'] },
    },
    'https://makoto.com.pl',
  )
  assert.doesNotMatch(mail.subject, /[\r\n]/)
  assert.doesNotMatch(mail.replyTo.name, /[\r\n]/)
  assert.match(mail.subject, /^Nowa wycena — /)
  assert.match(mail.text, /Orientacyjna wycena: 2500 zł \+ 250 zł miesięcznie/)
  assert.match(mail.text, /- Projekt: Strona/)
  assert.match(mail.text, /Do omówienia: Liczba podstron/)
})
