export interface CookieConsent {
  analytics: boolean
}
export function validConsent(value: unknown): value is CookieConsent {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as CookieConsent).analytics === 'boolean'
  )
}
export function privateAnalyticsPath(path: string) {
  return path === '/admin' || path.startsWith('/admin/')
}
export function analyticsAllowed(
  enabled: unknown,
  development: boolean,
  hostname: string,
  canonical: string,
  path: string,
) {
  if (
    development ||
    (enabled !== true && enabled !== 'true') ||
    privateAnalyticsPath(path) ||
    ['localhost', '127.0.0.1', '[::1]'].includes(hostname)
  )
    return false
  try {
    return hostname.replace(/^www\./, '') === new URL(canonical).hostname.replace(/^www\./, '')
  } catch {
    return false
  }
}
export function googleConsent(consent: CookieConsent) {
  return {
    analytics_storage: consent.analytics ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    personalization_storage: 'denied',
  }
}
