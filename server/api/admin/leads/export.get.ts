import { quoteUndecidedLabels } from '#shared/quote-content'
export default defineEventHandler(async (event) => {
  const escape = (value: unknown) =>
    '"' +
    String(value ?? '')
      .replace(/^(?:\s*[=+\-@]|[\t\r\n])/, "'$&")
      .replaceAll('"', '""') +
    '"'
  const rows = (await allLeads()).map((l) =>
    [
      l.createdAt,
      l.name,
      l.email,
      l.phone,
      l.company,
      l.city || '',
      l.originPage || '',
      l.source,
      l.status,
      l.quote?.total || '',
      l.quote?.monthly || '',
      l.message,
      l.notes,
      (l.brief?.undecided || []).map((id) => quoteUndecidedLabels[id] || id).join(', '),
      (l.quote?.selections || []).map((s) => s.label + ': ' + s.value).join(' | '),
      l.quote?.requiresIndividual ? 'Wycena indywidualna; podana kwota jest początkowa' : '',
    ]
      .map(escape)
      .join(';'),
  )
  setHeader(event, 'Content-Type', 'text/csv; charset=utf-8')
  setHeader(event, 'Content-Disposition', 'attachment; filename="makoto-zgloszenia.csv"')
  return (
    '\uFEFFData;Imię;Email;Telefon;Firma;Miasto;Strona zgłoszenia;Źródło;Status;Wycena netto;Miesięcznie netto;Wiadomość;Notatki;Do omówienia;Konfiguracja zakresu;Uwagi do kwoty\r\n' +
    rows.join('\r\n')
  )
})
