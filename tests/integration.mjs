// Runs the production server with temporary credentials, an isolated PostgreSQL schema and R2 prefix.
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { randomBytes, scryptSync } from 'node:crypto'
import pg from 'pg'
import sharp from 'sharp'
import { createObjectStore } from '../server/storage/objects.ts'
import { markdownToDocument } from '../shared/markdown.ts'
import {
  turnstileTestSecretKey,
  turnstileTestSiteKey,
  turnstileTestToken,
} from '../shared/turnstile.ts'
if (existsSync('.env')) process.loadEnvFile('.env')
const isolation = randomBytes(8).toString('hex'),
  schema = 'makoto_test_' + isolation,
  prefix = 'makoto-studio/tests/' + isolation
const databaseUrl = process.env.NUXT_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl || !['localhost', '127.0.0.1'].includes(new URL(databaseUrl).hostname))
  throw new Error('Integration test requires local PostgreSQL')
const testPool = new pg.Pool({
  connectionString: databaseUrl,
  options: '-c search_path=' + schema,
  max: 1,
})
const testStore = createObjectStore({
  accountId: process.env.R2_ACCOUNT_ID || '',
  accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  bucketName: process.env.R2_BUCKET_NAME || '',
  endpoint: process.env.R2_ENDPOINT || '',
  prefix,
})
const password = randomBytes(24).toString('hex'),
  salt = randomBytes(16).toString('hex')
const origin = 'http://127.0.0.1:3012'
const environment = {
  ...process.env,
  NODE_ENV: 'test',
  PORT: '3012',
  HOST: '127.0.0.1',
  NUXT_PUBLIC_SITE_URL: origin,
  NUXT_PUBLIC_INDEXABLE: 'true',
  NUXT_TURNSTILE_SECRET_KEY: turnstileTestSecretKey,
  NUXT_PUBLIC_TURNSTILE_SITE_KEY: turnstileTestSiteKey,
  NUXT_DATABASE_URL: databaseUrl,
  NUXT_DATABASE_SCHEMA: schema,
  NUXT_R2_PREFIX: prefix,
  // Test leads must never reach a real inbox.
  NUXT_SMTP_HOST: '',
  NUXT_ADMIN_EMAIL: 'test@example.com',
  NUXT_ADMIN_PASSWORD_HASH: salt + ':' + scryptSync(password, salt, 64).toString('hex'),
}
let child,
  cookie = '',
  output = ''
