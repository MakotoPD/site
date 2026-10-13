export default defineEventHandler(async (event) => {
  const result = await sql('DELETE FROM posts WHERE id::text=$1', [getRouterParam(event, 'id')!])
  if (!result.rowCount)
    throw createError({ statusCode: 404, statusMessage: 'Nie znaleziono wpisu.' })
  return { success: true }
})
