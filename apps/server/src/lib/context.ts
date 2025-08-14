import type { Context as HonoContext } from 'hono';
import type { Logger } from 'pino';
import { auth } from './auth';

export type CreateContextOptions = { context: HonoContext };

export async function createContext({ context }: CreateContextOptions) {
  const logger: Logger = context.var.logger;

  const session = await auth.api.getSession({
    headers: context.req.raw.headers,
  });

  return { session, logger };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
