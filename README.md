# Fastify E-Commerce Server

A production-grade Fastify boilerplate set up with TypeScript 7, strict compiler checks, and a strict linting configuration.

## Features

- **TypeScript 7.x & ESM**: High performance compiling and modern module resolution.
- **Strict Linting**: Configured with ESLint 10.x and `@typescript-eslint/eslint-plugin` (running on the TS 6 compatibility API side-by-side to handle TS 7's missing compiler API).
- **Zod Env Validation**: Safe, typed environment variables loaded via `dotenv` and validated at startup using `zod`.
- **Graceful Shutdown**: Handles `SIGINT` and `SIGTERM` signals to cleanly close database connections and finish processing active requests.
- **Access & Refresh Tokens**: Custom authentication plugin utilizing JSON Web Tokens with support for short-lived access tokens (via cookie or `Authorization` header) and long-lived refresh tokens.
- **OpenAPI / Swagger**: Auto-generated Swagger documentation hosted at `/docs`.
- **Mongoose / MongoDB Plugin**: Fully integrated database plugin with automatic connection state checking and lifecycle hooks.
- **Security Headers**: Standard HTTP security headers configured via `@fastify/helmet` and CORS configuration via `@fastify/cors`.
- **Clean Architecture / Dependency Injection**: Handled cleanly via modules and dependency-injected containers.

---

## Directory Structure

```text
├── src/
│   ├── core/
│   │   ├── base/               # Base controller, repository, service, and types
│   │   ├── config/             # Zod environment config and schema options
│   │   ├── dtos/               # Core DTOs (ID, List, Pagination, Search, Sort)
│   │   ├── enums/              # Core Enums (User enums)
│   │   ├── error/              # Custom app errors, error codes, and global error handler
│   │   ├── plugins/            # Fastify plugins (Auth, Database, Validation)
│   │   ├── services/           # Core services (JWT, Password hashing, Logger)
│   │   ├── types/              # Common types (Auth, Response)
│   │   └── utils/              # Utility helper functions (Response formatting)
│   ├── modules/
│   │   ├── health/             # Health check module (Container, controller, service, routes)
│   │   ├── refresh-token/      # Refresh token module (Model, repository, service, routes)
│   │   ├── users/              # User management module (Model, repository, service, controller, routes)
│   │   └── app.routes.ts       # Module router aggregation
│   ├── shared/                 # Shared domain modules (currently empty)
│   ├── app.ts                  # Fastify application builder / bootstrap
│   └── server.ts               # Web server entrypoint
├── .env                        # Local environment variables configuration
├── .env.example                # Example environment variables template
├── eslint.config.js            # Flat ESLint configuration file (custom rules, prettier integration)
├── package.json                # Project dependencies, script configurations, metadata
├── tsconfig.json               # TypeScript configuration with strict compiler options
└── README.md                   # Project documentation
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v20+ recommended)
- [pnpm](https://pnpm.io/) (v10+ recommended)
- [MongoDB](https://www.mongodb.com/) (Running locally or a URI to a remote cluster)

### Installation

Install the project dependencies using `pnpm`:

```bash
pnpm install
```

### Configuration

Copy the example environment template and configure your values:

```bash
cp .env.example .env
```

Ensure all variables in `.env` are filled out correctly. The server will fail to start if any of the environment variables do not satisfy the `zod` schema in [env.config.ts](file:///C:/Users/Admin/Desktop/Project/fastify-ecommerce/src/core/config/env.config.ts).

Key Environment Variables:
| Variable | Description | Default / Requirement |
| --- | --- | --- |
| `PORT` | Port the server listens on | `3000` |
| `HOST` | Host address | `localhost` |
| `NODE_ENV` | Running environment (`development`, `production`, `test`) | `development` |
| `MONGO_URI` | Connection string for MongoDB | `mongodb://localhost:27017/fastify-ecommerce` |
| `JWT_ACCESS_SECRET` | 32+ char secret for JWT access tokens | *Required* |
| `JWT_REFRESH_SECRET` | 32+ char secret for JWT refresh tokens | *Required* |
| `JWT_ACCESS_EXPIRY` | Access token expiration duration | `15m` |
| `JWT_REFRESH_EXPIRY` | Refresh token expiration duration | `7d` |
| `COOKIE_SECRET` | 32+ char secret for cookie encryption | *Required* |

---

## API Endpoints

All application routes are prefixed with `/api/v1`.

### Health Check
- `GET /api/v1/health` - Check application and database health status.

### Users
- `GET /api/v1/users/me` - Retrieve authenticated user's profile details.
- `GET /api/v1/users/:id` - Retrieve details of a specific user.
- `PATCH /api/v1/users/me` - Update authenticated user's profile information.
- `POST /api/v1/users/me/change-password` - Change authenticated user's password.
- `PATCH /api/v1/users/:id/role` - Update a user's role (Admin only).
- `PATCH /api/v1/users/:id/status` - Update a user's status (Admin only).
- `DELETE /api/v1/users/:id` - Soft-delete a user by ID.

### Refresh Tokens
- `POST /api/v1/refresh-tokens/revoke/:jti` - Revoke a specific active refresh token by its JTI identifier.
- `POST /api/v1/refresh-tokens/revoke-all` - Revoke all active refresh tokens for the authenticated user.

---

## Available Scripts

### Development

Start the development server with hot-reloading using `tsx`:

```bash
pnpm run dev
```

### Build

Compile TypeScript source files into the `dist/` directory using TypeScript 7:

```bash
pnpm run build
```

### Start

Start the compiled production application (requires building first):

```bash
pnpm run start
```

### Linting

Run the strict ESLint checks:

```bash
pnpm run lint
```

Auto-fix lint errors where possible:

```bash
pnpm run lint:fix
```

