import type { FastifyInstance } from 'fastify';

import { authContainer } from './auth.container';
import { LoginDto, type LoginType } from './dtos/login.dto';
import { RefreshDto, type RefreshType } from './dtos/refresh.dto';
import { RegisterDto, type RegisterType } from './dtos/register.dto';

const UserSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
    firstName: { type: 'string', example: 'John' },
    lastName: { type: 'string', example: 'Doe' },
    email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
    role: { type: 'string', enum: ['ADMIN', 'CUSTOMER'], example: 'CUSTOMER' },
    status: { type: 'string', enum: ['ACCEPTED', 'REJECTED', 'SUSPENDED'], example: 'ACCEPTED' },
    isEmailVerified: { type: 'boolean', example: false },
    lastLoginAt: { type: 'string', format: 'date-time', nullable: true, example: null },
  },
};

const AuthResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    statusCode: { type: 'number', example: 200 },
    message: { type: 'string', example: 'Success' },
    data: {
      type: 'object',
      properties: {
        accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        user: UserSchema,
      },
    },
  },
};

const RefreshResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    statusCode: { type: 'number', example: 200 },
    message: { type: 'string', example: 'Success' },
    data: {
      type: 'object',
      properties: {
        accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
      },
    },
  },
};

const LogoutResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    statusCode: { type: 'number', example: 200 },
    message: { type: 'string', example: 'Success' },
  },
};

const ErrorResponseSchema = {
  type: 'object',
  properties: {
    statusCode: { type: 'number', example: 400 },
    error: { type: 'string', example: 'Bad Request' },
    message: {
      anyOf: [
        { type: 'string', example: 'Invalid email or password' },
        { type: 'array', items: { type: 'string' }, example: ['email: Invalid email address'] },
      ],
    },
  },
};

export const authRoutes = async (fastify: FastifyInstance) => {
  const { authController } = authContainer;

  fastify.post<{ Body: RegisterType }>(
    '/register',
    {
      preValidation: fastify.validate({ body: RegisterDto }),
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '1 minute',
        },
      },
      schema: {
        description: 'Register a new user account',
        tags: ['Auth'],
        body: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'password'],
          properties: {
            firstName: { type: 'string', description: 'User first name' },
            lastName: { type: 'string', description: 'User last name' },
            email: { type: 'string', format: 'email', description: 'User email address' },
            password: {
              type: 'string',
              minLength: 8,
              description: 'User password (min 8 characters)',
            },
          },
        },
        response: {
          200: {
            description: 'Successful registration',
            ...AuthResponseSchema,
            headers: {
              'Set-Cookie': {
                schema: { type: 'string' },
                description: 'Sets access_token and refresh_token cookies',
              },
            },
          },
          400: {
            description: 'Bad Request - Validation failed or email already registered',
            ...ErrorResponseSchema,
          },
          500: {
            description: 'Internal Server Error',
            ...ErrorResponseSchema,
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
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '1 minute',
        },
      },
      schema: {
        description: 'Authenticate user and return access & refresh tokens',
        tags: ['Auth'],
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', description: 'User email address' },
            password: { type: 'string', description: 'User password' },
          },
        },
        response: {
          200: {
            description: 'Successful login',
            ...AuthResponseSchema,
            headers: {
              'Set-Cookie': {
                schema: { type: 'string' },
                description: 'Sets access_token and refresh_token cookies',
              },
            },
          },
          400: {
            description: 'Bad Request - Validation failed',
            ...ErrorResponseSchema,
          },
          401: {
            description: 'Unauthorized - Invalid credentials',
            ...ErrorResponseSchema,
          },
          500: {
            description: 'Internal Server Error',
            ...ErrorResponseSchema,
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
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '1 minute',
        },
      },
      schema: {
        description: 'Refresh the access token using a valid refresh token',
        tags: ['Auth'],
        body: {
          type: 'object',
          properties: {
            refreshToken: {
              type: 'string',
              description: 'Refresh token (optional if provided in cookie)',
            },
          },
        },
        response: {
          200: {
            description: 'Successful token refresh',
            ...RefreshResponseSchema,
            headers: {
              'Set-Cookie': {
                schema: { type: 'string' },
                description: 'Sets access_token and refresh_token cookies',
              },
            },
          },
          400: {
            description: 'Bad Request - Validation failed',
            ...ErrorResponseSchema,
          },
          401: {
            description: 'Unauthorized - Invalid or expired refresh token',
            ...ErrorResponseSchema,
          },
          500: {
            description: 'Internal Server Error',
            ...ErrorResponseSchema,
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
            refreshToken: {
              type: 'string',
              description: 'Refresh token to revoke (optional if provided in cookie)',
            },
          },
        },
        response: {
          200: {
            description: 'Successful logout',
            ...LogoutResponseSchema,
            headers: {
              'Set-Cookie': {
                schema: { type: 'string' },
                description: 'Clears access_token and refresh_token cookies',
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            ...ErrorResponseSchema,
          },
        },
      },
    },
    authController.logout,
  );
};
