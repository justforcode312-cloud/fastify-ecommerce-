import type { FastifyReply, FastifyRequest } from 'fastify';

import { BaseController } from '@/core/base/base.controller';
import { ResponseUtils } from '@/core/utils/response.util';
import { AuditActions, AuditModules } from '@/modules/audit/audit.constants';

import type { JtiDto } from './dtos/jti.dto';
import type { RefreshTokenService } from './refresh-token.service';

export class RefreshTokenController extends BaseController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {
    super();
  }

  revoke = async (
    request: FastifyRequest<{
      Params: JtiDto;
    }>,
    reply: FastifyReply,
  ) => {
    const { jti } = request.params;
    await this.refreshTokenService.revoke(jti);

    request.audit = {
      module: AuditModules.AUTH,
      action: AuditActions.DELETE,
      resourceId: jti,
    };

    return ResponseUtils.success(reply, null, 'Refresh token revoked successfully');
  };

  revokeAll = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user?.id as string;
    await this.refreshTokenService.revokeAll(userId);

    request.audit = {
      module: AuditModules.AUTH,
      action: AuditActions.DELETE,
      resourceId: userId,
    };

    return ResponseUtils.success(reply, null, 'All active refresh tokens revoked successfully');
  };
}
