import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  serializeJsonLd,
  indexingEnabled,
  siteOrigin,
  knownRedirects,
  xmlEscape,
} from '../shared/seo.ts'
import { locations } from '../shared/locations.ts'
test('JSON-LD cannot close a script tag through editable settings', () => {
  const value = { name: '</script><script>alert(1)</script>&\u2028' }
  const serialized = serializeJsonLd(value)
  assert.doesNotMatch(serialized, /<|>|&/)
  assert.deepEqual(JSON.parse(serialized), value)
})
test('indexing is explicitly enabled and origins are normalized', () => {
  assert.equal(indexingEnabled(false), false)
  assert.equal(indexingEnabled('false'), false)
  assert.equal(indexingEnabled('true'), true)
  assert.equal(siteOrigin('https://makoto.com.pl/'), 'https://makoto.com.pl')
})
test('five city pages contain independently written briefs and substantial content', () => {
  assert.equal(locations.length, 5)
  assert.equal(new Set(locations.map((c) => c.title)).size, 5)
  assert.equal(new Set(locations.map((c) => c.description)).size, 5)
  const texts = locations.map((c) =>
    [
      c.lead,
      ...c.introduction,
      ...c.sections.flatMap((s) => [s.title, ...s.paragraphs, ...(s.items || [])]),
      ...c.brief,
      ...c.faq.flat(),
    ].join(' '),
  )
  for (const text of texts) assert.ok(text.split(/\s+/).length >= 400)
  const shingles = (text) => {
    const words = text.toLowerCase().split(/\s+/)
    return new Set(words.slice(0, -5).map((_, i) => words.slice(i, i + 5).join(' ')))
  }
  for (let i = 0; i < texts.length; i++)
    for (let j = i + 1; j < texts.length; j++) {
      const a = shingles(texts[i]),
        b = shingles(texts[j]),
        shared = [...a].filter((s) => b.has(s)).length
      assert.ok(shared / Math.min(a.size, b.size) < 0.25, 'City pages share too many passages')
    }
})
test('legacy service pages have exact relevant replacements', () => {
  assert.equal(knownRedirects['/pl/strony-internetowe'], '/uslugi/strony-internetowe')
  assert.equal(knownRedirects['/technical-seo'], '/uslugi/seo-techniczne')
  assert.equal(knownRedirects['/contact'], '/kontakt')
})
test('XML escapes all reserved characters', () =>
  assert.equal(xmlEscape('a<&>"\''), 'a&lt;&amp;&gt;&quot;&apos;'))
