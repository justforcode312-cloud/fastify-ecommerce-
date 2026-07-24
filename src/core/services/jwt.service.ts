import jwt from 'jsonwebtoken';

import { env } from '@/core/config/env.config';
import type { UserPayload } from '@/core/types/auth.type';

export class JwtService {
  signAccessToken(payload: UserPayload): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRY as jwt.SignOptions['expiresIn'],
    });
  }

  signRefreshToken(payload: UserPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRY as jwt.SignOptions['expiresIn'],
    });
  }

  verifyAccessToken(token: string): UserPayload {
    try {
      return jwt.verify(token, env.JWT_ACCESS_SECRET) as UserPayload;
    } catch (error) {
      throw new Error('Invalid or expired access token', { cause: error });
    }
  }

  verifyRefreshToken(token: string): UserPayload {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET) as UserPayload;
    } catch (error) {
      throw new Error('Invalid or expired refresh token', { cause: error });
    }
  }
}
