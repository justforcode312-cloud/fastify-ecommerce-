import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import jwt from 'jsonwebtoken';

import { env } from '@/core/config/env.config';
import type { UserPayload } from '@/core/types/auth.type';

async function authPlugin(fastify: FastifyInstance): Promise<void> {
  // Sign Access Token (short-lived)
  fastify.decorate('signAccessToken', (payload: UserPayload): string =>
    jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRY as jwt.SignOptions['expiresIn'],
    }),
  );

  // Sign Refresh Token (long-lived)
  fastify.decorate('signRefreshToken', (payload: UserPayload): string =>
    jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRY as jwt.SignOptions['expiresIn'],
    }),
  );

  // Verify Access Token
  fastify.decorate('verifyAccessToken', (token: string): UserPayload => {
    try {
      return jwt.verify(token, env.JWT_ACCESS_SECRET) as UserPayload;
    } catch (error) {
      throw new Error('Invalid or expired access token', { cause: error });
    }
  });

  // Verify Refresh Token
  fastify.decorate('verifyRefreshToken', (token: string): UserPayload => {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET) as UserPayload;
    } catch (error) {
      throw new Error('Invalid or expired refresh token', { cause: error });
    }
  });

  // Authentication preValidation hook
  fastify.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      try {
        let token = request.headers.authorization?.replace(/^Bearer\s+/, '');

        // Fallback to cookie
        token ??= request.cookies['access_token'];

        if (!token) {
          await reply.status(401).send({ error: 'Unauthorized', message: 'Access token missing' });
          return;
        }

        request.user = fastify.verifyAccessToken(token);
      } catch (err) {
        fastify.log.warn(err, 'Authentication failure');
        await reply
          .status(401)
          .send({ error: 'Unauthorized', message: 'Invalid or expired access token' });
      }
    },
  );

  // Satisfy require-await rule
  await Promise.resolve();
}

export default fp(authPlugin, { name: 'auth' });
