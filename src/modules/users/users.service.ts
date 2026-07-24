import { BaseService } from '@/core/base/base.service';
import { BadRequestException, NotFoundException } from '@/core/error/app-error.error';
import type { PasswordService } from '@/core/services/password.service';
import type { ChangePasswordType } from '@/modules/users/dtos/change-password.dto';
import type { ChangeRoleType } from '@/modules/users/dtos/change-role.dto';
import type { UpdateStatusType } from '@/modules/users/dtos/update-status.dto';

import type { UpdateProfileType } from './dtos/update-profile.dto';
import type { User } from './users.model';
import type { UserRepository } from './users.repository';

export class UsersService extends BaseService<User> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
  ) {
    super(userRepository);
  }

  async findById(userId: string): Promise<User> {
    return this.findByIdOrThrow(userId);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async updateProfile(userId: string, payload: UpdateProfileType): Promise<User | null> {
    const updatedUser = await this.userRepository.updateById(userId, payload);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async changePassword(userId: string, payload: ChangePasswordType): Promise<User | null> {
    const user = await this.userRepository.findByIdWithPassword(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.password) {
      throw new BadRequestException('Password not set');
    }

    const isValidPassword = await this.passwordService.validate(
      user.password,
      payload.currentPassword,
    );
    if (!isValidPassword) {
      throw new BadRequestException('Invalid current password');
    }

    const hashedPassword = await this.passwordService.hash(payload.newPassword);
    return this.userRepository.updatePassword(userId, hashedPassword);
  }

  async changeRole(userId: string, payload: ChangeRoleType): Promise<User | null> {
    const updatedUser = await this.userRepository.updateById(userId, { role: payload.role });
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async changeStatus(userId: string, payload: UpdateStatusType): Promise<User | null> {
    const updatedUser = await this.userRepository.updateById(userId, { status: payload.status });
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async deleteUser(userId: string): Promise<void> {
    const deletedUser = await this.userRepository.softDelete(userId);
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
  }

  async createUser(payload: Record<string, unknown>): Promise<User> {
    return this.userRepository.create(payload);
  }
}
