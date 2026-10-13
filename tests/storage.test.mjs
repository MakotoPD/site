import { test } from 'node:test'
import assert from 'node:assert/strict'
import { safeSchema, schemaDDL } from '../server/database/schema.ts'
import {
  createObjectStore,
  mediaReferences,
  validateR2Settings,
} from '../server/storage/objects.ts'
const config = {
  accountId: 'a'.repeat(32),
  accessKeyId: 'test',
  secretAccessKey: 'test',
  bucketName: 'test-bucket',
  endpoint: 'https://' + 'a'.repeat(32) + '.eu.r2.cloudflarestorage.com',
  prefix: 'makoto-studio',
}
test('PostgreSQL schema names cannot escape their dedicated namespace', () => {
  assert.equal(safeSchema('makoto_studio'), 'makoto_studio')
  for (const value of ['public', 'pg_catalog', 'x;DROP SCHEMA public', 'x"', '../other'])
    assert.throws(() => safeSchema(value))
  assert.match(schemaDDL('makoto_studio'), /jsonb NOT NULL/)
  assert.match(schemaDDL('makoto_studio'), /ON DELETE CASCADE/)
})
test('R2 accepts EU endpoint, rejects arbitrary hosts and keeps object operations in its prefix', async () => {
  assert.equal(validateR2Settings(config).endpoint, config.endpoint)
  assert.throws(() => validateR2Settings({ ...config, endpoint: 'http://example.com' }))
  assert.throws(() => validateR2Settings({ ...config, endpoint: 'https://example.com' }))
  assert.throws(() => validateR2Settings({ ...config, prefix: '../private' }))
  const store = createObjectStore(config)
  try {
    await assert.rejects(store.remove('private/other-file'), /spoza katalogu/)
    await assert.rejects(store.get('makoto-studio/../other'), /spoza katalogu/)
  } finally {
    store.close()
  }
})
test('media relations collect only valid local IDs from covers and rich content', () => {
  const id = '12345678-1234-1234-1234-123456789abc'
  assert.deepEqual(
    [
      ...mediaReferences({
        cover: '/api/media/' + id,
        document: { attrs: { src: '/api/media/' + id + '?size=big' } },
      }),
    ],
    [id],
  )
  assert.equal(mediaReferences({ src: 'https://other.example/api/media/' + id }).size, 0)
})
