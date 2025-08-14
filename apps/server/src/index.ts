/** biome-ignore-all lint/suspicious/noExplicitAny: for error */
import { trpcServer } from '@hono/trpc-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { env } from './env';
import { auth } from './lib/auth';
import { createContext } from './lib/context';
import type { AppBindings } from './lib/types';
import { errorHandler } from './middlewares/error-handler';
import { appRouter } from './routers/index';

const app = new Hono<AppBindings>();

app.use(logger());
app.use(
  '/*',
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use('*', errorHandler);

app.on(['POST', 'GET'], '/api/auth/**', (c) => auth.handler(c.req.raw));

app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext: (_opts, context) => createContext({ context }),
  })
);

app.get('/', (c) => c.text('OK'));

app.notFound((c) =>
  c.json(
    {
      status: 404,
      error: 'NotFound',
      message: `Route ${c.req.method} ${c.req.path} not found`,
    },
    404
  )
);

app.onError((err, c) => {
  const isProd = env.ENVIRONMENT === 'production';
  const status = (err as any)?.status ?? 500;
  return c.json(
    {
      status,
      error: err.name ?? 'Error',
      message: err.message ?? 'Internal Server Error',
      stack: isProd ? undefined : (err as any)?.stack,
    },
    status
  );
});

export default app;