function start() {
  child = spawn(process.execPath, ['.output/server/index.mjs'], {
    env: environment,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  child.stdout.on('data', (b) => {
    output += b
  })
  child.stderr.on('data', (b) => {
    output += b
  })
}
async function ready() {
  for (let i = 0; i < 80; i++) {
    try {
      if ((await fetch(origin + '/api/settings')).ok) return
    } catch {}
    await new Promise((r) => setTimeout(r, 250))
  }
  throw new Error('Server did not start: ' + output)
}
async function stop() {
  if (!child || child.exitCode !== null) return
  const closed = new Promise((resolve) => child.once('exit', resolve))
  child.kill()
  await closed
}
async function request(path, method = 'GET', body, authenticated = true, customOrigin = origin) {
  if (method === 'POST' && body && path === '/api/leads')
    body = { token: turnstileTestToken, ...body }
  if (method === 'POST' && body && path === '/api/admin/login')
    body = { challenge: turnstileTestToken, ...body }
  const headers = { origin: customOrigin }
  if (authenticated && cookie) headers.cookie = cookie
  if (body !== undefined) headers['content-type'] = 'application/json'
  const response = await fetch(origin + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    redirect: 'manual',
  })
  const text = await response.text()
  let data
  try {
    data = JSON.parse(text)
  } catch {
    data = text
  }
  return { response, status: response.status, data }
}
try {
  start()
  await ready()
  assert.equal((await request('/api/admin/leads', 'GET', undefined, false)).status, 401)
  assert.equal(
    (
      await request(
        '/api/admin/login',
        'POST',
        { email: 'test@example.com', password },
        false,
        'https://evil.example',
      )
    ).status,
    403,
  )
  assert.equal(
    (
      await request(
        '/api/admin/login',
        'POST',
        { email: 'test@example.com', password, challenge: '' },
        false,
      )
    ).status,
    422,
  )
  assert.equal(
    (
      await request(
        '/api/admin/login',
        'POST',
        { email: 'test@example.com', password, challenge: 'forged-token' },
        false,
      )
    ).status,
    422,
  )
  assert.equal(
    (
      await request(
        '/api/admin/login',
        'POST',
        { email: 'test@example.com', password: 'wrong' },
        false,
      )
    ).status,
    401,
  )
  const login = await request(
    '/api/admin/login',
    'POST',
    { email: 'test@example.com', password },
    false,
  )
  assert.equal(login.status, 200)
  cookie = login.response.headers.get('set-cookie').split(';')[0]
  assert.match(login.response.headers.get('set-cookie'), /HttpOnly/i)
  assert.match(login.response.headers.get('set-cookie'), /SameSite=Strict/i)
  const config = {
    project: 'store',
    extras: [],
    monthly: ['care'],
    pages: 30,
    languages: 1,
    urgent: false,
    design: 'premium',
    productRange: 'medium',
    productEntry: 'makoto',
  }
  const leadBody = {
    name: 'Test Integration',
    email: 'test@example.com',
    company: 'Local test',
    phone: '',
    city: 'Toruń',
    originPage: '/strony-internetowe/torun',
    message: 'Test project configuration for a local integration check.',
    consent: true,
    source: 'calculator',
    website: '',
    configuration: config,
    brief: { goal: 'store', undecided: ['copy', 'identity'] },
    total: 1,
  }
  assert.equal((await request('/api/leads', 'POST', { ...leadBody, token: '' }, false)).status, 422)
  assert.equal(
    (await request('/api/leads', 'POST', { ...leadBody, token: 'forged-token' }, false)).status,
    422,
  )
  assert.equal((await request('/api/admin/leads')).data.length, 0)
  // The generated schema belongs only to this test.
  await testPool.query('DELETE FROM rate_limits')
  assert.equal(
    (await request('/api/leads', 'POST', { ...leadBody, consent: false }, false)).status,
    400,
  )
  assert.equal(
    (
      await request(
        '/api/leads',
        'POST',
        { ...leadBody, configuration: { ...config, extras: ['forged'] } },
        false,
      )
    ).status,
    400,
  )
  assert.equal(
    (await request('/api/leads', 'POST', { ...leadBody, configuration: undefined }, false)).status,
    400,
  )
  const created = await request('/api/leads', 'POST', leadBody, false)
  assert.equal(created.status, 201)
  const leads = (await request('/api/admin/leads')).data
  assert.equal(leads.length, 1)
  assert.equal(leads[0].quote.total, 6550)
  assert.equal(leads[0].quote.monthly, 250)
  assert.equal(leads[0].quote.configuration.productRange, 'medium')
  assert.equal(leads[0].quote.configuration.design, 'premium')
  assert.ok(leads[0].quote.selections.some((s) => s.value === '51–200 produktów'))
  assert.equal(leads[0].city, 'Toruń')
  assert.equal(leads[0].originPage, '/strony-internetowe/torun')
  assert.deepEqual(leads[0].brief, leadBody.brief)
  const helpLead = await request(
    '/api/leads',
    'POST',
    {
      ...leadBody,
      name: 'Test Needs Help',
      configuration: undefined,
      brief: { goal: 'unsure', undecided: ['project'] },
    },
    false,
  )
  assert.equal(helpLead.status, 201)
  const savedHelp = (await request('/api/admin/leads')).data.find((l) => l.id === helpLead.data.id)
  assert.equal(savedHelp.source, 'calculator')
  assert.equal(savedHelp.quote, null)
  assert.deepEqual(savedHelp.brief, { goal: 'unsure', undecided: ['project'] })
  assert.equal((await request('/api/leads', 'POST', leadBody, false)).status, 429)
  assert.equal(
    (
      await request(`/api/admin/leads/${created.data.id}`, 'PATCH', {
        status: 'proposal',
        notes: '=CSV injection check',
      })
    ).status,
    200,
  )
  const csv = await request('/api/admin/leads/export')
  assert.equal(csv.status, 200)
  assert.match(csv.data, /'=CSV injection check/)
  assert.match(csv.data, /Przygotowanie tekstów, Logo i identyfikacja/)
  const draft = {
    title: 'Integration Draft',
    slug: 'integration-draft',
    excerpt: 'A local integration draft to test the publication flow.',
    content: '## Safe content\n\n<script>alert(1)</script>\n\n[unsafe](javascript:alert(1))',
    category: 'Test',
    cover: '',
    status: 'draft',
  }
  const post = await request('/api/admin/posts', 'POST', draft)
  assert.equal(post.status, 200)
  assert.doesNotMatch(
    (await request('/sitemap.xml', 'GET', undefined, false)).data,
    /integration-draft/,
  )
  assert.equal((await request('/api/posts/integration-draft', 'GET', undefined, false)).status, 404)
  assert.doesNotMatch(
    (await request('/llms-full.txt', 'GET', undefined, false)).data,
    /Integration Draft|Test Integration/,
  )
  assert.equal(
    (await request('/ai/blog/integration-draft.md', 'GET', undefined, false)).status,
    404,
  )
  assert.equal(
    (await request(`/api/admin/posts/${post.data.id}`, 'PUT', { ...draft, status: 'published' }))
      .status,
    200,
  )
  const published = (await request('/api/posts/integration-draft', 'GET', undefined, false)).data
  assert.match((await request('/sitemap.xml', 'GET', undefined, false)).data, /integration-draft/)
  assert.doesNotMatch(published.html, /<script>|href="javascript:/)
  assert.equal((await request('/api/admin/posts', 'POST', draft)).status, 409)
  const paragraph = (text) => ({ type: 'paragraph', content: [{ type: 'text', text }] })
  const richDocument = {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'Edytor z własnymi blokami' }],
      },
      ...['note', 'tip', 'info', 'success', 'important', 'warning', 'caution'].map((kind) => ({
        type: 'callout',
        attrs: { kind, title: 'Własny nagłówek ' + kind },
        content: [paragraph('Treść wyróżnienia do testu zapisu i publikacji.')],
      })),
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'Ctrl', marks: [{ type: 'kbd' }] },
          { type: 'text', text: ' + Z cofa zmianę.' },
        ],
      },
      {
        type: 'codeBlock',
        attrs: { language: 'javascript' },
        content: [{ type: 'text', text: 'const value = "<script>";' }],
      },
      {
        type: 'taskList',
        content: [
          {
            type: 'taskItem',
            attrs: { checked: true },
            content: [paragraph('Sprawdź zapis i podgląd.')],
          },
        ],
      },
      {
        type: 'image',
        attrs: {
          src: '/images/avatar.webp',
          alt: 'Portret autora',
          caption: 'Podpis zdjęcia pozostaje po restarcie.',
        },
      },
      {
        type: 'table',
        content: [
          {
            type: 'tableRow',
            content: [
              { type: 'tableHeader', content: [paragraph('Nazwa')] },
              { type: 'tableHeader', content: [paragraph('Zakres')] },
            ],
          },
          {
            type: 'tableRow',
            content: [
              { type: 'tableCell', content: [paragraph('TIP')] },
              { type: 'tableCell', content: [paragraph('Praktyczna rada')] },
            ],
          },
        ],
      },
    ],
  }
  const richDraft = {
    ...draft,
    title: 'Rich Editor Integration',
    slug: 'rich-editor-integration',
    document: richDocument,
    content: 'FORGED MANUAL BODY MUST NOT OVERRIDE JSON',
  }
  const richPost = await request('/api/admin/posts', 'POST', richDraft)
  assert.equal(richPost.status, 200)
  assert.equal(
    (await request('/api/posts/rich-editor-integration', 'GET', undefined, false)).status,
    404,
  )
  assert.match(richPost.data.content, /\[!TIP\]/)
  assert.doesNotMatch(richPost.data.content, /FORGED MANUAL/)
  assert.equal(
    (
      await request(`/api/admin/posts/${richPost.data.id}`, 'PUT', {
        ...richDraft,
        status: 'published',
      })
    ).status,
    200,
  )
  const richPublished = (
    await request('/api/posts/rich-editor-integration', 'GET', undefined, false)
  ).data
  assert.equal(richPublished.document, undefined)
  assert.equal(richPublished.content, undefined)
  assert.ok(richPublished.readingMinutes >= 1)
  assert.equal((richPublished.html.match(/data-callout=/g) || []).length, 7)
  assert.match(richPublished.html, /<figcaption>Podpis zdjęcia/)
  assert.match(richPublished.html, /<kbd>Ctrl<\/kbd>/)
  assert.match(richPublished.html, /data-checked="true"/)
  assert.match(richPublished.html, /<thead>/)
  assert.doesNotMatch(richPublished.html, /<script>/)
  for (const invalidDocument of [
    { type: 'doc', content: [{ type: 'heading', attrs: { level: 1 }, content: [] }] },
    {
      type: 'doc',
      content: [{ type: 'image', attrs: { src: 'javascript:alert(1)', alt: 'Test' } }],
    },
  ]) {
    assert.equal(
      (
        await request(`/api/admin/posts/${richPost.data.id}`, 'PUT', {
          ...richDraft,
          document: invalidDocument,
        })
      ).status,
      400,
    )
  }
  const richMarkdown = (
    await request('/ai/blog/rich-editor-integration.md', 'GET', undefined, false)
  ).data
  assert.match(richMarkdown, /\[!TIP\]/)
  assert.match(richMarkdown, /Podpis zdjęcia/)
  assert.match(richMarkdown, /Praktyczna rada/)
  const richPage = await request('/blog/rich-editor-integration', 'GET', undefined, false)
  assert.equal(richPage.status, 200)
  assert.equal((richPage.data.match(/<h1[ >]/g) || []).length, 1)
  assert.match(richPage.data, /rich-callout-tip/)
  const mediaData = new FormData(),
    imageBytes = await sharp('public/images/avatar.webp')
      .withExif({ IFD0: { Make: 'Integration camera' } })
      .toBuffer()
  assert.ok((await sharp(imageBytes).metadata()).exif)
  mediaData.append('file', new Blob([imageBytes], { type: 'image/webp' }), 'avatar.webp')
  const uploaded = await fetch(origin + '/api/admin/media', {
    method: 'POST',
    headers: { origin, cookie },
    body: mediaData,
  })
  assert.equal(uploaded.status, 200)
  const { url: mediaURL } = await uploaded.json()
  assert.equal((await fetch(origin + mediaURL)).status, 404)
  const media = await fetch(origin + mediaURL, { headers: { cookie } })
  assert.equal(media.headers.get('content-type'), 'image/webp')
  const [sent, stored] = await Promise.all(
    [imageBytes, Buffer.from(await media.arrayBuffer())].map((bytes) => sharp(bytes).metadata()),
  )
  assert.deepEqual([stored.format, stored.width, stored.height], ['webp', sent.width, sent.height])
  assert.equal(stored.exif, undefined)
  // Portfolio is edited as one list; an image used by a project becomes public.
  const portfolio = (await request('/api/projects', 'GET', undefined, false)).data
  assert.equal(portfolio[0].slug, 'spectra')
  assert.equal((await request('/api/admin/projects', 'PUT', portfolio, false)).status, 401)
  const work = [
    ...portfolio,
    {
      ...portfolio[1],
      slug: 'integration-work',
      image: mediaURL,
      document: markdownToDocument('**Opis z edytora.**'),
    },
  ]
  assert.equal((await request('/api/admin/projects', 'PUT', [...work, portfolio[0]])).status, 400)
  assert.equal(
    (await request('/api/admin/projects', 'PUT', [{ ...work[0], url: 'javascript:alert(1)' }]))
      .status,
    400,
  )
  assert.equal((await request('/api/admin/projects', 'PUT', work)).status, 200)
  assert.equal((await fetch(origin + mediaURL)).status, 200)
  assert.match(
    (await request('/api/projects/integration-work', 'GET', undefined, false)).data.html,
    /<strong>Opis z edytora\.<\/strong>/,
  )
  assert.match((await request('/realizacje', 'GET', undefined, false)).data, /integration-work/)
  assert.equal(
    (await request('/work/integration-work', 'GET', undefined, false)).response.headers.get(
      'location',
    ),
    '/realizacje/integration-work',
  )
  assert.equal(
    (
      await request(`/api/admin/posts/${richPost.data.id}`, 'PUT', {
        ...richDraft,
        cover: mediaURL,
        status: 'published',
      })
    ).status,
    200,
  )
  assert.equal((await fetch(origin + mediaURL)).status, 200)
  const pdfBytes = Buffer.from(
    '%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF\n',
  )
  const pdfData = new FormData()
  pdfData.append('file', new Blob([pdfBytes], { type: 'application/pdf' }), 'Zakres projektu.pdf')
  const uploadedPDF = await fetch(origin + '/api/admin/media', {
    method: 'POST',
    headers: { origin, cookie },
    body: pdfData,
  })
  assert.equal(uploadedPDF.status, 200)
  const { url: pdfURL } = await uploadedPDF.json()
  assert.equal((await fetch(origin + pdfURL)).status, 404)
  const draftPDF = await fetch(origin + pdfURL, { headers: { cookie } })
  assert.equal(draftPDF.headers.get('content-type'), 'application/pdf')
  assert.match(draftPDF.headers.get('content-disposition'), /attachment/)
  assert.deepEqual(Buffer.from(await draftPDF.arrayBuffer()), pdfBytes)
  const withFile = {
    ...richDraft,
    cover: mediaURL,
    status: 'published',
    document: {
      ...richDocument,
      content: [
        ...richDocument.content,
        { type: 'file', attrs: { src: pdfURL, name: 'Zakres projektu PDF' } },
      ],
    },
  }
  assert.equal((await request(`/api/admin/posts/${richPost.data.id}`, 'PUT', withFile)).status, 200)
  assert.equal((await fetch(origin + pdfURL)).status, 200)
  assert.match(
    (await request('/api/posts/rich-editor-integration', 'GET', undefined, false)).data.html,
    /Zakres projektu PDF/,
  )
  const fakeImage = new FormData()
  fakeImage.append(
    'file',
    new Blob(['<script>alert(1)</script>'], { type: 'image/png' }),
    'fake.png',
  )
  assert.equal(
    (
      await fetch(origin + '/api/admin/media', {
        method: 'POST',
        headers: { origin, cookie },
        body: fakeImage,
      })
    ).status,
    400,
  )
  const settings = (await request('/api/settings', 'GET', undefined, false)).data
  settings.projects[1].price = 5500
  settings.designs[1].price = 1000
  settings.productImports[1].price = 900
  assert.equal((await request('/api/admin/settings', 'PUT', settings)).status, 200)
  // Retention: only a lead that is both old and untouched for three years is purged at startup.
  for (const [id, created, updated] of [
    ['00000000-0000-4000-8000-000000000001', '4 years', '2020-01-01T00:00:00.000Z'],
    ['00000000-0000-4000-8000-000000000002', '4 years', new Date().toISOString()],
  ])
    await testPool.query(`INSERT INTO leads VALUES($1, $2::jsonb, now() - interval '${created}')`, [
      id,
      JSON.stringify({ ...leads[0], id, updatedAt: updated }),
    ])
  await stop()
  start()
  await ready()
  const retained = (await request('/api/admin/leads')).data.map((l) => l.id)
  assert.ok(!retained.includes('00000000-0000-4000-8000-000000000001'))
  assert.ok(retained.includes('00000000-0000-4000-8000-000000000002'))
  assert.ok(retained.includes(created.data.id))
  assert.equal(
    (await request('/api/admin/leads/00000000-0000-4000-8000-000000000002', 'DELETE')).status,
    200,
  )
  assert.equal(
    (await request('/api/admin/leads')).data.find((l) => l.id === created.data.id).notes,
    '=CSV injection check',
  )
  assert.deepEqual(
    (await request('/api/admin/leads')).data.find((l) => l.id === helpLead.data.id).brief,
    { goal: 'unsure', undecided: ['project'] },
  )
  assert.equal(
    (await request('/api/settings', 'GET', undefined, false)).data.projects[1].price,
    5500,
  )
  assert.equal(
    (await request('/api/settings', 'GET', undefined, false)).data.designs[1].price,
    1000,
  )
  assert.equal(
    (await request('/api/settings', 'GET', undefined, false)).data.productImports[1].price,
    900,
  )
  assert.equal((await request('/api/posts/integration-draft', 'GET', undefined, false)).status, 200)
  const persistedRich = (await request(`/api/admin/posts/${richPost.data.id}`)).data
  assert.equal(persistedRich.document.content.filter((n) => n.type === 'callout').length, 7)
  assert.equal(
    persistedRich.document.content.find((n) => n.type === 'image').attrs.caption,
    'Podpis zdjęcia pozostaje po restarcie.',
  )
  assert.equal((await request('/sitemap.xml', 'GET', undefined, false)).status, 200)
  const sitemap = (await request('/sitemap.xml', 'GET', undefined, false)).data
  assert.match(sitemap, /strony-internetowe\/grudziadz/)
  assert.doesNotMatch(sitemap, /<loc>[^<]*(?:\/admin|\/api\/|\/_og\/|\/ai\/)/)
  assert.ok(sitemap.includes(origin), 'Sitemap must use the runtime deployment origin')
  const aiQuote = (await request('/ai/wycena.md', 'GET', undefined, false)).data
  assert.ok(
    aiQuote.includes('1000') && aiQuote.includes('900'),
    'AI pricing must read current admin settings',
  )
  for (const path of ['/ai/realizacje/spectra.md', '/ai/pytania.md', '/ai/uslugi.md']) {
    assert.equal((await request(path, 'GET', undefined, false)).status, 200, path)
  }
  const pages = [
    '/',
    '/kontakt',
    '/wycena',
    '/uslugi',
    '/realizacje',
    '/realizacje/spectra',
    '/blog',
    '/obszar-dzialania',
    '/strony-internetowe/inowroclaw',
    '/strony-internetowe/torun',
    '/strony-internetowe/bydgoszcz',
    '/strony-internetowe/grudziadz',
    '/strony-internetowe/wloclawek',
    '/uslugi/strony-internetowe',
    '/uslugi/sklepy-internetowe',
    '/uslugi/aplikacje-webowe',
    '/uslugi/projektowanie-ui-ux',
    '/uslugi/seo-techniczne',
    '/uslugi/opieka-techniczna',
    '/pytania',
    '/blog/przedstawiam-denalify',
    '/blog/co-przygotowac-przed-zamowieniem-strony',
    '/blog/jak-porownac-wyceny-strony-internetowej',
  ]
  const titles = []
  const socialImages = new Set()
  for (const path of pages) {
    const result = await request(path, 'GET', undefined, false)
    assert.equal(result.status, 200, path)
    assert.equal((result.data.match(/<h1[ >]/g) || []).length, 1, path + ' must have one h1')
    const title = result.data.match(/<title>(.*?)<\/title>/)?.[1]
    assert.ok(title, path + ' title missing')
    assert.ok(!titles.includes(title), path + ' duplicate title')
    titles.push(title)
    const ogTags = [
      ...result.data.matchAll(/<meta\b[^>]*property="og:image"[^>]*content="([^"]+)"[^>]*>/g),
    ]
    assert.equal(ogTags.length, 1, path + ' must have one Open Graph image')
    const ogUrl = ogTags[0][1].replaceAll('&amp;', '&')
    assert.equal(new URL(ogUrl).origin, origin, path + ' OG image must use the runtime origin')
    assert.ok(!socialImages.has(ogUrl), path + ' must have its own OG image')
    socialImages.add(ogUrl)
    assert.match(result.data, /property="og:image:width" content="1200"/)
    assert.match(result.data, /property="og:image:height" content="630"/)
    assert.match(result.data, /property="og:image:alt" content="[^"]+"/)
    assert.match(result.data, /name="twitter:card" content="summary_large_image"/)
    assert.match(result.data, /name="twitter:image" content="[^"]+"/)
    for (const secret of [
      process.env.R2_ACCESS_KEY_ID,
      process.env.R2_SECRET_ACCESS_KEY,
      process.env.NUXT_APP_SECRET,
      process.env.NUXT_ADMIN_PASSWORD_HASH,
    ].filter(Boolean)) {
      assert.ok(
        !result.data.includes(secret),
        'Server credentials must never appear in public HTML',
      )
    }
    if (['/', '/strony-internetowe/torun', '/uslugi/seo-techniczne'].includes(path)) {
      const imageResponse = await fetch(ogUrl)
      assert.equal(imageResponse.status, 200, path + ' signed OG image failed')
      assert.match(imageResponse.headers.get('content-type'), /^image\/png/)
      const bytes = Buffer.from(await imageResponse.arrayBuffer())
      const metadata = await sharp(bytes).metadata()
      assert.equal(metadata.width, 1200)
      assert.equal(metadata.height, 630)
      mkdirSync('test-results', { recursive: true })
      writeFileSync(
        'test-results/og-production-' + (path === '/' ? 'home' : path.split('/').at(-1)) + '.png',
        bytes,
      )
    }
    const scripts = [
      ...result.data.matchAll(
        /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
      ),
    ].map((m) => JSON.parse(m[1]))
    assert.ok(scripts.length >= 2, path + ' structured data missing')
    const entities = scripts.flatMap((s) => s['@graph'] || [s])
    const business = entities.find((e) => e['@type'] === 'LocalBusiness')
    assert.equal(business.address.streetAddress, 'Młyńska 5/1')
    assert.equal(business.telephone, '+48 500 408 357')
    assert.equal(entities.filter((e) => e['@type'] === 'LocalBusiness').length, 1)
    assert.ok(
      result.data.includes('rel="canonical"') && result.data.includes(origin + path),
      path + ' canonical missing',
    )
    if (path.startsWith('/strony-internetowe/')) {
      assert.ok(
        entities.some((e) => e['@type'] === 'Service' && e.areaServed['@type'] === 'City'),
        path + ' city service missing',
      )
      assert.match(result.data, /name="city"/)
    }
    if (path.startsWith('/blog/'))
      assert.ok(
        entities.some(
          (e) => e['@type'] === 'BlogPosting' && e.author.name && e.datePublished && e.dateModified,
        ),
      )
  }
  const robots = (await request('/robots.txt', 'GET', undefined, false)).data
  for (const block of robots.split('\n\n').filter((b) => b.startsWith('User-agent:'))) {
    assert.match(block, /Allow: \//)
    assert.match(block, /Disallow: \/admin/)
  }
  assert.match(robots, /OAI-SearchBot/)
  assert.match(robots, /PerplexityBot/)
  for (const [oldPath, newPath] of [
    ['/pl/strony-internetowe/torun', '/strony-internetowe/torun'],
    ['/websites', '/uslugi/strony-internetowe'],
    ['/pl/kontakt', '/kontakt'],
    ['/work/spectra', '/realizacje/spectra'],
    [
      '/pl/blog/co-przygotowac-przed-zamowieniem-strony',
      '/blog/co-przygotowac-przed-zamowieniem-strony',
    ],
  ]) {
    const redirect = await request(oldPath, 'GET', undefined, false)
    assert.equal(redirect.status, 301, oldPath)
    assert.equal(redirect.response.headers.get('location'), newPath)
  }
  assert.equal(
    (await request('/strony-internetowe/nieznane-miasto', 'GET', undefined, false)).status,
    404,
  )
  assert.equal((await request('/ai/admin.md', 'GET', undefined, false)).status, 404)
  assert.equal(
    (await request('/ai/strony-internetowe/torun.md', 'GET', undefined, false)).status,
    200,
  )
  assert.equal((await request(`/api/admin/posts/${post.data.id}`, 'DELETE')).status, 200)
  assert.equal((await request(`/api/admin/posts/${richPost.data.id}`, 'DELETE')).status, 200)
  assert.doesNotMatch(
    (await request('/sitemap.xml', 'GET', undefined, false)).data,
    /integration-draft|rich-editor-integration/,
  )
  assert.doesNotMatch(
    (await request('/llms-full.txt', 'GET', undefined, false)).data,
    /Integration Draft|Rich Editor Integration/,
  )
  assert.equal((await fetch(origin + mediaURL)).status, 404)
  assert.equal((await fetch(origin + pdfURL)).status, 404)
  assert.equal((await request(`/api/admin/leads/${created.data.id}`, 'DELETE')).status, 200)
  assert.equal((await request('/api/admin/logout', 'POST')).status, 200)
  assert.equal((await request('/api/admin/leads')).status, 401)
  await stop()
  environment.NUXT_PUBLIC_INDEXABLE = 'false'
  start()
  await ready()
  assert.match((await request('/robots.txt', 'GET', undefined, false)).data, /Disallow: \/\n/)
  assert.doesNotMatch((await request('/sitemap.xml', 'GET', undefined, false)).data, /<loc>/)
  assert.match(
    (await request('/', 'GET', undefined, false)).response.headers.get('x-robots-tag'),
    /noindex/,
  )
  const secondLogin = await request(
    '/api/admin/login',
    'POST',
    { email: 'test@example.com', password },
    false,
  )
  cookie = secondLogin.response.headers.get('set-cookie').split(';')[0]
  await stop()
  environment.NUXT_ADMIN_PASSWORD_HASH =
    salt + ':' + scryptSync('new-test-password', salt, 64).toString('hex')
  start()
  await ready()
  assert.equal((await request('/api/admin/leads')).status, 401)
  console.log(
    'PASS: PostgreSQL/R2, draft privacy, admin, protected forms, pricing, Tiptap, SSR, 23 SEO pages, unique signed OG images (1200×630 PNG), dynamic sitemap publishing/deleting, runtime origin/indexing, AI pricing, private-secret isolation and redirects.',
  )
} finally {
  await stop()
  try {
    for (const row of (await testPool.query('SELECT object_key FROM media')).rows)
      await testStore.remove(row.object_key)
  } catch (error) {
    if (error.code !== '42P01') throw error
  }
  if (!/^makoto_test_[a-f0-9]{16}$/.test(schema)) throw new Error('Unsafe test cleanup schema')
  await testPool.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
  testStore.close()
  await testPool.end()
}
