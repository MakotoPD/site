import { locations, localPath } from '#shared/locations'
import { servicePages, servicePath } from '#shared/services'
import { indexingEnabled, siteOrigin, seoRoutes } from '#shared/seo'
import { defineSitemapEventHandler } from '#sitemap/server'
import { useRuntimeConfig } from 'nuxt/server'

export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig().public
  if (!indexingEnabled(config.indexable)) return []
  const site = siteOrigin(config.siteUrl)
  const [records, projects] = await Promise.all([allPosts(), allProjects()])
  const posts = records.filter((post) => post.status === 'published')
  return [
    ...seoRoutes.map((loc) => ({ loc })),
    ...locations.map((city) => ({ loc: localPath(city.slug) })),
    ...servicePages.map((service) => ({ loc: servicePath(service.slug) })),
    ...projects.map((project) => ({
      loc: `/realizacje/${project.slug}`,
      ...(project.image
        ? { images: [{ loc: new URL(project.image, site).href, title: project.title }] }
        : {}),
    })),
    ...posts.map((post) => ({
      loc: `/blog/${post.slug}`,
      lastmod: post.updatedAt,
      ...(post.cover
        ? { images: [{ loc: new URL(post.cover, site).href, title: post.title }] }
        : {}),
    })),
  ]
})
