import type { FastifyInstance } from 'fastify';

import { healthContainer } from './health.container';

const healthRoutes = async (app: FastifyInstance) => {
  const { healthController } = healthContainer;
  app.get('/health', healthController.check.bind(healthController));
};

export default healthRoutes;
