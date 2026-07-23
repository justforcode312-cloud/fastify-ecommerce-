import { BaseRepository } from '@/core/base/base.repository';

import { type User, UserModel } from './users.model';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.model.findOne({ email }).select('+password').lean();
  }

  async findByIdWithPassword(email: string): Promise<User | null> {
    return this.model.findById(email).select('+password').lean();
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.exists({ email });
  }

  async updateLastLogin(userId: string): Promise<User | null> {
    return this.updateById(userId, { lastLoginAt: new Date() });
  }

  async verifyEmail(userId: string): Promise<User | null> {
    return this.updateById(userId, { isEmailVerified: true });
  }

  async updatePassword(userId: string, password: string): Promise<User | null> {
    return this.updateById(userId, { password });
  }
}
