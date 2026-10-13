import { randomBytes } from 'node:crypto'
import { z } from 'zod'
export default defineEventHandler(async (event) => {
  await rateLimit(event, 'login', 8, 15)
  const { email, password, challenge } = validate(
    z.object({
      email: z.email().max(200),
      password: z.string().min(1).max(256),
      challenge: z.string().max(2048).default(''),
    }),
    await safeBody(event, 5000),
  )
  const config = useRuntimeConfig(event)
  if (!config.adminPasswordHash || !config.adminEmail)
    throw createError({
      statusCode: 503,
      statusMessage: 'Skonfiguruj administratora: npm run admin:setup.',
    })
  await requireTurnstile(event, challenge, 'admin-login')
  const valid = passwordMatches(password, config.adminPasswordHash)
  if (email.toLowerCase() !== config.adminEmail.toLowerCase() || !valid)
    throw createError({ statusCode: 401, statusMessage: 'Nieprawidłowy e-mail lub hasło.' })
  const token = randomBytes(32).toString('hex'),
    expires = Date.now() + 12 * 60 * 60 * 1000
  await sql('DELETE FROM sessions WHERE expires < $1', [Date.now()])
  await sql('INSERT INTO sessions VALUES($1,$2)', [hashToken(token), expires])
  setCookie(event, cookieName, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 43200,
  })
  return { email: config.adminEmail }
})
