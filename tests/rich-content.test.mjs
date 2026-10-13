import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  alertTypes,
  normalizeRichDocument,
  richDocumentMarkdown,
  richText,
  safeHref,
} from '../shared/rich-content.ts'
import { markdownToDocument } from '../shared/markdown.ts'
import { renderRichDocument } from '../shared/rich-render.ts'
const paragraph = (text) => ({ type: 'paragraph', content: [{ type: 'text', text }] })
const doc = (...content) => ({ type: 'doc', content })
test('all original callout kinds survive storage, HTML and AI Markdown', () => {
  for (const kind of alertTypes) {
    const document = normalizeRichDocument(
      doc({
        type: 'callout',
        attrs: { kind, title: 'Własny nagłówek' },
        content: [paragraph('Praktyczna wskazówka dla czytelnika.')],
      }),
    )
    const html = renderRichDocument(document),
      markdown = richDocumentMarkdown(document)
    assert.match(html, new RegExp(`data-callout="${kind}"`))
    assert.match(html, /Własny nagłówek/)
    assert.ok(markdown.includes(`[!${kind.toUpperCase()}]`))
    assert.ok(markdown.includes('Praktyczna wskazówka'))
  }
})
test('legacy Markdown migrates headings, emphasis, GFM callouts, tasks, tables and code', () => {
  const source =
    '# Tytuł sekcji\n\n**Ważny tekst** i [link](https://makoto.com.pl).\n\n> [!TIP]\n> Przygotuj treści przed projektem.\n\n- [x] Pierwsze zadanie\n- [ ] Drugie zadanie\n\n| Nazwa | Koszt |\n| --- | --- |\n| Strona | 2500 zł |\n\n```js\nconst answer = 42;\n```'
  const document = normalizeRichDocument(markdownToDocument(source))
  assert.equal(document.content[0].attrs.level, 2)
  assert.ok(document.content.some((n) => n.type === 'callout' && n.attrs.kind === 'tip'))
  assert.ok(document.content.some((n) => n.type === 'taskList'))
  assert.ok(document.content.some((n) => n.type === 'table'))
  assert.ok(document.content.some((n) => n.type === 'codeBlock'))
  const html = renderRichDocument(document)
  assert.match(html, /<strong>Ważny tekst<\/strong>/)
  assert.match(html, /data-checked="true"/)
  assert.match(html, /<thead>/)
  assert.doesNotMatch(html, /<h1/)
})
test('untrusted text and captions are escaped, script attributes are discarded', () => {
  const document = normalizeRichDocument(
    doc(paragraph('<script>alert(1)</script>'), {
      type: 'image',
      attrs: {
        src: '/images/avatar.webp',
        alt: '" onerror="alert(1)',
        caption: '<img src=x onerror=alert(1)>',
        onerror: 'alert(1)',
      },
    }),
  )
  assert.equal(document.content[1].attrs.onerror, undefined)
  const html = renderRichDocument(document)
  assert.doesNotMatch(html, /<script|<img src=x| onerror="alert/)
  assert.match(html, /&lt;script&gt;/)
  assert.match(html, /<figcaption>&lt;img/)
})
test('unsafe media, links, unsupported nodes and illegal structure are rejected', () => {
  for (const url of [
    'javascript:alert(1)',
    'data:text/html,test',
    '//evil.example',
    '/\\evil.example',
    'https://example.com\n',
  ])
    assert.equal(safeHref(url), '')
  assert.equal(safeHref('mailto:contact@makoto.com.pl'), 'mailto:contact@makoto.com.pl')
  assert.equal(safeHref('mailto:contact@makoto.com.pl', true), '')
  assert.throws(() =>
    normalizeRichDocument(
      doc({ type: 'image', attrs: { src: 'javascript:alert(1)', alt: 'Zdjęcie' } }),
    ),
  )
  assert.throws(() =>
    normalizeRichDocument(doc({ type: 'image', attrs: { src: '/images/avatar.webp', alt: '' } })),
  )
  assert.throws(() => normalizeRichDocument(doc({ type: 'iframe' })))
  assert.throws(() =>
    normalizeRichDocument(doc({ type: 'heading', attrs: { level: 1 }, content: [] })),
  )
  assert.throws(() =>
    normalizeRichDocument(doc({ type: 'paragraph', content: [{ type: 'table', content: [] }] })),
  )
  assert.throws(() =>
    normalizeRichDocument(
      doc({ type: 'callout', attrs: { kind: 'forged' }, content: [paragraph('Test')] }),
    ),
  )
})
test('images with captions, keyboard marks and checked tasks remain readable in AI output', () => {
  const document = normalizeRichDocument(
    doc(
      {
        type: 'image',
        attrs: { src: '/images/avatar.webp', alt: 'Portret autora', caption: 'Patryk — Makoto.' },
      },
      { type: 'paragraph', content: [{ type: 'text', text: 'Ctrl', marks: [{ type: 'kbd' }] }] },
      {
        type: 'taskList',
        content: [
          { type: 'taskItem', attrs: { checked: true }, content: [paragraph('Przygotuj brief.')] },
        ],
      },
    ),
  )
  const html = renderRichDocument(document),
    markdown = richDocumentMarkdown(document)
  assert.match(html, /<figcaption>Patryk — Makoto\.<\/figcaption>/)
  assert.match(html, /<kbd>Ctrl<\/kbd>/)
  assert.match(markdown, /Portret autora/)
  assert.match(markdown, /Patryk — Makoto/)
  assert.match(markdown, /- \[x\] Przygotuj brief\./)
  assert.match(richText(document), /Przygotuj brief/)
})
test('document size and nesting limits are enforced', () => {
  let nested = paragraph('Test')
  for (let i = 0; i < 25; i++) nested = { type: 'blockquote', content: [nested] }
  assert.throws(() => normalizeRichDocument(doc(nested)))
  assert.throws(() => normalizeRichDocument(doc(paragraph('a'.repeat(80001)))))
  assert.throws(() =>
    normalizeRichDocument(doc(...Array.from({ length: 5000 }, () => paragraph('Test')))),
  )
})
