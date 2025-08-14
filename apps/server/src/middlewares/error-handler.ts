import type { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';

const isProd = process.env.NODE_ENV === 'production';

type ErrorBody = {
  status: number;
  error: string;
  message: string;
  stack?: string;
};

function toBody(
  status: number,
  error: string,
  message: string,
  stack?: string
): ErrorBody {
  return { status, error, message, stack: isProd ? undefined : stack };
}

export async function errorHandler(c: Context, next: Next) {
  try {
    await next();
  } catch (err) {
    // biome-ignore lint/suspicious/noExplicitAny: for error
    const e = err as any;
    if (e instanceof HTTPException) {
      const status = e.status ?? 500;
      return c.json(
        toBody(status, 'HTTPException', e.message, e.stack),
        status
      );
    }
    const status = typeof e?.status === 'number' ? e.status : 500;
    const message = e?.message ?? 'Internal Server Error';
    const logger = c.var?.logger;
    logger?.error({ err, status }, 'unhandled.error');
    return c.json(
      toBody(
        status,
        status >= 500 ? 'InternalServerError' : 'Error',
        message,
        e?.stack
      ),
      status
    );
  }
}
