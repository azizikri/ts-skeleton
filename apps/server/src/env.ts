import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  ENVIRONMENT: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_URL: z.url(),
  CORS_ORIGIN: z.url(),
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.url(),
});

export const env = envSchema.parse(process.env);
export type Environment = {
  Bindings: z.infer<typeof envSchema>;
};
