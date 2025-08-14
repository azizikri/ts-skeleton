import { initTRPC } from '@trpc/server';

export const createContext = ({ c }: { c: import('hono').Context }) => ({
  logger: c.var.logger.child({ scope: 'trpc' }),
});
type Ctx = ReturnType<typeof createContext>;

const t = initTRPC.context<Ctx>().create({
  errorFormatter({ shape, error, ctx }) {
    ctx?.logger?.error({ err: error, code: error.code }, 'trpc.error');
    return shape;
  },
});

export const router = t.router;
export const publicProcedure = t.procedure.use(
  async ({ ctx, path, next, type }) => {
    const start = Date.now();
    ctx.logger.info({ path, type }, 'trpc.start');
    const res = await next();
    ctx.logger.info({ path, type, duration_ms: Date.now() - start }, 'trpc.ok');
    return res;
  }
);
