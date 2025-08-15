/** biome-ignore-all lint/suspicious/noEmptyBlockStatements: <for stub logger> */
// biome-ignore-all lint/suspicious/noExplicitAny: <for stub logger>

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { env } from '@/env';
import type { AppBindings } from '@/lib/types';
import { errorHandler } from '@/middlewares/error-handler';

// lightweight logger stub for tests
const stubLogger = {
  info: () => {},
  warn: () => {},
  error: () => {},
  child: () => stubLogger,
} as any;

export function makeTestApp(): Hono<AppBindings> {
  const a = new Hono<AppBindings>();
  a.use(logger());
  a.use(
    '/*',
    cors({
      origin: env.CORS_ORIGIN,
      allowMethods: ['GET', 'POST', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );
  a.use('*', async (c, next) => {
    c.set('logger', stubLogger);
    await next();
  });
  a.use('*', errorHandler);
  return a;
}
