import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import Fastify, { type FastifyInstance } from 'fastify';

import { env } from '@/core/config/env.config';
import { registerErrorHandler } from '@/core/error/error-handler.error';
import authPlugin from '@/core/plugins/auth.plugin';
import dbPlugin from '@/core/plugins/db.plugin';
import validationPlugin from '@/core/plugins/validation.plugin';
import { logger } from '@/core/services/logger.service';
import appRoutes from '@/modules/app.routes';

export async function buildApp(): Promise<FastifyInstance> {
  const fastify = Fastify({
    loggerInstance: logger,
  });

  // Not Found Handler
  fastify.setNotFoundHandler(async (request, reply) => {
    await reply.status(404).send({
      statusCode: 404,
      error: 'NotFound',
      message: `Route ${request.method} ${request.url} not found`,
    });
  });

  // 1. Register Core Security & Cookie Plugins
  await fastify.register(helmet, {
    contentSecurityPolicy: env.NODE_ENV === 'production',
  });

  await fastify.register(cors, {
    origin: env.NODE_ENV !== 'production',
    credentials: true,
  });

  await fastify.register(cookie, {
    secret: env.COOKIE_SECRET,
  });

  // 2. Register Swagger / OpenAPI documentation
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'Fastify E-Commerce API',
        description: 'Production-ready Fastify API with strict TypeScript rules',
        version: '1.0.0',
      },
      servers: [
        {
          url: `http://${env.HOST}:${env.PORT}`,
          description: env.NODE_ENV,
        },
      ],
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });

  await fastify.register(dbPlugin);
  await fastify.register(authPlugin);
  await fastify.register(validationPlugin);

  registerErrorHandler(fastify);

  await fastify.register(appRoutes, { prefix: '/api/v1' });

  return fastify;
}
