import type { SiteSettings } from './types'
import { cityNames, regionName, socialProfiles, siteOrigin } from './seo'
export function identityGraph(settings: SiteSettings, site: string) {
  const origin = siteOrigin(site),
    businessId = origin + '/#business',
    personId = origin + '/#person'
  const address =
    settings.streetAddress && settings.postalCode && settings.addressLocality
      ? {
          '@type': 'PostalAddress',
          streetAddress: settings.streetAddress,
          postalCode: settings.postalCode,
          addressLocality: settings.addressLocality,
          addressRegion: 'kujawsko-pomorskie',
          addressCountry: 'PL',
        }
      : undefined
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': address ? 'LocalBusiness' : 'Organization',
        '@id': businessId,
        name: 'Makoto',
        alternateName: 'Makoto — Patryk Dąbrowski',
        url: origin + '/',
        logo: {
          '@type': 'ImageObject',
          url: origin + '/brand/makoto.webp',
          width: 188,
          height: 40,
        },
        image: origin + '/images/avatar.webp',
        description:
          'Projektowanie stron internetowych, sklepów, aplikacji webowych i interfejsów dla firm z województwa kujawsko-pomorskiego.',
        email: settings.email,
        ...(settings.phone ? { telephone: settings.phone } : {}),
        ...(address ? { address } : {}),
        ...(settings.googleMapsUrl ? { hasMap: settings.googleMapsUrl } : {}),
        areaServed: [
          { '@type': 'AdministrativeArea', name: regionName },
          ...cityNames.map((name) => ({ '@type': 'City', name })),
        ],
        founder: { '@id': personId },
        sameAs: [...socialProfiles, ...(settings.googleMapsUrl ? [settings.googleMapsUrl] : [])],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: settings.email,
          availableLanguage: ['pl'],
          ...(settings.phone ? { telephone: settings.phone } : {}),
        },
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: settings.name,
        alternateName: 'Makoto',
        url: origin + '/o-mnie',
        image: origin + '/images/avatar.webp',
        jobTitle: 'Projektant i programista stron internetowych',
        worksFor: { '@id': businessId },
        sameAs: socialProfiles,
        knowsAbout: [
          'Nuxt',
          'Vue',
          'Tailwind CSS',
          'Projektowanie UI/UX',
          'Tworzenie stron internetowych',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': origin + '/#website',
        name: 'Makoto',
        url: origin + '/',
        inLanguage: 'pl-PL',
        publisher: { '@id': businessId },
      },
    ],
  }
}
export function pageGraph(
  site: string,
  path: string,
  name: string,
  description: string,
  breadcrumbs: { name: string; path: string }[] = [],
) {
  const origin = siteOrigin(site),
    url = origin + path
  return [
    {
      '@type': 'WebPage',
      '@id': url + '#webpage',
      url,
      name,
      description,
      inLanguage: 'pl-PL',
      isPartOf: { '@id': origin + '/#website' },
      about: { '@id': origin + '/#business' },
      ...(breadcrumbs.length ? { breadcrumb: { '@id': url + '#breadcrumbs' } } : {}),
    },
    ...(breadcrumbs.length
      ? [
          {
            '@type': 'BreadcrumbList',
            '@id': url + '#breadcrumbs',
            itemListElement: breadcrumbs.map((item, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: item.name,
              item: origin + item.path,
            })),
          },
        ]
      : []),
  ]
}
