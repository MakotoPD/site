import { randomUUID } from 'node:crypto'
export default defineEventHandler(async (event) => {
  if (Number(getHeader(event, 'content-length') || 0) > 5500000)
    throw createError({ statusCode: 413, statusMessage: 'Maksymalny rozmiar pliku to 5 MB.' })
  const parts = await readMultipartFormData(event),
    file = parts?.find((part) => part.name === 'file')
  if (!file || file.data.length > 5000000)
    throw createError({ statusCode: 400, statusMessage: 'Wybierz plik do 5 MB.' })
  const mime = await detectedFileMime(file.data)
  if (!mime)
    throw createError({
      statusCode: 400,
      statusMessage: 'Obsługiwane formaty: JPG, PNG, WebP i PDF.',
    })
  const data = mime.startsWith('image/')
    ? await withoutMetadata(file.data).catch(() => {
        throw createError({ statusCode: 400, statusMessage: 'Nie udało się przetworzyć zdjęcia.' })
      })
    : file.data
  const id = randomUUID(),
    store = storage(),
    extension = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'application/pdf': 'pdf',
    }[mime]
  const key = `${store.config.prefix}/media/${id}.${extension}`
  try {
    await store.put(key, data, mime)
  } catch {
    throw createError({
      statusCode: 503,
      statusMessage: 'Nie udało się zapisać pliku w R2. Spróbuj ponownie.',
    })
  }
  try {
    await sql('INSERT INTO media(id,mime,name,object_key,size) VALUES($1,$2,$3,$4,$5)', [
      id,
      mime,
      (file.filename || 'Plik').slice(0, 200),
      key,
      data.length,
    ])
  } catch {
    await store.remove(key).catch(() => {})
    throw createError({
      statusCode: 503,
      statusMessage: 'Nie udało się zapisać informacji o pliku.',
    })
  }
  return { url: `/api/media/${id}`, mime }
})
