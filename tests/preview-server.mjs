// Isolated local browser QA server. Its generated namespace contains disposable test data.
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { randomBytes, scryptSync } from 'node:crypto'
import pg from 'pg'
import { createObjectStore } from '../server/storage/objects.ts'
import { turnstileTestSecretKey, turnstileTestSiteKey } from '../shared/turnstile.ts'
if (existsSync('.env')) process.loadEnvFile('.env')
const isolation = randomBytes(8).toString('hex'),
  schema = 'makoto_test_' + isolation,
  prefix = 'makoto-studio/tests/' + isolation
const databaseUrl = process.env.NUXT_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl || !['localhost', '127.0.0.1'].includes(new URL(databaseUrl).hostname))
  throw new Error('Browser QA requires local PostgreSQL')
const pool = new pg.Pool({
  connectionString: databaseUrl,
  options: '-c search_path=' + schema,
  max: 1,
})
const store = createObjectStore({
  accountId: process.env.R2_ACCOUNT_ID || '',
  accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  bucketName: process.env.R2_BUCKET_NAME || '',
  endpoint: process.env.R2_ENDPOINT || '',
  prefix,
})
const password = randomBytes(24).toString('base64url'),
  salt = randomBytes(16).toString('hex'),
  port = process.env.QA_PORT || '3013'
const child = spawn(process.execPath, ['.output/server/index.mjs'], {
  env: {
    ...process.env,
    NODE_ENV: 'test',
    PORT: port,
    HOST: '127.0.0.1',
    NUXT_PUBLIC_SITE_URL: `http://127.0.0.1:${port}`,
    NUXT_PUBLIC_INDEXABLE: 'false',
    NUXT_DATABASE_URL: databaseUrl,
    NUXT_DATABASE_SCHEMA: schema,
    NUXT_R2_PREFIX: prefix,
    NUXT_PUBLIC_TURNSTILE_SITE_KEY: turnstileTestSiteKey,
    NUXT_TURNSTILE_SECRET_KEY: turnstileTestSecretKey,
    NUXT_ADMIN_EMAIL: 'qa@example.com',
    NUXT_ADMIN_PASSWORD_HASH: salt + ':' + scryptSync(password, salt, 64).toString('hex'),
  },
  stdio: ['ignore', 'pipe', 'pipe'],
})
console.log(JSON.stringify({ email: 'qa@example.com', password, port, schema }))
child.stdout.pipe(process.stdout)
child.stderr.pipe(process.stderr)
let closing = false
async function stop() {
  if (closing) return
  closing = true
  if (child.exitCode === null) {
    const closed = new Promise((resolve) => child.once('exit', resolve))
    child.kill()
    await closed
  }
  try {
    try {
      for (const row of (await pool.query('SELECT object_key FROM media')).rows)
        await store.remove(row.object_key)
    } catch (error) {
      if (error.code !== '42P01') throw error
    }
    if (!/^makoto_test_[a-f0-9]{16}$/.test(schema)) throw new Error('Unsafe QA cleanup schema')
    await pool.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
  } finally {
    store.close()
    await pool.end()
  }
  process.exit(0)
}
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
child.on('exit', stop)
