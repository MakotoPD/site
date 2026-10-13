import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import { analyticsAllowed, googleConsent, privateAnalyticsPath } from '../shared/analytics.ts'
const source = readFileSync('app/plugins/analytics.client.ts', 'utf8')
  .replace(/^import .*\n/, '')
  .replace('export default defineNuxtPlugin', 'captured = defineNuxtPlugin')
  .replaceAll('import.meta.dev', 'false')
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None },
}).outputText
function harness(path = '/', hostname = 'makoto.com.pl') {
  const scripts = [],
    ga = [],
    umami = [],
    hooks = {},
    consent = { value: { analytics: false } }
  let changed, navigated
  const location = { hostname, origin: 'https://' + hostname, replace() {} }
  const window = {
    dataLayer: [],
    umami: {
      track(payload) {
        umami.push(payload({ website: 'site-id', hostname: 'makoto.com.pl' }))
      },
    },
  }
  const router = {
    currentRoute: { value: { path } },
    afterEach(fn) {
      navigated = fn
    },
  }
  const config = {
    public: {
      siteUrl: 'https://makoto.com.pl',
      analytics: {
        enabled: true,
        gaId: 'G-7P472XF9TT',
        umamiId: '63fb127b-613f-4455-b6a4-82e4f7ae3581',
        umamiSrc: 'https://analytics.makoto.com.pl/script.js',
      },
    },
  }
  const context = {
    captured: null,
    analyticsAllowed,
    googleConsent,
    privateAnalyticsPath,
    location,
    window,
    Date,
    document: {
      title: 'Makoto',
      createElement: () => ({
        setAttribute(key, value) {
          this[key] = value
        },
        remove() {},
      }),
      head: {
        appendChild(script) {
          scripts.push(script)
        },
      },
    },
    defineNuxtPlugin: (fn) => fn,
    useRuntimeConfig: () => config,
    useRouter: () => router,
    useCookieConsent: () => ({ consent }),
    watch(_state, callback) {
      changed = callback
    },
    nextTick: (fn) => fn(),
  }
  vm.createContext(context)
  vm.runInContext(compiled, context)
  const plugin = context.captured({
    hook(name, fn) {
      hooks[name] = fn
    },
  })
  hooks['app:mounted']?.()
  // The SDK is mocked: no third-party requests or production statistics are generated.
  const original = window.gtag
  if (original)
    window.gtag = (...args) => {
      ga.push(args)
      original(...args)
    }
  const load = () => {
    for (const script of scripts.filter((s) => !s.done)) {
      script.done = true
      script.onload()
    }
  }
  return {
    scripts,
    ga,
    umami,
    window,
    consent,
    load,
    plugin,
    agree(analytics) {
      consent.value = { analytics }
      changed?.()
    },
    navigate(path) {
      router.currentRoute.value = { path }
      navigated?.({ path, fullPath: path })
    },
  }
}
test('production tracking waits for the right category and counts SPA pageviews once', () => {
  const h = harness()
  assert.equal(h.scripts.length, 0)
  h.agree(true)
  assert.deepEqual(h.scripts.map((s) => s.id).sort(), ['makoto-ga', 'makoto-umami'])
  h.load()
  h.navigate('/wycena')
  h.navigate('/wycena')
  assert.equal(h.ga.filter((args) => args[1] === 'page_view').length, 2)
  assert.equal(h.umami.length, 2)
  assert.equal(h.scripts.length, 2)
  h.plugin.provide.trackLead('calculator')
  const gaLead = h.ga.find((args) => args[1] === 'generate_lead')
  assert.equal(gaLead[2].form_type, 'calculator')
  assert.deepEqual(Object.keys(gaLead[2]).sort(), ['form_type', 'send_to'])
  assert.equal(h.umami.at(-1).name, 'generate_lead')
  // Umami's own payload is kept, so hostname and referrer reach the statistics.
  assert.equal(h.umami.at(-1).hostname, 'makoto.com.pl')
  assert.equal(
    h.scripts.find((s) => s.id === 'makoto-umami').src,
    'https://analytics.makoto.com.pl/script.js',
  )
  const previousCount = h.ga.length + h.umami.length
  h.agree(false)
  h.plugin.provide.trackLead('contact')
  assert.equal(h.ga.filter((args) => args[1] === 'generate_lead').length, 1)
  assert.ok(h.ga.length + h.umami.length >= previousCount)
})
test('advertising signals stay denied even with analytics consent', () => {
  const h = harness()
  h.agree(true)
  const update = h.window.dataLayer
    .map((args) => [...args])
    .findLast((args) => args[1] === 'update')
  assert.equal(update[2].analytics_storage, 'granted')
  assert.equal(update[2].ad_storage, 'denied')
})
test('preview hosts and direct administrator routes never load trackers', () => {
  for (const [path, host] of [
    ['/', 'preview.example'],
    ['/admin/login', 'makoto.com.pl'],
  ]) {
    const h = harness(path, host)
    h.agree(true)
    h.load()
    h.plugin.provide.trackLead('contact')
    assert.equal(h.scripts.length, 0)
    assert.equal(h.ga.length, 0)
    assert.equal(h.umami.length, 0)
  }
})
