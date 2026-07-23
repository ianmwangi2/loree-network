import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGIN: z.string().min(1, 'CORS_ORIGIN is required'),
  FRONTEND_URL: z.string().min(1, 'FRONTEND_URL is required'),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default('Loree Networks <no-reply@loreenetworks.co.ke>'),
  ADMIN_NOTIFICATION_EMAIL: z.string().email().default('info@loreenetworks.co.ke')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
