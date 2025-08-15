import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { describe, expect, it } from 'vitest';
import { errorHandler } from '@/middlewares/error-handler';

describe('errorHandler', () => {
  it('formats HTTPException with status', async () => {
    const app = new Hono().use('*', errorHandler).get('/x', () => {
      throw new HTTPException(400, { message: 'bad' });
    });
    const res = await app.request('/x');
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toMatchObject({
      status: 400,
      error: 'HTTPException',
      message: 'bad',
    });
  });

  it('formats generic errors as 500 with stack in test', async () => {
    const app = new Hono().use('*', errorHandler).get('/y', () => {
      throw new Error('boom');
    });
    const res = await app.request('/y');
    const body = await res.json();
    expect(res.status).toBe(500);
    expect(body).toMatchObject({
      status: 500,
      error: 'InternalServerError',
      message: 'boom',
    });
    expect(body.stack).toBeDefined();
  });
});
