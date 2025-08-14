import { initTRPC, TRPCError } from '@trpc/server';
import { env } from '@/env';
import type { Context } from './context';

const isProd = env.NODE_ENV === 'production';

export const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        cause: error.cause,
        stack: isProd ? undefined : error.stack,
      },
    };
  },
});
export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
      cause: 'No session',
    });
  }
  return next({ ctx: { ...ctx, session: ctx.session } });
});
