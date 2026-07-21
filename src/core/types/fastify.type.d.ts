import type mongoose from 'mongoose';

import type { UserPayload } from './auth.type';

export type { FastifyReply, FastifyRequest } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    mongoose: typeof mongoose;
    signAccessToken(payload: UserPayload): string;
    signRefreshToken(payload: UserPayload): string;
    verifyAccessToken(token: string): UserPayload;
    verifyRefreshToken(token: string): UserPayload;
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  }

  interface FastifyRequest {
    user?: UserPayload;
  }
}
