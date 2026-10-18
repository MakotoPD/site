export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') || ''
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id))
    throw createError({ statusCode: 404 })
  const row = (
    await sql<{ mime: string; name: string; object_key: string }>(
      'SELECT mime,name,object_key FROM media WHERE id=$1',
      [id],
    )
  ).rows[0]
  if (!row) throw createError({ statusCode: 404 })
  const published = !!(
    await sql(
      `SELECT 1 FROM post_media m JOIN posts p ON p.id=m.post_id WHERE m.media_id=$1 AND p.value->>'status'='published'
      UNION ALL SELECT 1 FROM portfolio WHERE strpos(value::text, $2) > 0 LIMIT 1`,
      [id, '/api/media/' + id],
    )
  ).rowCount
  if (!published) {
    try {
      await requireAdmin(event)
    } catch {
      throw createError({ statusCode: 404 })
    }
  }
  setHeader(event, 'Content-Type', row.mime)
  setHeader(event, 'Cache-Control', published ? 'public, max-age=300' : 'private, no-store')
  if (row.mime === 'application/pdf')
    setHeader(
      event,
      'Content-Disposition',
      "attachment; filename*=UTF-8''" + encodeURIComponent(row.name),
    )
  try {
    return await storage().get(row.object_key)
  } catch {
    throw createError({ statusCode: 503, statusMessage: 'Plik jest chwilowo niedostępny.' })
  }
})
