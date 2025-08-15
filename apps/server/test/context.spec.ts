/** biome-ignore-all lint/suspicious/noEmptyBlockStatements: <testing> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <testing> */
import { describe, expect, it, vi } from 'vitest';
import { auth } from '@/lib/auth';
import { createContext } from '@/lib/context';

vi.mock('@/lib/auth', () => {
  return {
    auth: {
      api: { getSession: vi.fn() },
    },
  };
});

const mockHonoCtx = () =>
  ({
    req: { raw: new Request('http://x.test') },
    var: { logger: { info() {}, error() {} } },
  }) as any;

describe('createContext', () => {
  it('returns session + logger', async () => {
    (auth.api.getSession as any).mockResolvedValue({ user: { id: 'u1' } });
    const ctx = await createContext({ context: mockHonoCtx() });
    expect(ctx.logger).toBeDefined();
    expect(ctx.session?.user.id).toBe('u1');
  });

  it('handles missing session', async () => {
    (auth.api.getSession as any).mockResolvedValue(null);
    const ctx = await createContext({ context: mockHonoCtx() });
    expect(ctx.session).toBeNull();
  });
});
