import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import pg from 'pg'
import { safeSchema, schemaDDL } from '../server/database/schema.ts'
import { createObjectStore, mediaReferences } from '../server/storage/objects.ts'
if (existsSync('.env')) process.loadEnvFile('.env')
const env = process.env,
  schema = safeSchema(env.NUXT_DATABASE_SCHEMA || 'makoto_studio')
if (!env.NUXT_DATABASE_URL && !env.DATABASE_URL) throw new Error('Uzupełnij NUXT_DATABASE_URL.')
const pool = new pg.Pool({
  connectionString: env.NUXT_DATABASE_URL || env.DATABASE_URL,
  options: '-c search_path=' + schema,
  max: 1,
  connectionTimeoutMillis: 10000,
})
const sourcePath = resolve('.data/makoto.sqlite')
if (!existsSync(sourcePath)) {
  console.log(
    'Brak starej bazy SQLite. Nowa baza zostanie przygotowana przy uruchomieniu aplikacji.',
  )
  await pool.end()
  process.exit(0)
}
const source = new DatabaseSync(sourcePath, { readOnly: true }),
  client = await pool.connect()
let store
const summary = { posts: 0, leads: 0, media: 0, settings: 0 }
try {
  await client.query('BEGIN')
  await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', ['makoto-storage:' + schema])
  await client.query(schemaDDL(schema))
  if ((await client.query("SELECT 1 FROM markers WHERE key='sqlite-migrated'")).rowCount) {
    console.log('Migracja została już wykonana; zachowano aktualne dane PostgreSQL.')
    await client.query('ROLLBACK')
  } else {
    for (const row of source.prepare('SELECT id,value FROM settings').all())
      summary.settings += (
        await client.query('INSERT INTO settings VALUES($1,$2::jsonb) ON CONFLICT(id) DO NOTHING', [
          row.id,
          row.value,
        ])
      ).rowCount
    const media = source.prepare('SELECT * FROM media').all()
    if (media.length)
      store = createObjectStore({
        accountId: env.R2_ACCOUNT_ID || '',
        accessKeyId: env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: env.R2_SECRET_ACCESS_KEY || '',
        bucketName: env.R2_BUCKET_NAME || '',
        endpoint: env.R2_ENDPOINT || '',
        prefix: env.NUXT_R2_PREFIX || 'makoto-studio',
      })
    for (const file of media) {
      if (!/^[0-9a-f-]{36}$/.test(file.id))
        throw new Error('Nieprawidłowy identyfikator starego pliku.')
      if ((await client.query('SELECT 1 FROM media WHERE id=$1', [file.id])).rowCount) continue
      const bytes = readFileSync(resolve('.data/media', file.id)),
        ext = {
          'image/jpeg': 'jpg',
          'image/png': 'png',
          'image/webp': 'webp',
          'application/pdf': 'pdf',
        }[file.mime]
      if (!ext) throw new Error('Nieobsługiwany format starego pliku.')
      const key = `${store.config.prefix}/media/${file.id}.${ext}`
      await store.put(key, bytes, file.mime)
      await client.query('INSERT INTO media(id,mime,name,object_key,size) VALUES($1,$2,$3,$4,$5)', [
        file.id,
        file.mime,
        file.name,
        key,
        bytes.length,
      ])
      summary.media++
    }
    for (const row of source.prepare('SELECT * FROM posts').all()) {
      summary.posts += (
        await client.query('INSERT INTO posts VALUES($1,$2,$3::jsonb) ON CONFLICT DO NOTHING', [
          row.id,
          row.slug,
          row.value,
        ])
      ).rowCount
      const post = JSON.parse(row.value)
      for (const id of mediaReferences([post.cover, post.document]))
        await client.query(
          'INSERT INTO post_media SELECT $1,id FROM media WHERE id=$2 ON CONFLICT DO NOTHING',
          [row.id, id],
        )
    }
    for (const row of source.prepare('SELECT * FROM leads').all())
      summary.leads += (
        await client.query('INSERT INTO leads VALUES($1,$2::jsonb,$3) ON CONFLICT(id) DO NOTHING', [
          row.id,
          row.value,
          row.created_at,
        ])
      ).rowCount
    for (const row of source.prepare('SELECT * FROM sessions').all())
      await client.query('INSERT INTO sessions VALUES($1,$2) ON CONFLICT(token) DO NOTHING', [
        row.token,
        row.expires,
      ])
    for (const row of source.prepare('SELECT * FROM security_meta').all())
      await client.query('INSERT INTO security_meta VALUES($1,$2) ON CONFLICT(id) DO NOTHING', [
        row.id,
        row.value,
      ])
    for (const key of ['seeded', 'legacy-imported', 'sqlite-migrated'])
      await client.query('INSERT INTO markers VALUES($1,$2) ON CONFLICT(key) DO NOTHING', [
        key,
        new Date().toISOString(),
      ])
    await client.query('COMMIT')
    console.log('Migracja do PostgreSQL i R2 zakończona:', JSON.stringify(summary))
    console.log('Oryginalna .data/makoto.sqlite oraz lokalne pliki pozostały jako kopia.')
  }
} catch (error) {
  await client.query('ROLLBACK')
  throw new Error(
    'Migracja nie została zatwierdzona. Kod błędu: ' + (error.code || error.name || 'unknown'),
  )
} finally {
  store?.close()
  source.close()
  client.release()
  await pool.end()
}
