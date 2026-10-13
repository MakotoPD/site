import { validConsent, type CookieConsent } from '#shared/analytics'
export function useCookieConsent() {
  const cookie = useCookie<CookieConsent | null>('cookie_consent', {
    default: () => null,
    path: '/',
    sameSite: 'lax',
    secure: !import.meta.dev,
    maxAge: 365 * 24 * 60 * 60,
  })
  const consent = useState<CookieConsent>('cookie-consent', () =>
    validConsent(cookie.value) ? { analytics: cookie.value.analytics } : { analytics: false },
  )
  const decided = useState('cookie-decided', () => validConsent(cookie.value))
  const settingsOpen = useState('cookie-settings-open', () => false)
  function save(value: CookieConsent) {
    const removed = consent.value.analytics && !value.analytics
    cookie.value = { ...value }
    consent.value = { ...value }
    decided.value = true
    settingsOpen.value = false
    if (import.meta.client && removed) {
      // Remove first-party tracker cookies at both common domain scopes, then discard loaded SDKs.
      for (const name of document.cookie
        .split(';')
        .map((part) => part.trim().split('=')[0]!)
        .filter((name) => /^(_ga(?:_|$)|_gid$|_gat(?:_|$))/.test(name))) {
        for (const domain of ['', location.hostname, '.' + location.hostname.replace(/^www\./, '')])
          document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain ? '; Domain=' + domain : ''}`
      }
      nextTick(() => location.reload())
    }
  }
  return {
    consent,
    decided,
    settingsOpen,
    save,
    acceptAll: () => save({ analytics: true }),
    rejectAll: () => save({ analytics: false }),
    openSettings: () => {
      settingsOpen.value = true
    },
  }
}
