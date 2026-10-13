export const regionName = 'województwo kujawsko-pomorskie'
export const cityNames = ['Inowrocław', 'Toruń', 'Bydgoszcz', 'Grudziądz', 'Włocławek']
export const socialProfiles = [
  'https://github.com/makotopd',
  'https://www.linkedin.com/in/makotopd/',
]
export function siteOrigin(value: string) {
  return new URL(value).origin
}
export function indexingEnabled(value: unknown) {
  return value === true || value === 'true'
}
export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}
export function xmlEscape(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}
export const seoRoutes = [
  '/',
  '/uslugi',
  '/obszar-dzialania',
  '/realizacje',
  '/o-mnie',
  '/blog',
  '/kontakt',
  '/wycena',
  '/pytania',
  '/prywatnosc',
]
export const knownRedirects: Record<string, string> = {
  '/pl': '/',
  '/about': '/o-mnie',
  '/pl/about': '/o-mnie',
  '/contact': '/kontakt',
  '/pl/contact': '/kontakt',
  '/work': '/realizacje',
  '/pl/work': '/realizacje',
  '/portfolio': '/realizacje',
  '/pl/portfolio': '/realizacje',
  '/privacy': '/prywatnosc',
  '/pl/privacy': '/prywatnosc',
  '/pl/blog': '/blog',
  '/admin/login/': '/admin/login',
  '/panel': '/admin',
}
for (const [oldPath, target] of Object.entries({
  websites: 'strony-internetowe',
  'online-stores': 'sklepy-internetowe',
  'web-applications': 'aplikacje-webowe',
  'technical-seo': 'seo-techniczne',
  'website-care': 'opieka-techniczna',
}))
  knownRedirects['/' + oldPath] = '/uslugi/' + target
for (const [oldPath, target] of Object.entries({
  'strony-internetowe': 'strony-internetowe',
  'sklepy-internetowe': 'sklepy-internetowe',
  'aplikacje-internetowe': 'aplikacje-webowe',
  'optymalizacja-seo': 'seo-techniczne',
  'opieka-techniczna': 'opieka-techniczna',
}))
  knownRedirects['/pl/' + oldPath] = '/uslugi/' + target
knownRedirects['/pl/kontakt'] = '/kontakt'
knownRedirects['/faq'] = '/pytania'
knownRedirects['/pl/faq'] = '/pytania'
knownRedirects['/blog/introducing-denalify'] = '/blog/przedstawiam-denalify'
