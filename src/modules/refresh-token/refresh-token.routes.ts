import type { FastifyInstance } from 'fastify';

import { type JtiDto, JtiSchema } from './dtos/jti.dto';
import { refreshTokenContainer } from './refresh-token.container';

export const refreshTokenRoutes = async (fastify: FastifyInstance) => {
  const { refreshTokenController } = refreshTokenContainer;

  fastify.post<{ Params: JtiDto }>(
    '/revoke/:jti',
    {
      preHandler: [fastify.authenticate],
      preValidation: fastify.validate({ params: JtiSchema }),
      schema: {
        description: 'Revoke a specific active refresh token by its JTI identifier',
        tags: ['Refresh Tokens'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            jti: { type: 'string', description: 'Refresh token JTI identifier' },
          },
          required: ['jti'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    refreshTokenController.revoke,
  );

  fastify.post(
    '/revoke-all',
    {
      preHandler: [fastify.authenticate],
      schema: {
        description: 'Revoke all active refresh tokens for the current authenticated user',
        tags: ['Refresh Tokens'],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    refreshTokenController.revokeAll,
  );
};
