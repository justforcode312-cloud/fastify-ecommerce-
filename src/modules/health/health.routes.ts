import type { FastifyInstance } from 'fastify';

import { healthContainer } from './health.container';

const healthRoutes = async (app: FastifyInstance) => {
  const { healthController } = healthContainer;
  app.get(
    '/health',
    {
      schema: {
        description: 'Get application health status',
        tags: ['Health'],
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              data: {
                type: 'object',
                properties: {
                  status: { type: 'string', example: 'UP' },
                  timestamp: { type: 'string' },
                  uptime: { type: 'number' },
                },
              },
            },
          },
        },
      },
    },
    healthController.check,
  );
};

export default healthRoutes;
