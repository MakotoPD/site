import { normalizeRichDocument, richText } from '#shared/rich-content'
import { markdownToDocument } from '#shared/markdown'
import { renderRichDocument } from '#shared/rich-render'
export default defineEventHandler(async (event) => {
  const post = (await allPosts()).find(
    (p) => p.slug === getRouterParam(event, 'slug') && p.status === 'published',
  )
  if (!post) throw createError({ statusCode: 404, statusMessage: 'Nie znaleziono wpisu.' })
  const { content, document, ...metadata } = post
  const article = normalizeRichDocument(document || markdownToDocument(content))
  return {
    ...metadata,
    html: renderRichDocument(article),
    readingMinutes: Math.max(1, Math.ceil(richText(article).trim().split(/\s+/).length / 200)),
  }
})
