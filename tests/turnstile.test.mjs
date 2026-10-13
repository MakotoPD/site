import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isLoopback, validTurnstileResult } from '../shared/turnstile.ts'
test('Turnstile requires success, matching hostname and matching form action', () => {
  const result = { success: true, hostname: 'makoto.com.pl', action: 'quote-form' }
  assert.equal(validTurnstileResult(result, 'quote-form', ['makoto.com.pl']), true)
  assert.equal(
    validTurnstileResult({ ...result, success: false }, 'quote-form', ['makoto.com.pl']),
    false,
  )
  assert.equal(validTurnstileResult(result, 'contact-form', ['makoto.com.pl']), false)
  assert.equal(validTurnstileResult(result, 'quote-form', ['evil.example']), false)
  assert.equal(validTurnstileResult({ success: true }, 'quote-form', ['makoto.com.pl']), false)
})
test('official dummy results still require success; development hosts are restricted', () => {
  assert.equal(validTurnstileResult({ success: true }, 'quote-form', ['makoto.com.pl'], true), true)
  assert.equal(
    validTurnstileResult({ success: false }, 'quote-form', ['makoto.com.pl'], true),
    false,
  )
  assert.equal(isLoopback('127.0.0.1'), true)
  assert.equal(isLoopback('localhost.evil.example'), false)
  assert.equal(isLoopback('makoto.com.pl'), false)
})
