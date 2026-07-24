import type { UpdateWriteOpResult } from 'mongoose';

import { BaseRepository } from '@/core/base/base.repository';

import { type RefreshToken, RefreshTokenModel } from './refresh-token.model';

export class RefreshTokenRepository extends BaseRepository<RefreshToken> {
  constructor() {
    super(RefreshTokenModel);
  }

  async findByJti(jti: string): Promise<RefreshToken | null> {
    return this.findOne({ jti });
  }

  async findActiveByJti(jti: string): Promise<RefreshToken | null> {
    return this.findOne({
      jti,
      isRevoked: false,
      expiresAt: {
        $gte: new Date(),
      },
    });
  }

  async findActiveByUserId(userId: string): Promise<RefreshToken[] | null> {
    return this.find({
      user: userId,
      isRevoked: false,
      expiresAt: {
        $gte: new Date(),
      },
    });
  }

  async revoke(jti: string): Promise<RefreshToken | null> {
    return this.updateOne({ jti }, { isRevoked: true });
  }

  async revokeAll(userId: string): Promise<UpdateWriteOpResult> {
    return this.updateMany({ user: userId, isRevoked: false }, { isRevoked: true });
  }

  async deleteExpired() {
    return this.deleteMany({
      expiresAt: {
        $lt: new Date(),
      },
    });
  }

  async deleteRevoked() {
    return this.deleteMany({
      isRevoked: true,
    });
  }
}
