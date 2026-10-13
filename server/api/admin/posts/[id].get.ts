export default defineEventHandler(async (event) => {
  const post = (await allPosts()).find((p) => p.id === getRouterParam(event, 'id'))
  if (!post) throw createError({ statusCode: 404, statusMessage: 'Nie znaleziono wpisu.' })
  return post
})
