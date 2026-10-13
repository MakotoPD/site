export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') || ''
  if (!/^[a-z0-9/\-]+\.md$/.test(slug)) throw createError({ statusCode: 404 })
  const path = slug === 'index.md' ? '/' : '/' + slug.replace(/\.md$/, '')
  const document = (await seoDocuments()).find((d) => d.path === path)
  if (!document)
    throw createError({ statusCode: 404, statusMessage: 'Nie znaleziono publicznego materiału.' })
  setHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
  setHeader(event, 'X-Robots-Tag', 'noindex')
  return document.markdown
})
