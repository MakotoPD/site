export function safeSchema(value: unknown) {
  if (
    typeof value !== 'string' ||
    !/^[a-z][a-z0-9_]{0,62}$/.test(value) ||
    ['public', 'pg_catalog', 'information_schema'].includes(value)
  )
    throw new Error('Nieprawidłowa nazwa schematu PostgreSQL.')
  return value
}
export function schemaDDL(value: string) {
  const schema = safeSchema(value)
  return `CREATE SCHEMA IF NOT EXISTS "${schema}";
    CREATE TABLE IF NOT EXISTS "${schema}".settings (id smallint PRIMARY KEY CHECK(id=1), value jsonb NOT NULL);
    CREATE TABLE IF NOT EXISTS "${schema}".posts (id uuid PRIMARY KEY, slug text NOT NULL UNIQUE, value jsonb NOT NULL);
    CREATE TABLE IF NOT EXISTS "${schema}".leads (id uuid PRIMARY KEY, value jsonb NOT NULL, created_at timestamptz NOT NULL);
    CREATE INDEX IF NOT EXISTS leads_created_at_idx ON "${schema}".leads(created_at DESC);
    CREATE TABLE IF NOT EXISTS "${schema}".sessions (token text PRIMARY KEY, expires bigint NOT NULL);
    CREATE INDEX IF NOT EXISTS sessions_expires_idx ON "${schema}".sessions(expires);
    CREATE TABLE IF NOT EXISTS "${schema}".security_meta (id smallint PRIMARY KEY CHECK(id=1), value text NOT NULL);
    CREATE TABLE IF NOT EXISTS "${schema}".rate_limits (key text PRIMARY KEY, count integer NOT NULL, expires bigint NOT NULL);
    CREATE TABLE IF NOT EXISTS "${schema}".media (id uuid PRIMARY KEY, mime text NOT NULL, name text NOT NULL, object_key text NOT NULL UNIQUE, size integer NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS "${schema}".post_media (post_id uuid NOT NULL REFERENCES "${schema}".posts(id) ON DELETE CASCADE, media_id uuid NOT NULL REFERENCES "${schema}".media(id), PRIMARY KEY(post_id,media_id));
    CREATE INDEX IF NOT EXISTS post_media_media_idx ON "${schema}".post_media(media_id);
    CREATE TABLE IF NOT EXISTS "${schema}".markers (key text PRIMARY KEY, value text NOT NULL);`
}
