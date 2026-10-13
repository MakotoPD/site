import { indexingEnabled } from '#shared/seo'
// Hosts match what the site loads: Turnstile, GA4 (gtag.js) and the Umami instance from the
// analytics config. 'unsafe-inline' stays because Nuxt hydrates from an inline script; the
// policy still blocks foreign scripts, frames and forms.
const contentSecurityPolicy = (umami: string) =>
  [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://*.googletagmanager.com ${umami}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    `connect-src 'self' blob: https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com ${umami}`,
    'frame-src https://challenges.cloudflare.com',
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ')
function origin(url: string) {
  try {
    return new URL(url).origin
  } catch {
    return ''
  }
}
export default defineEventHandler(async (event) => {
  setHeader(event, 'X-Content-Type-Options', 'nosniff')
  setHeader(event, 'Referrer-Policy', 'strict-origin-when-cross-origin')
  setHeader(event, 'X-Frame-Options', 'DENY')
  setHeader(event, 'Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')
  // Vite's dev client needs eval and websockets, so these two apply to built servers only.
  if (!import.meta.dev) {
    setHeader(event, 'Strict-Transport-Security', 'max-age=31536000')
    setHeader(
      event,
      'Content-Security-Policy',
      contentSecurityPolicy(origin(useRuntimeConfig(event).public.analytics.umamiSrc)),
    )
  }
  if (
    !indexingEnabled(useRuntimeConfig(event).public.indexable) ||
    (event.path.startsWith('/api/') && !event.path.startsWith('/api/media/'))
  )
    setHeader(event, 'X-Robots-Tag', 'noindex, nofollow')
  if (
    event.path.startsWith('/api/admin/') &&
    !['/api/admin/login', '/api/admin/session'].includes(event.path.split('?')[0]!)
  )
    await requireAdmin(event)
  if (event.path.startsWith('/api/') && !['GET', 'HEAD', 'OPTIONS'].includes(event.method))
    checkOrigin(event)
})
