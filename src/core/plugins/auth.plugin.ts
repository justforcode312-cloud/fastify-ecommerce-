import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

import { UnauthorizedException } from '@/core/error/app-error.error';
import { JwtService } from '@/core/services/jwt.service';

function extractToken(request: FastifyRequest): string | null {
  const bearer = request.headers.authorization;

  if (bearer?.startsWith('Bearer ')) {
    return bearer.substring(7);
  }

  return request.cookies['access_token'] ?? null;
}

async function authPlugin(fastify: FastifyInstance) {
  const jwtService = new JwtService();

  fastify.decorate('jwtService', jwtService);

  fastify.decorate('authenticate', async (request: FastifyRequest, _reply: FastifyReply) => {
    const token = extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Access token missing');
    }

    request.user = fastify.jwtService.verifyAccessToken(token);
  });
}

export default fp(authPlugin, {
  name: 'auth-plugin',
});
