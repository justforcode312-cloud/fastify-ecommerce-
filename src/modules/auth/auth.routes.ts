import type { FastifyInstance } from 'fastify';

import { authContainer } from './auth.container';
import { LoginDto, type LoginType } from './dtos/login.dto';
import { RefreshDto, type RefreshType } from './dtos/refresh.dto';
import { RegisterDto, type RegisterType } from './dtos/register.dto';

export const authRoutes = async (fastify: FastifyInstance) => {
  const { authController } = authContainer;

  fastify.post<{ Body: RegisterType }>(
    '/register',
    {
      preValidation: fastify.validate({ body: RegisterDto }),
      schema: {
        description: 'Register a new user account',
        tags: ['Auth'],
        body: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'password'],
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
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
                  accessToken: { type: 'string' },
                  refreshToken: { type: 'string' },
                  user: {
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
      },
    },
    authController.register,
  );

  fastify.post<{ Body: LoginType }>(
    '/login',
    {
      preValidation: fastify.validate({ body: LoginDto }),
      schema: {
        description: 'Authenticate user and return access & refresh tokens',
        tags: ['Auth'],
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
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
                  accessToken: { type: 'string' },
                  refreshToken: { type: 'string' },
                  user: {
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
      },
    },
    authController.login,
  );

  fastify.post<{ Body: RefreshType }>(
    '/refresh',
    {
      preValidation: fastify.validate({ body: RefreshDto }),
      schema: {
        description: 'Refresh the access token using a valid refresh token',
        tags: ['Auth'],
        body: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: { type: 'string' },
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
                  accessToken: { type: 'string' },
                  refreshToken: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    authController.refresh,
  );

  fastify.post<{ Body: Partial<RefreshType> }>(
    '/logout',
    {
      schema: {
        description: 'Logout user and invalidate active refresh token',
        tags: ['Auth'],
        body: {
          type: 'object',
          properties: {
            refreshToken: { type: 'string' },
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
    authController.logout,
  );
};
