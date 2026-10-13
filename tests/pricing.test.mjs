import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calculateQuote } from '../shared/pricing.ts'
import { defaultSettings } from '../shared/defaults.ts'
const settings = defaultSettings
const base = { project: 'website', extras: [], monthly: [], pages: 5, languages: 1, urgent: false }
test('base website includes five pages', () =>
  assert.equal(calculateQuote(base, settings).total, 2500))
test('pages, languages, extras and priority are additive; subscriptions are separate', () => {
  const result = calculateQuote(
    { ...base, pages: 8, languages: 2, extras: ['cms'], monthly: ['care'], urgent: true },
    settings,
  )
  assert.equal(result.total, 6563)
  assert.equal(result.monthly, 250)
  assert.equal(result.lines.at(-1).price, 1313)
})
test('duplicate addons are billed once', () =>
  assert.equal(calculateQuote({ ...base, extras: ['cms', 'cms'] }, settings).total, 3700))
test('landing never bills additional pages', () =>
  assert.equal(calculateQuote({ ...base, project: 'landing', pages: 30 }, settings).total, 1400))
test('unknown project and forged addon identifiers are rejected', () => {
  assert.throws(() => calculateQuote({ ...base, project: 'forged' }, settings))
  assert.throws(() => calculateQuote({ ...base, extras: ['forged'] }, settings))
  assert.throws(() => calculateQuote({ ...base, monthly: ['forged'] }, settings))
})

test('store bills product entry and chosen design, never a page count', () => {
  const result = calculateQuote(
    {
      ...base,
      project: 'store',
      pages: 30,
      design: 'premium',
      productRange: 'medium',
      productEntry: 'makoto',
      monthly: ['care'],
    },
    settings,
  )
  assert.equal(result.total, 6550)
  assert.equal(result.monthly, 250)
  assert.equal(result.requiresIndividual, false)
  assert.ok(result.selections.some((s) => s.value === '51–200 produktów'))
  assert.ok(!result.lines.some((l) => l.label.includes('podstrony')))
})

test('self-service product entry and store CMS are included in the store base', () => {
  const result = calculateQuote(
    {
      ...base,
      project: 'store',
      extras: ['cms'],
      pages: 30,
      design: 'base',
      productRange: 'extensive',
      productEntry: 'self',
    },
    settings,
  )
  assert.equal(result.total, 5000)
})

test('an unknown import size is a partial quote, not a free import', () => {
  const result = calculateQuote(
    { ...base, project: 'store', productRange: 'unsure', productEntry: 'makoto' },
    settings,
  )
  assert.equal(result.total, 5000)
  assert.equal(result.requiresIndividual, true)
  assert.ok(result.individualReasons.length > 0)
})

test('enterprise catalog is explicitly quoted individually', () =>
  assert.equal(
    calculateQuote(
      { ...base, project: 'store', productRange: 'enterprise', productEntry: 'self' },
      settings,
    ).requiresIndividual,
    true,
  ))

test('application scope is individual and hidden website options are not billed', () => {
  const result = calculateQuote(
    {
      ...base,
      project: 'application',
      pages: 30,
      extras: ['cms', 'motion', 'identity', 'copy'],
      design: 'premium',
      appPurpose: 'crm',
    },
    settings,
  )
  assert.equal(result.total, 8000)
  assert.equal(result.requiresIndividual, true)
  assert.equal(result.selections[0].value, 'CRM i obsługa klientów')
})

test('design and product-entry surcharges use the editable settings', () => {
  const edited = structuredClone(settings)
  edited.designs.find((d) => d.id === 'premium').price = 1000
  edited.productImports.find((p) => p.id === 'medium').price = 900
  assert.equal(
    calculateQuote(
      {
        ...base,
        project: 'store',
        design: 'premium',
        productRange: 'medium',
        productEntry: 'makoto',
      },
      edited,
    ).total,
    6900,
  )
})

test('unknown design and product-range identifiers cannot change the price', () => {
  assert.throws(() => calculateQuote({ ...base, design: 'forged' }, settings))
  assert.throws(() =>
    calculateQuote(
      { ...base, project: 'store', productRange: 'forged', productEntry: 'makoto' },
      settings,
    ),
  )
})
