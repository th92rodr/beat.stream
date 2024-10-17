import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']),

  DATABASE_URL: z.string().url(),

  HOST: z.string().default('localhost'),
  PORT: z.coerce.number().default(3333),
  CONNECTION_TIMEOUT: z.coerce.number(),
  REQUEST_TIMEOUT: z.coerce.number(),
  CORS_ORIGIN: z.string(),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number(),
  RATE_LIMIT_TIME_WINDOW: z.coerce.number(),
  RATE_LIMIT_BAN: z.coerce.number(),
})

export const env = envSchema.parse(process.env)
