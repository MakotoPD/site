import { z } from 'zod'
import { normalizeRichDocument, richDocumentMarkdown } from '#shared/rich-content'
import { mediaReferences } from '../../../storage/objects'
export default defineEventHandler(async (event) => {
  const data = validate(z.array(projectSchema).max(100), await safeBody(event, 2_000_000))
  if (new Set(data.map((p) => p.slug)).size !== data.length)
    throw createError({ statusCode: 400, statusMessage: 'Adresy realizacji muszą być unikalne.' })
  const projects = data.map((project) => {
    let document
    try {
      if (project.document !== undefined) document = normalizeRichDocument(project.document)
    } catch {
      throw createError({ statusCode: 400, statusMessage: `Nieprawidłowy opis: ${project.title}.` })
    }
    // Markdown copy of the description feeds the /ai pages and llms-full.txt.
    const detail = document ? richDocumentMarkdown(document) : project.detail
    if (detail.trim().length < 10 || detail.length > 80000)
      throw createError({
        statusCode: 400,
        statusMessage: `Opis „${project.title}” musi mieć od 10 do 80000 znaków.`,
      })
    return { ...project, document, detail }
  })
  const referenced = [...mediaReferences(projects.map((p) => [p.image, p.document]))]
  if (
    referenced.length &&
    (await sql('SELECT id FROM media WHERE id=ANY($1::uuid[])', [referenced])).rowCount !==
      referenced.length
  )
    throw createError({ statusCode: 400, statusMessage: 'Nie znaleziono zdjęcia realizacji.' })
  await sql('UPDATE portfolio SET value=$1::jsonb WHERE id=1', [JSON.stringify(projects)])
  return projects
})
