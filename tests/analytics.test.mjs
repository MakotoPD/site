import { test } from 'node:test'
import assert from 'node:assert/strict'
import { analyticsAllowed, googleConsent, validConsent } from '../shared/analytics.ts'
test('analytics excludes development, previews, private routes and disabled tracking', () => {
  const allowed = (enabled = true, dev = false, host = 'makoto.com.pl', path = '/') =>
    analyticsAllowed(enabled, dev, host, 'https://makoto.com.pl', path)
  assert.equal(allowed(), true)
  assert.equal(allowed(true, false, 'www.makoto.com.pl'), true)
  assert.equal(allowed(true, true), false)
  assert.equal(allowed(false), false)
  assert.equal(allowed(true, false, '127.0.0.1'), false)
  assert.equal(allowed(true, false, 'preview.example'), false)
  assert.equal(allowed(true, false, 'makoto.com.pl', '/admin/login'), false)
  assert.equal(allowed(true, false, 'makoto.com.pl', '/admin'), false)
})
test('Consent Mode v2 separates analytics and all advertising signals', () => {
  const signals = googleConsent({ analytics: true })
  assert.equal(signals.analytics_storage, 'granted')
  for (const key of ['ad_storage', 'ad_user_data', 'ad_personalization'])
    assert.equal(signals[key], 'denied')
  assert.equal(validConsent({ analytics: 'yes' }), false)
  assert.equal(validConsent(null), false)
  assert.equal(validConsent({ analytics: false }), true)
  // Cookies saved by the previous site keep working.
  assert.equal(validConsent({ analytics: true, marketing: true }), true)
})
