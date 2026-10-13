import { z } from 'zod'
import { defaultSettings } from '#shared/defaults'
const option = z.object({
  id: z.string().max(40),
  label: z.string().min(2).max(100),
  description: z.string().max(200),
  price: z.number().int().min(0).max(1000000),
})
export default defineEventHandler(async (event) => {
  const data = validate(
    z.object({
      email: z.email().max(200),
      name: z.string().min(2).max(100),
      tagline: z.string().min(2).max(120),
      availability: z.string().min(2).max(100),
      phone: z
        .string()
        .trim()
        .regex(/^(?:|\+?[\d ()-]{7,30})$/)
        .default(''),
      streetAddress: z.string().trim().max(150).default(''),
      postalCode: z
        .string()
        .trim()
        .regex(/^(?:|\d{2}-\d{3})$/)
        .default(''),
      addressLocality: z.string().trim().max(100).default(''),
      googleMapsUrl: z
        .string()
        .max(700)
        .refine((v) => {
          if (!v) return true
          try {
            const u = new URL(v)
            return (
              u.protocol === 'https:' &&
              [
                'google.com',
                'www.google.com',
                'maps.google.com',
                'maps.app.goo.gl',
                'g.page',
              ].includes(u.hostname)
            )
          } catch {
            return false
          }
        }, 'Podaj prawidłowy link Google.')
        .default(''),
      projects: z.array(option).length(4),
      extras: z.array(option).length(5),
      monthly: z.array(option).length(2),
      designs: z.array(option).length(3).default(defaultSettings.designs),
      productImports: z.array(option).length(4).default(defaultSettings.productImports),
    }),
    await safeBody(event, 20000),
  )
  for (const key of ['projects', 'extras', 'monthly', 'designs', 'productImports'] as const) {
    if (data[key].some((p, i) => p.id !== defaultSettings[key][i]?.id))
      throw createError({ statusCode: 400, statusMessage: 'Nieprawidłowe identyfikatory cennika.' })
  }
  await sql('UPDATE settings SET value=$1::jsonb WHERE id=1', [JSON.stringify(data)])
  return data
})
