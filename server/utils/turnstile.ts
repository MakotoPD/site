import type { H3Event } from 'h3'
import { env } from 'node:process'
import {
  isLoopback,
  turnstileTestSecretKey,
  turnstileTestToken,
  validTurnstileResult,
  type TurnstileAction,
} from '#shared/turnstile'

export async function requireTurnstile(event: H3Event, token: string, action: TurnstileAction) {
  if (!token || token.length > 2048)
    throw createError({
      statusCode: 422,
      statusMessage: 'Potwierdź zabezpieczenie formularza i spróbuj ponownie.',
    })
  const config = useRuntimeConfig(event)
  const localHost = getRequestURL(event).hostname
  const testing = isLoopback(localHost) && (import.meta.dev || env.NODE_ENV === 'test')
  const secret = testing ? turnstileTestSecretKey : config.turnstile.secretKey
  if (!secret || (!testing && secret === turnstileTestSecretKey))
    throw createError({
      statusCode: 503,
      statusMessage: 'Zabezpieczenie formularza wymaga konfiguracji.',
    })
  if (testing && token !== turnstileTestToken)
    throw createError({
      statusCode: 422,
      statusMessage: 'Zabezpieczenie formularza wygasło. Spróbuj ponownie.',
    })
  let result: { success?: boolean; hostname?: string; action?: string }
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret,
        response: token,
        remoteip: clientIp(event),
      }),
      signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) throw new Error('Verification unavailable')
    result = await response.json()
  } catch {
    throw createError({
      statusCode: 503,
      statusMessage: 'Nie udało się sprawdzić zabezpieczenia. Spróbuj za chwilę.',
    })
  }
  let canonicalHost: string
  try {
    canonicalHost = new URL(config.public.siteUrl).hostname
  } catch {
    throw createError({
      statusCode: 503,
      statusMessage: 'Zabezpieczenie formularza wymaga konfiguracji domeny.',
    })
  }
  const allowedHosts = canonicalHost.startsWith('www.')
    ? [canonicalHost, canonicalHost.slice(4)]
    : [canonicalHost, 'www.' + canonicalHost]
  if (!validTurnstileResult(result, action, allowedHosts, testing))
    throw createError({
      statusCode: 422,
      statusMessage: 'Zabezpieczenie formularza wygasło lub jest nieprawidłowe. Spróbuj ponownie.',
    })
}
