import type { FastifyReply, FastifyRequest } from 'fastify';

import { BaseController } from '@/core/base/base.controller';
import { env } from '@/core/config/env.config';
import { UnauthorizedException } from '@/core/error/app-error.error';
import { ResponseUtils } from '@/core/utils/response.util';
import { AuditActions, AuditModules } from '@/modules/audit/audit.constants';

import type { AuthService } from './auth.service';
import type { LoginType } from './dtos/login.dto';
import type { RefreshType } from './dtos/refresh.dto';
import type { RegisterType } from './dtos/register.dto';

export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  register = async (
    request: FastifyRequest<{
      Body: RegisterType;
    }>,
    reply: FastifyReply,
  ) => {
    const metadata = {
      ipAddress: request.ip,
      userAgent:
        typeof request.headers['user-agent'] === 'string'
          ? request.headers['user-agent']
          : undefined,
    };

    const result = await this.authService.register(request.body, metadata);

    reply.setCookie('access_token', result.accessToken, {
      path: '/',
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    reply.setCookie('refresh_token', result.refreshToken, {
      path: '/',
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    request.audit = {
      module: AuditModules.AUTH,
      action: AuditActions.REGISTER,
      resourceId: result.user._id.toString(),
    };

    return ResponseUtils.success(reply, result, 'Registration successful');
  };

  login = async (
    request: FastifyRequest<{
      Body: LoginType;
    }>,
    reply: FastifyReply,
  ) => {
    const metadata = {
      ipAddress: request.ip,
      userAgent:
        typeof request.headers['user-agent'] === 'string'
          ? request.headers['user-agent']
          : undefined,
    };

    const result = await this.authService.login(request.body, metadata);

    reply.setCookie('access_token', result.accessToken, {
      path: '/',
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    reply.setCookie('refresh_token', result.refreshToken, {
      path: '/',
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    request.audit = {
      module: AuditModules.AUTH,
      action: AuditActions.LOGIN,
      resourceId: result.user._id.toString(),
    };

    return ResponseUtils.success(reply, result, 'Login successful');
  };

  refresh = async (
    request: FastifyRequest<{
      Body: Partial<RefreshType>;
    }>,
    reply: FastifyReply,
  ) => {
    const refreshToken = request.cookies['refresh_token'] || request.body?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const metadata = {
      ipAddress: request.ip,
      userAgent:
        typeof request.headers['user-agent'] === 'string'
          ? request.headers['user-agent']
          : undefined,
    };

    const result = await this.authService.refresh(refreshToken, metadata);

    reply.setCookie('access_token', result.accessToken, {
      path: '/',
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    reply.setCookie('refresh_token', result.refreshToken, {
      path: '/',
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    request.audit = {
      module: AuditModules.AUTH,
      action: AuditActions.REFRESH_TOKEN,
    };

    return ResponseUtils.success(reply, result, 'Token refresh successful');
  };

  logout = async (
    request: FastifyRequest<{
      Body: Partial<RefreshType>;
    }>,
    reply: FastifyReply,
  ) => {
    const refreshToken = request.cookies['refresh_token'] || request.body?.refreshToken;

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    reply.clearCookie('access_token', { path: '/' });
    reply.clearCookie('refresh_token', { path: '/' });

    request.audit = {
      module: AuditModules.AUTH,
      action: AuditActions.LOGOUT,
    };

    return ResponseUtils.success(reply, null, 'Logout successful');
  };
}
