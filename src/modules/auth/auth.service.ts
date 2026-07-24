import crypto from 'crypto';
import { Types } from 'mongoose';

import { env } from '@/core/config/env.config';
import { BadRequestException, UnauthorizedException } from '@/core/error/app-error.error';
import type { JwtService } from '@/core/services/jwt.service';
import type { PasswordService } from '@/core/services/password.service';
import type { RefreshTokenService } from '@/modules/refresh-token/refresh-token.service';
import type { UsersService } from '@/modules/users/users.service';

import type { LoginType } from './dtos/login.dto';
import type { RegisterType } from './dtos/register.dto';

export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
  ) {}

  private parseExpiry(expiry: string): Date {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
    const value = parseInt(match[1]!, 10);
    const unit = match[2];
    let ms: number;
    switch (unit) {
      case 's':
        ms = value * 1000;
        break;
      case 'm':
        ms = value * 60 * 1000;
        break;
      case 'h':
        ms = value * 60 * 60 * 1000;
        break;
      case 'd':
        ms = value * 24 * 60 * 60 * 1000;
        break;
      default:
        ms = 7 * 24 * 60 * 60 * 1000;
    }
    return new Date(Date.now() + ms);
  }

  async register(data: RegisterType, metadata: { ipAddress?: string; userAgent?: string }) {
    const exists = await this.usersService.findByEmail(data.email);
    if (exists) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await this.passwordService.hash(data.password);
    const user = await this.usersService.createUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(user, metadata);

    const userObj = user.toJSON();
    delete userObj.password;

    return { user: userObj, ...tokens };
  }

  async login(data: LoginType, metadata: { ipAddress?: string; userAgent?: string }) {
    const user = await this.usersService['userRepository'].findByEmailWithPassword(data.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValid = await this.passwordService.validate(user.password, data.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.usersService['userRepository'].updateLastLogin(user._id.toString());

    const userObj = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
      lastLoginAt: user.lastLoginAt,
    };

    const tokens = await this.generateTokens(userObj, metadata);
    return { user: userObj, ...tokens };
  }

  async refresh(refreshToken: string, metadata: { ipAddress?: string; userAgent?: string }) {
    try {
      const payload = this.jwtService.verifyRefreshToken(refreshToken);
      const jti = payload.jti;
      if (!jti) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const activeToken =
        await this.refreshTokenService['refreshTokenRepository'].findActiveByJti(jti);
      if (!activeToken) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      const user = await this.usersService.findById(payload.id);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      await this.refreshTokenService.revoke(jti);

      const tokens = await this.generateTokens(user, metadata);
      return tokens;
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid or expired refresh token',
        error instanceof Error ? error : undefined,
      );
    }
  }

  async logout(refreshToken: string) {
    try {
      const payload = this.jwtService.verifyRefreshToken(refreshToken);
      const jti = payload.jti;
      if (jti) {
        await this.refreshTokenService.revoke(jti);
      }
    } catch {
      // Ignore token verification errors during logout
    }
  }

  private async generateTokens(
    user: { _id: Types.ObjectId | string; email: string; role?: string },
    metadata: { ipAddress?: string; userAgent?: string },
  ) {
    const jti = crypto.randomUUID();
    const userPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      jti,
    };

    const accessToken = this.jwtService.signAccessToken(userPayload);
    const refreshToken = this.jwtService.signRefreshToken(userPayload);

    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = this.parseExpiry(env.JWT_REFRESH_EXPIRY);

    await this.refreshTokenService.create({
      user: typeof user._id === 'string' ? new Types.ObjectId(user._id) : user._id,
      tokenHash,
      jti,
      expiresAt,
      ipAddress: metadata.ipAddress ?? null,
      userAgent: metadata.userAgent ?? null,
      device: null,
    });

    return { accessToken, refreshToken };
  }
}
