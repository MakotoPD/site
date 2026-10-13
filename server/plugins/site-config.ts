import { indexingEnabled, siteOrigin } from '#shared/seo'
import { useRuntimeConfig } from 'nuxt/server'
import { SiteConfigPriority } from 'site-config-stack'

export default defineNitroPlugin((nitroApp) => {
  // Keep the existing deployment variables effective at runtime, including when
  // the same Docker image is used for preview and production.
  nitroApp.hooks.hook('site-config:init', ({ siteConfig }) => {
    const config = useRuntimeConfig().public
    siteConfig.push({
      _context: 'makoto:runtime',
      _priority: SiteConfigPriority.runtime,
      url: siteOrigin(config.siteUrl),
      name: 'Makoto',
      defaultLocale: 'pl-PL',
      indexable: indexingEnabled(config.indexable),
      trailingSlash: false,
    })
  })
})
