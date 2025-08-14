import { initTRPC, TRPCError } from '@trpc/server';
import { env } from '@/env';
import type { Context } from './context';

const isProd = env.NODE_ENV === 'production';

export const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error, ctx }) {
    ctx?.logger?.error(
      // biome-ignore lint/suspicious/noExplicitAny: <error>
      { err: error, path: (error as any)?.path },
      'tRPC procedure failed'
    );

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

export const protectedProcedure = t.procedure.use(
  ({ ctx, path, type, next }) => {
    ctx.logger?.info({ path, type }, 'protectedProcedure start');

    if (!ctx.session) {
      ctx.logger?.warn(
        { path, type },
        'Unauthorized access attempt: no session'
      );
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
        cause: 'No session',
      });
    }

    ctx.logger?.info(
      { path, type, userId: ctx.session.user.id },
      'protectedProcedure authorized'
    );

    return next({ ctx: { ...ctx, session: ctx.session } });
  }
);
