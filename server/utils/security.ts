import { createHash, scryptSync, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'
export const cookieName = 'makoto_session'
export function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}
export function passwordMatches(password: string, hash: string) {
  const [salt, encoded] = hash.split(':')
  if (!salt || !encoded || !/^[a-f0-9]{128}$/.test(encoded)) return false
  const actual = scryptSync(password, salt, 64)
  return timingSafeEqual(actual, Buffer.from(encoded, 'hex'))
}
export async function requireAdmin(event: H3Event) {
  const token = getCookie(event, cookieName)
  if (!token || token.length > 100)
    throw createError({ statusCode: 401, statusMessage: 'Zaloguj się do panelu.' })
  const session = (
    await sql<{ expires: string }>('SELECT expires FROM sessions WHERE token=$1', [
      hashToken(token),
    ])
  ).rows[0]
  if (!session || Number(session.expires) < Date.now())
    throw createError({ statusCode: 401, statusMessage: 'Sesja wygasła. Zaloguj się ponownie.' })
}
export function checkOrigin(event: H3Event) {
  const origin = getHeader(event, 'origin')
  const own = getRequestURL(event).origin
  const configured = useRuntimeConfig(event).public.siteUrl
  if (!origin || (origin !== own && origin !== configured))
    throw createError({ statusCode: 403, statusMessage: 'Niedozwolone źródło żądania.' })
}
// Behind a reverse proxy every visitor shares the proxy's socket address, so a single client
// could exhaust the limits for everyone. The forwarded address is trusted only when the peer
// is a local proxy, or when NUXT_CLIENT_IP_HEADER names the header set by the edge (default:
// Cloudflare's cf-connecting-ip, so the origin must only accept traffic from Cloudflare).
// The last list entry is the one appended by the nearest proxy.
const privatePeer =
  /^(?:::ffff:)?(?:127\.|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.)|^::1$|^f[cd]/i
export function clientIp(event: H3Event) {
  const peer = event.node.req.socket.remoteAddress || 'unknown'
  const configured = useRuntimeConfig(event).clientIpHeader
  const forwarded = getHeader(event, configured || 'x-forwarded-for')
    ?.split(',')
    .at(-1)
    ?.trim()
  return forwarded && (configured || privatePeer.test(peer)) ? forwarded : peer
}
export async function rateLimit(event: H3Event, scope: string, max = 5, minutes = 15) {
  const key = hashToken(`${scope}:${clientIp(event)}`)
  const now = Date.now()
  await sql('DELETE FROM rate_limits WHERE expires < $1', [now])
  const entry = (
    await sql<{ count: number }>(
      'INSERT INTO rate_limits VALUES($1,1,$2) ON CONFLICT(key) DO UPDATE SET count=rate_limits.count+1 RETURNING count',
      [key, now + minutes * 60000],
    )
  ).rows[0]
  if (!entry || entry.count > max)
    throw createError({ statusCode: 429, statusMessage: 'Za dużo prób. Spróbuj ponownie później.' })
}
export async function safeBody(event: H3Event, limit = 100_000) {
  // A declared length is required: a chunked body would be buffered in full before any check.
  if (!(Number(getHeader(event, 'content-length')) <= limit))
    throw createError({ statusCode: 413, statusMessage: 'Zbyt duże żądanie.' })
  const body = await readRawBody(event)
  if (!body || Buffer.byteLength(body) > limit)
    throw createError({ statusCode: 400, statusMessage: 'Nieprawidłowe dane.' })
  try {
    return JSON.parse(body)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Nieprawidłowe dane JSON.' })
  }
}
