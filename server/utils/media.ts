import sharp from 'sharp'
import { env } from 'node:process'
import { createObjectStore } from '../storage/objects'
let objectStore: ReturnType<typeof createObjectStore> | undefined
export function storage() {
  try {
    const config = useRuntimeConfig().r2
    if (env.NODE_ENV === 'test' && !/^makoto-studio\/tests\/[a-f0-9]{16}$/.test(config.prefix))
      throw new Error('Test requires isolated R2 prefix')
    objectStore ||= createObjectStore({
      accountId: env.NUXT_R2_ACCOUNT_ID || env.R2_ACCOUNT_ID || config.accountId,
      accessKeyId: env.NUXT_R2_ACCESS_KEY_ID || env.R2_ACCESS_KEY_ID || config.accessKeyId,
      secretAccessKey:
        env.NUXT_R2_SECRET_ACCESS_KEY || env.R2_SECRET_ACCESS_KEY || config.secretAccessKey,
      bucketName: env.NUXT_R2_BUCKET_NAME || env.R2_BUCKET_NAME || config.bucketName,
      endpoint: env.NUXT_R2_ENDPOINT || env.R2_ENDPOINT || config.endpoint,
      prefix: config.prefix,
    })
    return objectStore
  } catch {
    throw createError({ statusCode: 503, statusMessage: 'Skonfiguruj Cloudflare R2 w .env.' })
  }
}
export function closeStorage() {
  objectStore?.close()
  objectStore = undefined
}
// Re-encoding drops EXIF (GPS position, device, capture time) and bakes in its orientation.
// ponytail: sharp's default quality (JPEG/WebP 80); pass per-format options if photos need more.
export function withoutMetadata(data: Buffer) {
  return sharp(data, { animated: true, limitInputPixels: 40000000 }).rotate().toBuffer()
}
export async function detectedFileMime(data: Buffer) {
  const mime = data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    ? 'image/png'
    : data[0] === 255 && data[1] === 216 && data[2] === 255
      ? 'image/jpeg'
      : data.toString('ascii', 0, 4) === 'RIFF' && data.toString('ascii', 8, 12) === 'WEBP'
        ? 'image/webp'
        : data.toString('ascii', 0, 5) === '%PDF-'
          ? 'application/pdf'
          : ''
  if (mime.startsWith('image/')) {
    try {
      const info = await sharp(data, { limitInputPixels: 40000000 }).metadata()
      if (!info.width || !info.height || info.width > 12000 || info.height > 12000) return ''
    } catch {
      return ''
    }
  }
  return mime
}
