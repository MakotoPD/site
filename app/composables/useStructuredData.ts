import { serializeJsonLd } from '#shared/seo'
export function useStructuredData(key: string, graph: () => unknown) {
  useHead(() => ({
    script: [{ key, type: 'application/ld+json', innerHTML: serializeJsonLd(graph()) }],
  }))
}
