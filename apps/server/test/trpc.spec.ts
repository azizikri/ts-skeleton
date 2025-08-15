/** biome-ignore-all lint/suspicious/noEmptyBlockStatements: <test> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <test> */
/** biome-ignore-all lint/style/noNonNullAssertion: <test> */

import { initTRPC } from '@trpc/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Context } from '@/lib/context';
import { protectedProcedure } from '@/lib/trpc';

describe('tRPC protectedProcedure', () => {
  const t = initTRPC.context<Context>().create();

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('rejects without session', async () => {
    const router = t.router({
      me: protectedProcedure.query(({ ctx }) => ctx.session!.user.id),
    });
    const caller = router.createCaller({
      logger: undefined,
      session: null,
    } as any);
    await expect(caller.me()).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
  });

  it('allows with session', async () => {
    const router = t.router({
      me: protectedProcedure.query(({ ctx }) => ctx.session!.user.id),
    });
    const caller = router.createCaller({
      logger: undefined,
      session: { user: { id: 'u1' } },
    } as any);
    await expect(caller.me()).resolves.toBe('u1');
  });
});
