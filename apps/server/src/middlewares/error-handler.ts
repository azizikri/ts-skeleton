import type { MiddlewareHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';

export const errorHandler: MiddlewareHandler = async (c, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof HTTPException) {
      const status = err.status;
      const message = err.message || 'HTTP Error';
      return c.json(
        {
          status,
          error: 'HTTPException',
          message,
          ...(process.env.NODE_ENV !== 'production' && {
            // biome-ignore lint/suspicious/noExplicitAny: <any>
            stack: (err as any).stack,
          }),
        },
        status
      );
    }

    const message =
      err instanceof Error ? err.message : 'Internal Server Error';
    const stack = err instanceof Error ? err.stack : undefined;

    return c.json(
      {
        status: 500,
        error: 'InternalServerError',
        message,
        ...(process.env.NODE_ENV !== 'production' && { stack }),
      },
      500
    );
  }
};
