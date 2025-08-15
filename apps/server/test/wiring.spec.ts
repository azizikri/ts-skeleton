import { describe, expect, it } from 'vitest';
import { app } from '@/index';

describe('wiring', () => {
  it('CORS headers present', async () => {
    const res = await app.request('/', { method: 'GET' });
    expect(res.headers.get('access-control-allow-origin')).toBeTruthy();
  });
});
