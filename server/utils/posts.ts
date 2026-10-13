import { randomUUID } from 'node:crypto'
import { normalizeRichDocument, richDocumentMarkdown, type RichNode } from '#shared/rich-content'
import { markdownToDocument } from '#shared/markdown'
import { mediaReferences } from '../storage/objects'
import type { Post } from '#shared/types'
export async function savePost(event: import('h3').H3Event, id?: string) {
  const data = validate(postSchema, await safeBody(event, 500000))
  let document: RichNode | undefined
  try {
    if (data.document !== undefined) document = normalizeRichDocument(data.document)
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Nieprawidłowa treść wpisu.',
      message: error instanceof Error ? error.message : 'Sprawdź treść wpisu.',
    })
  }
  const content = document ? richDocumentMarkdown(document) : data.content
  if (content.trim().length < 20 || content.length > 80000)
    throw createError({
      statusCode: 400,
      statusMessage: 'Treść wpisu musi mieć od 20 do 80000 znaków.',
    })
  const referenced = [...mediaReferences([data.cover, document || markdownToDocument(content)])]
  try {
    return await databaseTransaction(async (client) => {
      const existing = id
        ? (
            await client.query<{ value: Post }>(
              'SELECT value FROM posts WHERE id::text=$1 FOR UPDATE',
              [id],
            )
          ).rows[0]?.value
        : undefined
      if (id && !existing)
        throw createError({ statusCode: 404, statusMessage: 'Nie znaleziono wpisu.' })
      if (
        referenced.length &&
        (await client.query('SELECT id FROM media WHERE id=ANY($1::uuid[])', [referenced]))
          .rowCount !== referenced.length
      )
        throw createError({
          statusCode: 400,
          statusMessage: 'Nie znaleziono zdjęcia lub pliku użytego we wpisie.',
        })
      const now = new Date().toISOString()
      const post = {
        ...data,
        content,
        document,
        id: existing?.id || randomUUID(),
        createdAt: existing?.createdAt || now,
        updatedAt: now,
        publishedAt: data.status === 'published' ? existing?.publishedAt || now : null,
      }
      if (existing)
        await client.query('UPDATE posts SET slug=$1,value=$2::jsonb WHERE id=$3', [
          post.slug,
          JSON.stringify(post),
          post.id,
        ])
      else
        await client.query('INSERT INTO posts VALUES($1,$2,$3::jsonb)', [
          post.id,
          post.slug,
          JSON.stringify(post),
        ])
      await client.query('DELETE FROM post_media WHERE post_id=$1', [post.id])
      for (const mediaId of referenced)
        await client.query('INSERT INTO post_media VALUES($1,$2)', [post.id, mediaId])
      return post
    })
  } catch (error) {
    if ((error as { code?: string }).code === '23505')
      throw createError({ statusCode: 409, statusMessage: 'Ten adres wpisu już istnieje.' })
    throw error
  }
}
