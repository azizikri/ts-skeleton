import { createLogger } from '@packages/logger';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db';
import { account, session, user, verification } from '@/db/schema/auth';
import { env } from '@/env';

const authLogger = createLogger({ name: 'auth' });

authLogger.info(
  { env: env.NODE_ENV ?? 'development', db: 'postgres' },
  'initializing better-auth'
);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: { account, session, user, verification },
  }),
  trustedOrigins: [env.CORS_ORIGIN],
  emailAndPassword: { enabled: true },
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
});

export function logAuthError(err: unknown, where: string) {
  authLogger.error({ err }, `auth error: ${where}`);
}

export const authLog = authLogger;
