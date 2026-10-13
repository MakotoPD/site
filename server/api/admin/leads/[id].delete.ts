export default defineEventHandler(async (event) => {
  const result = await sql('DELETE FROM leads WHERE id::text=$1', [getRouterParam(event, 'id')!])
  if (!result.rowCount)
    throw createError({ statusCode: 404, statusMessage: 'Nie znaleziono zgłoszenia.' })
  return { success: true }
})
