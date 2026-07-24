import type { FastifyReply, FastifyRequest } from 'fastify';

import { BaseController } from '@/core/base/base.controller';
import type { IdDto } from '@/core/dtos/id.dto';
import { ResponseUtils } from '@/core/utils/response.util';
import { AuditActions, AuditModules } from '@/modules/audit/audit.constants';
import type { ChangePasswordType } from '@/modules/users/dtos/change-password.dto';
import type { ChangeRoleType } from '@/modules/users/dtos/change-role.dto';
import type { UpdateProfileType } from '@/modules/users/dtos/update-profile.dto';
import type { UpdateStatusType } from '@/modules/users/dtos/update-status.dto';
import type { UsersService } from '@/modules/users/users.service';

export class UsersController extends BaseController {
  constructor(private readonly userService: UsersService) {
    super();
  }

  getProfile = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user?.id as string;

    const user = await this.userService.findById(userId);

    return ResponseUtils.success(reply, user, 'User fetched successfully');
  };

  getById = async (
    request: FastifyRequest<{
      Params: IdDto;
    }>,
    reply: FastifyReply,
  ) => {
    const userId = request.params.id;

    const user = await this.userService.findById(userId);

    return ResponseUtils.success(reply, user, 'User fetched successfully');
  };

  updateProfile = async (
    request: FastifyRequest<{
      Body: UpdateProfileType;
    }>,
    reply: FastifyReply,
  ) => {
    const userId = request.user?.id as string;

    const oldUser = await this.userService.findById(userId);
    const user = await this.userService.updateProfile(userId, request.body);

    request.audit = {
      module: AuditModules.USER,
      action: AuditActions.UPDATE,
      resourceId: userId,
      oldValue: { firstName: oldUser.firstName, lastName: oldUser.lastName },
      newValue: { firstName: user?.firstName, lastName: user?.lastName },
    };

    return ResponseUtils.success(reply, user, 'User updated successfully');
  };

  changePassword = async (
    request: FastifyRequest<{
      Body: ChangePasswordType;
    }>,
    reply: FastifyReply,
  ) => {
    const userId = request.user?.id as string;

    const user = await this.userService.changePassword(userId, request.body);

    request.audit = {
      module: AuditModules.USER,
      action: AuditActions.CHANGE_PASSWORD,
      resourceId: userId,
    };

    return ResponseUtils.success(reply, user, 'Password changed successfully');
  };

  changeRole = async (
    request: FastifyRequest<{
      Params: IdDto;
      Body: ChangeRoleType;
    }>,
    reply: FastifyReply,
  ) => {
    const userId = request.params.id;

    const oldUser = await this.userService.findById(userId);
    const updatedUser = await this.userService.changeRole(userId, request.body);

    request.audit = {
      module: AuditModules.USER,
      action: AuditActions.CHANGE_ROLE,
      resourceId: userId,
      oldValue: { role: oldUser.role },
      newValue: { role: updatedUser?.role },
    };

    return ResponseUtils.success(reply, updatedUser, 'Role updated successfully');
  };

  changeStatus = async (
    request: FastifyRequest<{
      Params: IdDto;
      Body: UpdateStatusType;
    }>,
    reply: FastifyReply,
  ) => {
    const userId = request.params.id;

    const oldUser = await this.userService.findById(userId);
    const updatedUser = await this.userService.changeStatus(userId, request.body);

    request.audit = {
      module: AuditModules.USER,
      action: AuditActions.CHANGE_STATUS,
      resourceId: userId,
      oldValue: { status: oldUser.status },
      newValue: { status: updatedUser?.status },
    };

    return ResponseUtils.success(reply, updatedUser, 'Status updated successfully');
  };

  deleteUser = async (request: FastifyRequest<{ Params: IdDto }>, reply: FastifyReply) => {
    const userId = request.params.id;

    const oldUser = await this.userService.findById(userId);
    await this.userService.deleteUser(userId);

    request.audit = {
      module: AuditModules.USER,
      action: AuditActions.DELETE,
      resourceId: userId,
      oldValue: { status: oldUser.status },
    };

    return ResponseUtils.success(reply, null, 'User deleted successfully');
  };
}
