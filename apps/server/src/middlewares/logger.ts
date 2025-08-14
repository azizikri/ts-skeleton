import { createLogger } from '@packages/logger';
import type { MiddlewareHandler } from 'hono';
import type { Logger } from 'pino';

export const baseLogger: Logger = createLogger({ name: 'server' });

export const requestLogger: MiddlewareHandler = async (c, next) => {
  const start = Date.now();
  const id = crypto.randomUUID();
  const child = baseLogger.child({
    reqId: id,
    req: {
      method: c.req.method,
      path: c.req.path,
      ip: c.req.header('x-forwarded-for') || c.req.header('cf-connecting-ip'),
    },
  });

  c.set('logger', child);
  try {
    await next();
    const ms = Date.now() - start;
    child.info(
      {
        res: { status: c.res.status },
        duration_ms: ms,
      },
      'request.completed'
    );
  } catch (err) {
    const ms = Date.now() - start;
    child.error(
      {
        err,
        // biome-ignore lint/suspicious/noExplicitAny: <for error>
        res: { status: (err as any)?.status ?? 500 },
        duration_ms: ms,
      },
      'request.failed'
    );
    throw err;
  }
};
