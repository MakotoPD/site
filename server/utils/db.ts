import pg, { type PoolClient, type QueryResultRow } from 'pg'
import { env } from 'node:process'
import { randomUUID } from 'node:crypto'
import { defaultSettings, projects } from '#shared/defaults'
import seeds from '../data/seed.json'
import legacyArticles from '../data/legacy-articles.json'
import { safeSchema, schemaDDL } from '../database/schema'
import type { Lead, Post, Project, SiteSettings } from '#shared/types'
let pool: pg.Pool | undefined, initialization: Promise<void> | undefined
// Retention promised in the privacy policy. Both conditions must hold, so a lead with a
// damaged updatedAt is never removed before it is three years old. ISO dates compare as text.
export const expiredLeadsSQL = `DELETE FROM leads WHERE created_at < now() - interval '3 years'
  AND (value->>'updatedAt') COLLATE "C" < to_char((now() - interval '3 years') AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')`
async function initialize(database: pg.Pool) {
  const config = useRuntimeConfig(),
    schema = safeSchema(config.databaseSchema),
    client = await database.connect()
  try {
    await client.query('BEGIN')
    await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', ['makoto-storage:' + schema])
    await client.query(schemaDDL(schema))
    await client.query('INSERT INTO settings VALUES(1,$1::jsonb) ON CONFLICT(id) DO NOTHING', [
      JSON.stringify(defaultSettings),
    ])
    await client.query('INSERT INTO portfolio VALUES(1,$1::jsonb) ON CONFLICT(id) DO NOTHING', [
      JSON.stringify(projects),
    ])
    await client.query(expiredLeadsSQL)
    const version = hashToken(config.adminPasswordHash + ':' + config.adminEmail)
    const previous = (await client.query('SELECT value FROM security_meta WHERE id=1 FOR UPDATE'))
      .rows[0]
    if (previous?.value !== version) {
      await client.query('DELETE FROM sessions')
      await client.query(
        'INSERT INTO security_meta VALUES(1,$1) ON CONFLICT(id) DO UPDATE SET value=excluded.value',
        [version],
      )
    }
    if (!(await client.query("SELECT 1 FROM markers WHERE key='legacy-imported'")).rowCount) {
      for (const article of legacyArticles) {
        const post: Post = {
          ...article,
          id: randomUUID(),
          status: 'published',
          createdAt: article.publishedAt,
          publishedAt: article.publishedAt,
        }
        await client.query('INSERT INTO posts VALUES($1,$2,$3::jsonb) ON CONFLICT DO NOTHING', [
          post.id,
          post.slug,
          JSON.stringify(post),
        ])
      }
      await client.query("INSERT INTO markers VALUES('legacy-imported','1') ON CONFLICT DO NOTHING")
    }
    if (!(await client.query("SELECT 1 FROM markers WHERE key='seeded'")).rowCount) {
      for (const seed of seeds) {
        const now = new Date().toISOString()
        const post = {
          ...seed,
          id: randomUUID(),
          status: 'published',
          createdAt: now,
          updatedAt: now,
          publishedAt: now,
        }
        await client.query('INSERT INTO posts VALUES($1,$2,$3::jsonb) ON CONFLICT DO NOTHING', [
          post.id,
          post.slug,
          JSON.stringify(post),
        ])
      }
      await client.query("INSERT INTO markers VALUES('seeded','1') ON CONFLICT DO NOTHING")
    }
    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
export async function database() {
  const config = useRuntimeConfig()
  const url = config.databaseUrl || env.DATABASE_URL
  if (!url) throw createError({ statusCode: 503, statusMessage: 'Skonfiguruj PostgreSQL w .env.' })
  if (
    env.NODE_ENV === 'test' &&
    (!/^makoto_test_[a-f0-9]{16}$/.test(config.databaseSchema) ||
      !['localhost', '127.0.0.1'].includes(new URL(url).hostname))
  )
    throw createError({
      statusCode: 503,
      statusMessage: 'Test wymaga osobnego lokalnego schematu PostgreSQL.',
    })
  if (!pool) {
    pool = new pg.Pool({
      connectionString: url,
      max: 8,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      options: '-c search_path=' + safeSchema(config.databaseSchema),
    })
    pool.on('error', () => {
      console.error('PostgreSQL: przerwane bezczynne połączenie.')
    })
  }
  initialization ||= initialize(pool).catch(() => {
    initialization = undefined
    throw createError({ statusCode: 503, statusMessage: 'PostgreSQL jest chwilowo niedostępny.' })
  })
  await initialization
  return pool
}
export async function sql<T extends QueryResultRow = QueryResultRow>(
  query: string,
  values: unknown[] = [],
) {
  return (await database()).query<T>(query, values)
}
export async function databaseTransaction<T>(run: (client: PoolClient) => Promise<T>) {
  const client = await (await database()).connect()
  try {
    await client.query('BEGIN')
    const result = await run(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
export async function closeDatabase() {
  await pool?.end()
  pool = undefined
  initialization = undefined
}
export async function getSettings(): Promise<SiteSettings> {
  const row = (await sql<{ value: SiteSettings }>('SELECT value FROM settings WHERE id=1')).rows[0]
  return { ...defaultSettings, ...row?.value }
}
export async function allProjects(): Promise<Project[]> {
  return (
    (await sql<{ value: Project[] }>('SELECT value FROM portfolio WHERE id=1')).rows[0]?.value || []
  )
}
export async function allPosts(): Promise<Post[]> {
  return (
    await sql<{ value: Post }>("SELECT value FROM posts ORDER BY value->>'updatedAt' DESC")
  ).rows.map((row) => row.value)
}
export async function allLeads(): Promise<Lead[]> {
  return (await sql<{ value: Lead }>('SELECT value FROM leads ORDER BY created_at DESC')).rows.map(
    (row) => row.value,
  )
}
