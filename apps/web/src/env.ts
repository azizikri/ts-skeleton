import { z } from 'zod';

const envSchema = z.object({
  VITE_NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  VITE_PORT: z.coerce.number().default(3001),
  VITE_SERVER_URL: z.url(),
});

export const env = envSchema.parse(import.meta.env);
