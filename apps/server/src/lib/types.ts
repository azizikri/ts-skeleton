import type { PinoLogger } from 'hono-pino';
import type { Environment } from '@/env';

export type AppBindings = {
  Bindings: Environment;
  Variables: {
    logger: PinoLogger;
  };
};
