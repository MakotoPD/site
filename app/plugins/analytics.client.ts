import { analyticsAllowed, googleConsent, privateAnalyticsPath } from '#shared/analytics'
declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}
export default defineNuxtPlugin((nuxtApp) => {
  const trackers = window as unknown as {
    // The function form extends Umami's own payload (hostname, referrer, screen, language).
    umami?: { track: (payload: (props: Record<string, unknown>) => unknown) => void }
  }
  const config = useRuntimeConfig(),
    router = useRouter()
  const { consent } = useCookieConsent()
  const settings = config.public.analytics
  const eligible = () =>
    analyticsAllowed(
      settings.enabled,
      import.meta.dev,
      location.hostname,
      config.public.siteUrl,
      router.currentRoute.value.path,
    )
  // Basic Consent Mode: no vendor script or request is made before consent.
  if (!eligible()) return { provide: { trackLead: (_source: 'contact' | 'calculator') => {} } }
  window.dataLayer = window.dataLayer || []
  window.gtag = function (..._args: unknown[]) {
    window.dataLayer.push(arguments)
  }
  window.gtag('consent', 'default', googleConsent({ analytics: false }))
  const started = new Set<string>(),
    loaded = new Set<string>(),
    lastPages = new Map<string, string>()
  function inject(
    id: string,
    src: string,
    attributes: Record<string, string> = {},
    onLoaded?: () => void,
  ) {
    if (started.has(id)) return
    started.add(id)
    const script = document.createElement('script')
    script.id = id
    script.src = src
    script.async = true
    for (const [key, value] of Object.entries(attributes)) script.setAttribute(key, value)
    script.onload = () => {
      loaded.add(id)
      onLoaded?.()
    }
    script.onerror = () => {
      started.delete(id)
      script.remove()
    }
    document.head.appendChild(script)
  }
  function pageview() {
    if (!eligible()) return
    const path = router.currentRoute.value.path,
      title = document.title
    function changed(vendor: string) {
      if (lastPages.get(vendor) === path) return false
      lastPages.set(vendor, path)
      return true
    }
    if (consent.value.analytics) {
      if (loaded.has('makoto-ga') && changed('ga'))
        window.gtag('event', 'page_view', {
          page_location: location.origin + path,
          page_path: path,
          page_title: title,
          send_to: settings.gaId,
        })
      if (loaded.has('makoto-umami') && trackers.umami && changed('umami'))
        trackers.umami.track((props) => ({ ...props, url: path, title }))
    }
  }
  function applyConsent() {
    if (!eligible()) return
    window.gtag('consent', 'update', googleConsent(consent.value))
    if (consent.value.analytics) {
      if (settings.gaId && !started.has('makoto-ga')) {
        window.gtag('js', new Date())
        window.gtag('config', settings.gaId, {
          send_page_view: false,
          allow_google_signals: false,
          allow_ad_personalization_signals: false,
        })
        inject(
          'makoto-ga',
          'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(settings.gaId),
          {},
          pageview,
        )
      }
      if (settings.umamiId && settings.umamiSrc)
        inject(
          'makoto-umami',
          settings.umamiSrc,
          {
            'data-website-id': settings.umamiId,
            'data-auto-track': 'false',
            'data-exclude-search': 'true',
            'data-exclude-hash': 'true',
          },
          pageview,
        )
    }
    pageview()
  }
  nuxtApp.hook('app:mounted', applyConsent)
  watch(consent, applyConsent, { deep: true })
  router.afterEach((to) => {
    if (privateAnalyticsPath(to.path)) {
      location.replace(to.fullPath)
      return
    }
    nextTick(pageview)
  })
  return {
    provide: {
      trackLead: (source: 'contact' | 'calculator') => {
        if (!eligible()) return
        const path = router.currentRoute.value.path
        if (consent.value.analytics) {
          if (loaded.has('makoto-ga'))
            window.gtag('event', 'generate_lead', { form_type: source, send_to: settings.gaId })
          if (loaded.has('makoto-umami'))
            trackers.umami?.track((props) => ({
              ...props,
              url: path,
              name: 'generate_lead',
              data: { form_type: source },
            }))
        }
      },
    },
  }
})
