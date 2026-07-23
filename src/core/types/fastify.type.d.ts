import 'fastify';

import type mongoose from 'mongoose';
import type { ZodType } from 'zod';

import type { JwtService } from '@/core/services/jwt.service';
import type { UserPayload } from '@/core/types/auth.type';

declare module 'fastify' {
  interface FastifyRequest {
    user?: UserPayload;
  }

  interface FastifyInstance {
    jwtService: JwtService;
    mongoose: typeof mongoose;

    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    validate(
      schema: ZodType | { body?: ZodType; query?: ZodType; params?: ZodType },
      target?: 'body' | 'query' | 'params',
    ): (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
