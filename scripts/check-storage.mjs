import { existsSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import pg from 'pg'
import { createObjectStore } from '../server/storage/objects.ts'
if (existsSync('.env')) process.loadEnvFile('.env')
const env = process.env,
  pool = new pg.Pool({
    connectionString: env.NUXT_DATABASE_URL || env.DATABASE_URL,
    max: 1,
    connectionTimeoutMillis: 10000,
  })
const store = createObjectStore({
  accountId: env.R2_ACCOUNT_ID || '',
  accessKeyId: env.R2_ACCESS_KEY_ID || '',
  secretAccessKey: env.R2_SECRET_ACCESS_KEY || '',
  bucketName: env.R2_BUCKET_NAME || '',
  endpoint: env.R2_ENDPOINT || '',
  prefix: env.NUXT_R2_PREFIX || 'makoto-studio',
})
const key = `${store.config.prefix}/health/${randomUUID()}.txt`,
  bytes = Buffer.from('Makoto storage connection check')
let created = false
try {
  await pool.query('SELECT 1')
  console.log('PASS: PostgreSQL odpowiada.')
  await store.put(key, bytes, 'text/plain')
  created = true
  if (!(await store.get(key)).equals(bytes)) throw new Error('Niezgodna zawartość pliku testowego')
  console.log('PASS: rzeczywisty zapis i odczyt w Cloudflare R2.')
} catch (error) {
  throw new Error(
    'Kontrola magazynu nie powiodła się. Kod: ' + (error.code || error.name || 'unknown'),
  )
} finally {
  if (created) await store.remove(key)
  store.close()
  await pool.end()
}
