# Fastify E-Commerce Server

A production-grade Fastify boilerplate set up with TypeScript 7, strict compiler checks, and a strict linting configuration.

## Features

- **TypeScript 7.x & ESM**: High performance compiling and modern module resolution.
- **Strict Linting**: Configured with ESLint 10.x and `@typescript-eslint/eslint-plugin` (running on the TS 6 compatibility API side-by-side to handle TS 7's missing compiler API).
- **Zod Env Validation**: Safe, typed environment variables loaded via `dotenv` and validated at startup using `zod`.
- **Graceful Shutdown**: Handles `SIGINT` and `SIGTERM` signals to cleanly close database connections and finish processing active requests.
- **Access & Refresh Tokens**: Custom authentication plugin utilizing JSON Web Tokens with support for short-lived access tokens and long-lived refresh tokens.
- **OpenAPI / Swagger**: Auto-generated Swagger documentation hosted at `/docs`.
- **Mongoose / MongoDB Plugin**: Fully integrated database plugin with automatic connection state checking and lifecycle hooks.
- **Security Headers**: Standard HTTP security headers configured via `@fastify/helmet` and CORS configuration via `@fastify/cors`.

---

## Directory Structure

```text
├── src/
│   ├── config/
│   │   └── env.ts           # Zod schema environment variable validation
│   ├── plugins/
│   │   ├── auth.ts          # Access & Refresh JWT authentication plugin
│   │   └── db.ts            # Mongoose MongoDB plugin
│   ├── routes/
│   │   └── health.ts        # Health check router
│   ├── app.ts               # Fastify application factory
│   └── server.ts            # Entrypoint starting the Fastify server
├── .env                     # Local environment variables
├── .env.example             # Template for environment variables
├── eslint.config.mjs        # Strict ESLint flat configuration file
├── package.json             # NPM dependencies, metadata & run scripts
└── tsconfig.json            # Strict TypeScript configuration
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v20+ recommended)
- [pnpm](https://pnpm.io/)

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

---

## Available Scripts

### Development

Start the development server with hot-reloading:

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
