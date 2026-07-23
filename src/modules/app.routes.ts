import type { FastifyInstance } from 'fastify';

import { usersRoutes } from '@/modules/users/users.routes';

import healthRoutes from './health/health.routes';

export default async function appRoutes(fastify: FastifyInstance): Promise<void> {
  // Register all modular routes here
  await fastify.register(healthRoutes);
  await fastify.register(usersRoutes, { prefix: '/users' });

  // Future modular routes can be added here:
  // await fastify.register(userRoutes);
  // await fastify.register(productRoutes);
}
