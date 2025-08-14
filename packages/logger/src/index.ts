import pino, { type Logger, type LoggerOptions } from 'pino';

type CreateLoggerOpts = {
  name?: string;
  level?: pino.LevelWithSilent;
  env?: 'development' | 'test' | 'production';
};

const redact: LoggerOptions['redact'] = {
  paths: [
    'req.headers.authorization',
    'req.headers.cookie',
    'response.headers["set-cookie"]',
    'body.password',
    'body.token',
  ],
  remove: true,
};

export function createLogger(opts: CreateLoggerOpts = {}): Logger {
  const logEnv =
    opts.env ??
    (process.env.NODE_ENV as 'development' | 'test' | 'production') ??
    'development';
  const base: LoggerOptions = {
    name: opts.name ?? 'ts-skeleton',
    level:
      opts.level ??
      process.env.LOG_LEVEL ??
      (logEnv === 'test' ? 'silent' : 'info'),
    enabled: process.env.NO_LOG !== '1',
    redact,
    timestamp: pino.stdTimeFunctions.isoTime,
  };

  // pretty only for local dev
  const transport =
    logEnv === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            singleLine: false,
            translateTime: 'SYS:standard',
          },
        }
      : undefined;

  return pino({ ...base, transport });
}
