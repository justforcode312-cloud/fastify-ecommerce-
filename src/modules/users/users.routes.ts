import type { FastifyInstance } from 'fastify';

import { type IdDto, IdSchema } from '@/core/dtos/id.dto';
import {
  ChangePasswordDto,
  type ChangePasswordType,
} from '@/modules/users/dtos/change-password.dto';
import { ChangeRoleDto, type ChangeRoleType } from '@/modules/users/dtos/change-role.dto';
import { UpdateStatusDto, type UpdateStatusType } from '@/modules/users/dtos/update-status.dto';

import { UpdateProfileDto, type UpdateProfileType } from './dtos/update-profile.dto';
import { usersContainer } from './users.container';

export const usersRoutes = async (fastify: FastifyInstance) => {
  const { UserController } = usersContainer;

  fastify.get('/me', { preHandler: [fastify.authenticate] }, UserController.getProfile);

  fastify.get<{ Params: IdDto }>(
    '/:id',
    { preHandler: [fastify.authenticate], preValidation: fastify.validate({ params: IdSchema }) },
    UserController.getById,
  );

  fastify.patch<{ Body: UpdateProfileType }>(
    '/me',
    {
      preHandler: [fastify.authenticate],
      preValidation: fastify.validate({ body: UpdateProfileDto }),
    },
    UserController.updateProfile,
  );

  fastify.post<{ Body: ChangePasswordType }>(
    '/me/change-password',
    {
      preHandler: [fastify.authenticate],
      preValidation: fastify.validate({ body: ChangePasswordDto }),
    },
    UserController.changePassword,
  );

  fastify.patch<{
    Params: IdDto;
    Body: ChangeRoleType;
  }>(
    '/:id/role',
    {
      preHandler: [fastify.authenticate],
      preValidation: fastify.validate({ params: IdSchema, body: ChangeRoleDto }),
    },
    UserController.changeRole,
  );

  fastify.patch<{
    Params: IdDto;
    Body: UpdateStatusType;
  }>(
    '/:id/status',
    {
      preHandler: [fastify.authenticate],
      preValidation: fastify.validate({ params: IdSchema, body: UpdateStatusDto }),
    },
    UserController.changeStatus,
  );

  fastify.delete<{
    Params: IdDto;
  }>(
    '/:id',
    { preHandler: [fastify.authenticate], preValidation: fastify.validate({ params: IdSchema }) },
    UserController.deleteUser,
  );
};
