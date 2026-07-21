import type { FastifyError, FastifyInstance } from 'fastify';
import { ZodError } from 'zod';

import { env } from '@/core/config/env.config';
import { HttpException } from '@/core/error/app-error.error';

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler(async (error: FastifyError | Error, request, reply) => {
    const fastifyError = error as FastifyError;
    const statusCode = fastifyError.statusCode ?? 500;

    // 1. Log the error (errors as error level, client errors as warnings)
    if (statusCode >= 500) {
      request.log.error(error);
    } else {
      request.log.warn({ err: error }, `Client error ${statusCode}: ${error.message}`);
    }

    // 2. Handle NestJS-style HttpExceptions
    if (error instanceof HttpException) {
      await reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        message: error.message,
        error: error.error,
        ...(error.details !== null && { details: error.details }),
      });
      return;
    }

    // 3. Handle Zod Validation Errors (formatted exactly like NestJS ValidationPipe)
    if (error instanceof ZodError) {
      const messages = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);

      await reply.status(400).send({
        statusCode: 400,
        message: messages,
        error: 'Bad Request',
      });
      return;
    }

    // 4. Handle Fastify/HTTP Client Errors (e.g. payload size exceeded, malformed JSON body)
    if (statusCode >= 400 && statusCode < 500) {
      await reply.status(statusCode).send({
        statusCode,
        message: error.message,
        error: fastifyError.code || 'Bad Request',
      });
      return;
    }

    // 5. Handle Critical Unhandled Internal Server Errors (500)
    await reply.status(500).send({
      statusCode: 500,
      message: env.NODE_ENV === 'development' ? error.message : 'Internal Server Error',
      error: 'Internal Server Error',
      ...(env.NODE_ENV === 'development' && { stack: error.stack }),
    });
  });
}
