import type { ClientSession } from 'mongoose';

import { BaseService } from '@/core/base/base.service';
import { NotFoundException, UnauthorizedException } from '@/core/error/app-error.error';
import type { RefreshTokenRepository } from '@/modules/refresh-token/refresh-token.repository';

import { type RefreshToken, RefreshTokenModel } from './refresh-token.model';

export class RefreshTokenService extends BaseService<RefreshToken> {
  constructor(private readonly refreshTokenRepository: RefreshTokenRepository) {
    super(refreshTokenRepository);
  }

  async create(
    payload: Partial<RefreshToken>,
    options?: { session?: ClientSession },
  ): Promise<RefreshToken> {
    if (options?.session) {
      const docs = await RefreshTokenModel.create([payload], { session: options.session });
      return docs[0] as RefreshToken;
    }
    return this.refreshTokenRepository.create(
      payload as unknown as Record<string, unknown>,
    );
  }

  async findByJti(jti: string): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.findByJti(jti);
  }

  async validateToken(jti: string): Promise<RefreshToken> {
    const token = await this.refreshTokenRepository.findByJti(jti);
    if (!token) {
      throw new UnauthorizedException('Refresh token not found');
    }
    if (token.isRevoked) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }
    if (token.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token has expired');
    }
    return token;
  }

  async revoke(jti: string): Promise<void> {
    const token = await this.refreshTokenRepository.revoke(jti);
    if (!token) {
      throw new NotFoundException('Refresh token not found');
    }
  }

  async revokeAll(userId: string): Promise<void> {
    await this.refreshTokenRepository.revokeAll(userId);
  }
}
