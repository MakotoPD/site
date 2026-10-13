import { z } from 'zod'
export const quoteSchema = z.object({
  project: z.string().max(40),
  extras: z.array(z.string().max(40)).max(10),
  monthly: z.array(z.string().max(40)).max(10),
  pages: z.number().int().min(1).max(30),
  languages: z.number().int().min(1).max(5),
  urgent: z.boolean(),
  design: z.enum(['base', 'premium', 'custom', 'unsure']).optional(),
  productRange: z
    .enum(['small', 'medium', 'large', 'extensive', 'enterprise', 'unsure'])
    .optional(),
  productEntry: z.enum(['self', 'makoto', 'unsure']).optional(),
  appPurpose: z.enum(['crm', 'automation', 'booking', 'portal', 'other', 'unsure']).optional(),
})
export const quoteBriefSchema = z.object({
  goal: z.enum(['landing', 'website', 'store', 'application', 'unsure']),
  undecided: z
    .array(
      z.enum([
        'project',
        'pages',
        'languages',
        'cms',
        'copy',
        'identity',
        'motion',
        'integrations',
        'monthly',
        'urgent',
        'design',
        'products',
        'productEntry',
        'appPurpose',
      ]),
    )
    .max(15),
})
export const leadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(200),
  phone: z.string().trim().max(40).default(''),
  company: z.string().trim().max(120).default(''),
  message: z.string().trim().min(10).max(5000),
  city: z.string().trim().max(80).default(''),
  originPage: z
    .string()
    .regex(/^\/[a-z0-9/\-]*$/)
    .max(200)
    .default('/'),
  consent: z.literal(true),
  website: z.string().max(200).default(''),
  token: z.string().max(2048).default(''),
  source: z.enum(['contact', 'calculator']),
  configuration: quoteSchema.optional(),
  brief: quoteBriefSchema.optional(),
})
export const postSchema = z.object({
  title: z.string().trim().min(3).max(180),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(180),
  excerpt: z.string().trim().min(10).max(400),
  content: z.string().max(80000).default(''),
  document: z.unknown().optional(),
  category: z.string().trim().min(2).max(60),
  cover: z.string().regex(/^(?:|\/images\/[a-zA-Z0-9_.-]+|\/api\/media\/[a-f0-9-]+)$/),
  status: z.enum(['draft', 'published']),
})
export function validate<T>(schema: z.ZodType<T>, value: unknown): T {
  const result = schema.safeParse(value)
  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'Sprawdź dane formularza.',
      data: { errors: result.error.flatten() },
    })
  return result.data
}
