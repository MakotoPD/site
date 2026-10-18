import { z } from 'zod'
import { mediaReferences } from '../../storage/objects'
export default defineEventHandler(async (event) => {
  const data = validate(z.array(projectSchema).max(100), await safeBody(event, 300000))
  if (new Set(data.map((p) => p.slug)).size !== data.length)
    throw createError({ statusCode: 400, statusMessage: 'Adresy realizacji muszą być unikalne.' })
  const referenced = [...mediaReferences(data.map((p) => p.image))]
  if (
    referenced.length &&
    (await sql('SELECT id FROM media WHERE id=ANY($1::uuid[])', [referenced])).rowCount !==
      referenced.length
  )
    throw createError({ statusCode: 400, statusMessage: 'Nie znaleziono zdjęcia realizacji.' })
  await sql('UPDATE portfolio SET value=$1::jsonb WHERE id=1', [JSON.stringify(data)])
  return data
})
