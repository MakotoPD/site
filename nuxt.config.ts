import tailwindcss from '@tailwindcss/vite'
import { indexingEnabled } from './shared/seo'

const privateSeoPaths = [
  '/admin',
  '/admin/',
  '/panel',
  '/api/admin/',
  '/api/leads',
  '/api/posts/',
  '/api/settings',
  '/api/__sitemap__/',
]

export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  buildDir: '.nuxt',
  devtools: { enabled: false },
  modules: ['@nuxt/icon', '@nuxtjs/turnstile', '@nuxt/fonts', '@nuxtjs/seo'],
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://makoto.com.pl',
    name: 'Makoto',
    defaultLocale: 'pl-PL',
    indexable: indexingEnabled(process.env.NUXT_PUBLIC_INDEXABLE),
    trailingSlash: false,
  },
  // The existing page metadata and business graph use verified, editable data.
  seo: { enabled: false },
  schemaOrg: { enabled: false },
  linkChecker: { enabled: false },
  aiReady: false,
  skewProtection: false,
  robots: {
    allow: ['/'],
    disallow: privateSeoPaths,
    groups: [
      { userAgent: ['OAI-SearchBot', 'PerplexityBot'], allow: ['/'], disallow: privateSeoPaths },
    ],
    mergeWithRobotsTxtPath: false,
  },
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    excludeAppSources: true,
    exclude: ['/admin/**', '/api/**', '/ai/**', '/_og/**'],
    autoLastmod: false,
    cacheMaxAgeSeconds: false,
    xsl: false,
    credits: false,
  },
  ogImage: {
    defaults: { width: 1200, height: 630, extension: 'png', emojis: false },
    security: {
      strict: true,
      maxDimension: 1200,
      maxDpr: 1,
      maxQueryParamSize: 4096,
      renderTimeout: 10000,
      restrictRuntimeImagesToOrigin: true,
    },
  },
  fonts: {
    families: [
      {
        name: 'Manrope',
        src: '/fonts/manrope.ttf',
        weights: [400, 500, 600, 700],
        styles: ['normal'],
        global: true,
      },
      {
        name: 'Instrument Serif',
        src: '/fonts/instrument-serif-italic.ttf',
        weights: [400],
        styles: ['italic'],
        global: true,
      },
    ],
  },
  icon: {
    provider: 'none',
    clientBundle: {
      scan: false,
      icons: [
        'simple-icons:nuxt',
        'simple-icons:vuedotjs',
        'simple-icons:tailwindcss',
        'simple-icons:gsap',
        'simple-icons:figma',
      ],
    },
  },
  turnstile: {
    addValidateEndpoint: false,
    siteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY,
    secretKey: process.env.NUXT_TURNSTILE_SECRET_KEY,
  },
  css: ['~/assets/css/main.css', '~/assets/css/tokens.css', '~/assets/css/content.css'],
  vite: { plugins: [tailwindcss()] },
  runtimeConfig: {
    adminEmail: '',
    adminPasswordHash: '',
    clientIpHeader: 'cf-connecting-ip',
    databaseUrl: '',
    databaseSchema: 'makoto_studio',
    r2: {
      accountId: '',
      accessKeyId: '',
      secretAccessKey: '',
      bucketName: '',
      endpoint: '',
      prefix: 'makoto-studio',
    },
    turnstile: { secretKey: '' },
    smtp: { host: '', port: 587, user: '', password: '', to: '' },
    public: {
      siteUrl: 'https://makoto.com.pl',
      indexable: false,
      googleSiteVerification: '',
      bingSiteVerification: '',
      turnstile: { siteKey: '' },
      analytics: {
        enabled: true,
        gaId: 'G-7P472XF9TT',
        umamiId: '84056d40-a170-4a24-9d8a-e10d2144dd7e',
      },
    },
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'pl', class: 'dark' },
      title: 'Makoto — Design. Kod. Charakter.',
      meta: [
        { name: 'theme-color', content: '#090c10' },
        {
          name: 'description',
          content:
            'Autorskie strony internetowe, aplikacje i identyfikacja wizualna. Patryk Dąbrowski — Makoto. Od pierwszego pomysłu do dopracowanego wdrożenia.',
        },
      ],
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    },
  },
  routeRules: {
    '/admin/**': {
      headers: { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'private, no-store' },
    },
    '/api/admin/**': { headers: { 'Cache-Control': 'private, no-store' } },
  },
  nitro: { preset: 'node-server' },
  typescript: { strict: true },
})
