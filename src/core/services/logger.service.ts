import type { FastifyBaseLogger } from 'fastify';
import pino from 'pino';

import { env } from '@/core/config/env.config';

const transport =
  env.NODE_ENV === 'development'
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'yyyy-mm-dd HH:MM:ss.l o',
          ignore: 'pid,hostname',
          singleLine: false,
        },
      }
    : undefined;

export const logger: FastifyBaseLogger = pino({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'res.headers["set-cookie"]',
      'password',
      'token',
      'accessToken',
      'refreshToken',
      'cookieSecret',
      'jwtSecret',
    ],
    censor: '[REDACTED]',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  transport,
});

export type Logger = typeof logger;
