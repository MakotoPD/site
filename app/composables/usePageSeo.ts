import { indexingEnabled, siteOrigin, seoRoutes } from '#shared/seo'
import { pageGraph } from '#shared/schema'
import { socialPresentation } from '#shared/social'
import { defineOgImage } from '#og-image/app'
export function usePageSeo(title: string | (() => string), description: string | (() => string)) {
  const config = useRuntimeConfig().public
  const site = siteOrigin(config.siteUrl)
  const route = useRoute()
  const resolvedTitle = () => `${typeof title === 'function' ? title() : title} — Makoto`
  const resolvedDescription = () =>
    typeof description === 'function' ? description() : description
  const images = defineOgImage(
    'Makoto',
    {
      title: () => (typeof title === 'function' ? title() : title),
      description: resolvedDescription,
      eyebrow: () => socialPresentation(route.path).eyebrow,
      picture: () => socialPresentation(route.path).picture,
      domain: new URL(site).hostname,
    },
    { alt: resolvedTitle },
  )
  useSeoMeta({
    title: resolvedTitle,
    description,
    ogTitle: resolvedTitle,
    ogDescription: description,
    ogLocale: 'pl_PL',
    ogSiteName: 'Makoto',
    ogUrl: () => site + route.path,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: resolvedTitle,
    twitterDescription: description,
    robots: indexingEnabled(config.indexable)
      ? 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
      : 'noindex, nofollow',
  })
  useHead(() => ({
    link: [
      { rel: 'canonical' as const, href: site + route.path },
      ...(seoRoutes.includes(route.path) ||
      route.path.startsWith('/strony-internetowe/') ||
      /^\/uslugi\/[^/]+$/.test(route.path) ||
      /^\/blog\/[^/]+$/.test(route.path) ||
      /^\/realizacje\/[^/]+$/.test(route.path)
        ? [
            {
              rel: 'alternate' as const,
              type: 'text/markdown',
              href: site + (route.path === '/' ? '/ai/index.md' : '/ai' + route.path + '.md'),
            },
          ]
        : []),
    ],
    meta: [
      ...(config.googleSiteVerification
        ? [{ name: 'google-site-verification', content: config.googleSiteVerification }]
        : []),
      ...(config.bingSiteVerification
        ? [{ name: 'msvalidate.01', content: config.bingSiteVerification }]
        : []),
    ],
  }))
  useStructuredData('makoto-page', () => ({
    '@context': 'https://schema.org',
    '@graph': pageGraph(site, route.path, resolvedTitle(), resolvedDescription()),
  }))
  return { socialImage: images[0] ? new URL(images[0], site).href : site + '/images/social.png' }
}
