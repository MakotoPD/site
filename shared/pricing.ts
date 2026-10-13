import type { QuoteInput, QuoteResult, SiteSettings } from './types'
export const quotePurposeLabels: Record<string, string> = {
  crm: 'CRM i obsługa klientów',
  automation: 'Automatyzacja pracy',
  booking: 'Rezerwacje i zapisy',
  portal: 'Panel klienta lub zespołu',
  other: 'Inny proces',
  unsure: 'Do ustalenia',
}
/** One pricing function shared by the browser and server. Prices are estimates in PLN net. */
export function calculateQuote(input: QuoteInput, settings: SiteSettings): QuoteResult {
  const project = settings.projects.find((p) => p.id === input.project)
  if (!project) throw new Error('Wybierz typ projektu.')
  const extras = [...new Set(input.extras)]
    .filter(
      (id) =>
        !(input.project === 'store' && id === 'cms') &&
        !(input.project === 'application' && ['cms', 'motion', 'identity', 'copy'].includes(id)),
    )
    .map((id) => {
      const option = settings.extras.find((o) => o.id === id)
      if (!option) throw new Error('Nieznany dodatek.')
      return { label: option.label, price: option.price }
    })
  const monthlyLines = [...new Set(input.monthly)].map((id) => {
    const option = settings.monthly.find((o) => o.id === id)
    if (!option) throw new Error('Nieznana usługa miesięczna.')
    return { label: option.label, price: option.price }
  })
  const lines = [{ label: project.label, price: project.price }, ...extras]
  const selections: { label: string; value: string }[] = []
  const individualReasons: string[] = []
  if (input.project === 'website' && input.pages > 5)
    lines.push({
      label: `Dodatkowe podstrony (${input.pages - 5})`,
      price: (input.pages - 5) * 250,
    })
  if (input.project !== 'application' && input.design && input.design !== 'unsure') {
    const design = settings.designs?.find((d) => d.id === input.design)
    if (!design) throw new Error('Nieznany wariant wyglądu.')
    selections.push({ label: 'Wygląd', value: design.label })
    if (design.price) lines.push({ label: design.label, price: design.price })
  }
  if (input.project === 'store') {
    const range = settings.productImports?.find((p) => p.id === input.productRange)
    const specialRange = ['enterprise', 'unsure'].includes(input.productRange || '')
    if (input.productRange && !range && !specialRange) throw new Error('Nieznany zakres produktów.')
    selections.push({
      label: 'Katalog produktów',
      value:
        range?.label ||
        (input.productRange === 'enterprise' ? 'Ponad 1000 produktów' : 'Do ustalenia'),
    })
    selections.push({
      label: 'Wprowadzanie produktów',
      value:
        input.productEntry === 'makoto'
          ? 'Makoto'
          : input.productEntry === 'unsure'
            ? 'Do ustalenia'
            : 'Samodzielnie przez klienta',
    })
    if (input.productEntry === 'makoto') {
      if (range) lines.push({ label: `Wprowadzenie: ${range.label}`, price: range.price })
      else
        individualReasons.push(
          'Wprowadzenie katalogu: liczba produktów i format danych do ustalenia',
        )
    }
    if (input.productRange === 'enterprise')
      individualReasons.push(
        'Sklep z ponad 1000 produktów: zakres i wydajność do indywidualnej wyceny',
      )
  }
  if (input.project === 'application') {
    individualReasons.push('Funkcje i zakres aplikacji wymagają indywidualnego ustalenia')
    if (input.appPurpose)
      selections.push({
        label: 'Cel aplikacji',
        value: quotePurposeLabels[input.appPurpose] || 'Do ustalenia',
      })
  }
  if (input.languages > 1)
    lines.push({
      label: `Dodatkowe języki (${input.languages - 1})`,
      price: (input.languages - 1) * 800,
    })
  const subtotal = lines.reduce((sum, line) => sum + line.price, 0)
  if (input.urgent)
    lines.push({ label: 'Priorytetowy termin (+25%)', price: Math.round(subtotal * 0.25) })
  return {
    total: lines.reduce((s, l) => s + l.price, 0),
    monthly: monthlyLines.reduce((s, l) => s + l.price, 0),
    lines,
    monthlyLines,
    selections,
    requiresIndividual: individualReasons.length > 0,
    individualReasons,
    weeks: input.urgent
      ? '2–3'
      : input.project === 'application'
        ? '6–10'
        : input.project === 'store'
          ? '4–6'
          : '3–5',
  }
}
