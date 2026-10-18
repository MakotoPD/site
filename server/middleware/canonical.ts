import { knownRedirects } from '#shared/seo'
import { locations, localPath } from '#shared/locations'
export default defineEventHandler(async (event) => {
  if (!['GET', 'HEAD'].includes(event.method) || event.path.startsWith('/api/')) return
  const url = getRequestURL(event),
    path = url.pathname
  if (path.startsWith('//')) return
  const normalized = path.length > 1 ? path.replace(/\/+$/, '') : path
  let target = knownRedirects[normalized]
  const city = locations.find((c) => normalized === '/pl' + localPath(c.slug))
  if (city) target = localPath(city.slug)
  const work = normalized.match(/^\/(?:pl\/)?work\/([^/]+)$/)?.[1]
  if (work && (await allProjects()).some((p) => p.slug === work)) target = '/realizacje/' + work
  if (!target && normalized.startsWith('/pl/blog/')) {
    const slug = normalized.slice('/pl/blog/'.length)
    if ((await allPosts()).some((p) => p.slug === slug && p.status === 'published'))
      target = '/blog/' + slug
  }
  if (!target && normalized !== path) target = normalized
  if (target && target !== path) return sendRedirect(event, target + url.search, 301)
})
