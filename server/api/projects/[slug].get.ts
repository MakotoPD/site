import { normalizeRichDocument, richText } from '#shared/rich-content'
import { markdownToDocument } from '#shared/markdown'
import { renderRichDocument } from '#shared/rich-render'
export default defineEventHandler(async (event) => {
  const projects = await allProjects(),
    index = projects.findIndex((p) => p.slug === getRouterParam(event, 'slug'))
  if (index < 0) throw createError({ statusCode: 404, statusMessage: 'Nie znaleziono projektu.' })
  const { document, ...project } = projects[index]!,
    next = projects[(index + 1) % projects.length]!
  const article = normalizeRichDocument(document || markdownToDocument(project.detail))
  return {
    ...project,
    detail: richText(article).replace(/\s+/g, ' ').trim(),
    html: renderRichDocument(article),
    next: { slug: next.slug, title: next.title },
  }
})
