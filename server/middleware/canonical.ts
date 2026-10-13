import { knownRedirects } from '#shared/seo'
import { locations, localPath } from '#shared/locations'
import { projects } from '#shared/defaults'
export default defineEventHandler(async (event) => {
  if (!['GET', 'HEAD'].includes(event.method) || event.path.startsWith('/api/')) return
  const url = getRequestURL(event),
    path = url.pathname
  if (path.startsWith('//')) return
  const normalized = path.length > 1 ? path.replace(/\/+$/, '') : path
  let target = knownRedirects[normalized]
  const city = locations.find((c) => normalized === '/pl' + localPath(c.slug))
  if (city) target = localPath(city.slug)
  const project = projects.find(
    (p) => normalized === '/work/' + p.slug || normalized === '/pl/work/' + p.slug,
  )
  if (project) target = '/realizacje/' + project.slug
  if (!target && normalized.startsWith('/pl/blog/')) {
    const slug = normalized.slice('/pl/blog/'.length)
    if ((await allPosts()).some((p) => p.slug === slug && p.status === 'published'))
      target = '/blog/' + slug
  }
  if (!target && normalized !== path) target = normalized
  if (target && target !== path) return sendRedirect(event, target + url.search, 301)
})
