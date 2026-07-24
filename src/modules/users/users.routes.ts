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

  fastify.get(
    '/me',
    {
      preHandler: [fastify.authenticate],
      schema: {
        description: 'Get profile details of the current authenticated user',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              data: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  email: { type: 'string' },
                  role: { type: 'string' },
                  status: { type: 'string' },
                  isEmailVerified: { type: 'boolean' },
                  lastLoginAt: { type: 'string', nullable: true },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    UserController.getProfile,
  );

  fastify.get<{ Params: IdDto }>(
    '/:id',
    {
      preHandler: [fastify.authenticate],
      preValidation: fastify.validate({ params: IdSchema }),
      schema: {
        description: 'Get user details by user ID',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'User ID (ObjectId)' },
          },
          required: ['id'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              data: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  email: { type: 'string' },
                  role: { type: 'string' },
                  status: { type: 'string' },
                  isEmailVerified: { type: 'boolean' },
                  lastLoginAt: { type: 'string', nullable: true },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    UserController.getById,
  );

  fastify.patch<{ Body: UpdateProfileType }>(
    '/me',
    {
      preHandler: [fastify.authenticate],
      preValidation: fastify.validate({ body: UpdateProfileDto }),
      schema: {
        description: 'Update profile details of the current authenticated user',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          properties: {
            firstName: { type: 'string', maxLength: 50 },
            lastName: { type: 'string', maxLength: 50 },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              data: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  email: { type: 'string' },
                  role: { type: 'string' },
                  status: { type: 'string' },
                  isEmailVerified: { type: 'boolean' },
                  lastLoginAt: { type: 'string', nullable: true },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    UserController.updateProfile,
  );

  fastify.post<{ Body: ChangePasswordType }>(
    '/me/change-password',
    {
      preHandler: [fastify.authenticate],
      preValidation: fastify.validate({ body: ChangePasswordDto }),
      schema: {
        description: 'Change password for the current authenticated user',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['currentPassword', 'newPassword'],
          properties: {
            currentPassword: { type: 'string', minLength: 8 },
            newPassword: { type: 'string', minLength: 8 },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
            },
          },
        },
      },
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
      schema: {
        description: 'Change user role (Admin only)',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'User ID (ObjectId)' },
          },
          required: ['id'],
        },
        body: {
          type: 'object',
          required: ['role'],
          properties: {
            role: { type: 'string', enum: ['ADMIN', 'CUSTOMER'] },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              data: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  email: { type: 'string' },
                  role: { type: 'string' },
                  status: { type: 'string' },
                  isEmailVerified: { type: 'boolean' },
                },
              },
            },
          },
        },
      },
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
      schema: {
        description: 'Change user status (Admin only)',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'User ID (ObjectId)' },
          },
          required: ['id'],
        },
        body: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { type: 'string', enum: ['ACCEPTED', 'REJECTED', 'SUSPENDED'] },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              data: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  email: { type: 'string' },
                  role: { type: 'string' },
                  status: { type: 'string' },
                  isEmailVerified: { type: 'boolean' },
                },
              },
            },
          },
        },
      },
    },
    UserController.changeStatus,
  );

  fastify.delete<{
    Params: IdDto;
  }>(
    '/:id',
    {
      preHandler: [fastify.authenticate],
      preValidation: fastify.validate({ params: IdSchema }),
      schema: {
        description: 'Soft delete a user by ID',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'User ID (ObjectId)' },
          },
          required: ['id'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    UserController.deleteUser,
  );
};
