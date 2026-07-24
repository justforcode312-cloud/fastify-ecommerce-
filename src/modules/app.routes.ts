import type { FastifyInstance } from 'fastify';

import { authRoutes } from '@/modules/auth/auth.routes';
import { refreshTokenRoutes } from '@/modules/refresh-token/refresh-token.routes';
import { usersRoutes } from '@/modules/users/users.routes';

import healthRoutes from './health/health.routes';

export default async function appRoutes(fastify: FastifyInstance): Promise<void> {
  await fastify.register(healthRoutes, { prefix: '/health' });
  await fastify.register(authRoutes, { prefix: '/auth' });
  await fastify.register(usersRoutes, { prefix: '/users' });
  await fastify.register(refreshTokenRoutes, { prefix: '/refresh-tokens' });
}
