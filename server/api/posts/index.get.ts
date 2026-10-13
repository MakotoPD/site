export default defineEventHandler(async () =>
  (await allPosts())
    .filter((p) => p.status === 'published')
    .sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''))
    .map(({ content, document, ...post }) => post),
)
