import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
export interface R2Settings {
  accountId: string
  accessKeyId: string
  secretAccessKey: string
  bucketName: string
  endpoint: string
  prefix: string
}
export function validateR2Settings(input: R2Settings) {
  if (
    !/^[a-f0-9]{32}$/.test(input.accountId) ||
    !input.accessKeyId ||
    !input.secretAccessKey ||
    !/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(input.bucketName)
  )
    throw new Error('Uzupełnij konfigurację R2 w .env.')
  const endpoint = new URL(input.endpoint || `https://${input.accountId}.r2.cloudflarestorage.com`)
  if (
    endpoint.protocol !== 'https:' ||
    endpoint.username ||
    endpoint.password ||
    endpoint.search ||
    endpoint.hash ||
    ![
      `${input.accountId}.r2.cloudflarestorage.com`,
      `${input.accountId}.eu.r2.cloudflarestorage.com`,
      `${input.accountId}.fedramp.r2.cloudflarestorage.com`,
    ].includes(endpoint.hostname) ||
    endpoint.pathname !== '/'
  )
    throw new Error('Nieprawidłowy endpoint Cloudflare R2.')
  const prefix = input.prefix.replace(/\/$/, '')
  if (!/^[a-z0-9][a-z0-9_/-]{0,99}$/.test(prefix) || prefix.includes('//'))
    throw new Error('Nieprawidłowy katalog R2.')
  return { ...input, endpoint: endpoint.origin, prefix }
}
export function createObjectStore(input: R2Settings) {
  const config = validateR2Settings(input)
  const client = new S3Client({
    region: 'auto',
    endpoint: config.endpoint,
    forcePathStyle: true,
    maxAttempts: 2,
    credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
  })
  function owned(key: string) {
    if (!key.startsWith(config.prefix + '/') || key.includes('..') || key.includes('\\'))
      throw new Error('Plik spoza katalogu nowej strony.')
    return key
  }
  return {
    config,
    async put(key: string, data: Buffer, mime: string) {
      await client.send(
        new PutObjectCommand({
          Bucket: config.bucketName,
          Key: owned(key),
          Body: data,
          ContentType: mime,
          CacheControl: 'private, no-store',
        }),
      )
    },
    async get(key: string) {
      const result = await client.send(
        new GetObjectCommand({ Bucket: config.bucketName, Key: owned(key) }),
      )
      if (!result.Body) throw new Error('Nie znaleziono pliku.')
      return Buffer.from(await result.Body.transformToByteArray())
    },
    async remove(key: string) {
      await client.send(new DeleteObjectCommand({ Bucket: config.bucketName, Key: owned(key) }))
    },
    close() {
      client.destroy()
    },
  }
}
export function mediaReferences(value: unknown, found = new Set<string>()): Set<string> {
  if (typeof value === 'string') {
    const match = value.match(
      /^\/api\/media\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:[?#].*)?$/i,
    )
    if (match) found.add(match[1]!.toLowerCase())
    return found
  }
  if (Array.isArray(value)) value.forEach((item) => mediaReferences(item, found))
  else if (value && typeof value === 'object')
    for (const item of Object.values(value)) mediaReferences(item, found)
  return found
}
