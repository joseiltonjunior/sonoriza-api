# Sonoriza API

![Sonoriza Logo](https://i.ibb.co/hZ7QNB3/sonoriza.png)

Sonoriza backend API built with NestJS + Prisma + PostgreSQL.

## Overview

This project exposes endpoints for:
- JWT authentication with RS256
- profile lifecycle for users (`/me`: get, update, soft delete)
- CRUD for musics, genres and artists
- role-based access control for protected writes
- Swagger documentation
- payload validation with Zod
- unit and e2e tests with Vitest

## Stack

- Node.js
- NestJS 11
- Prisma
- PostgreSQL
- Swagger (`/api`)
- Vitest (unit and e2e)

## Requirements

- Node.js 20+
- pnpm
- Docker (optional, for local PostgreSQL)

## Quick setup

### 1) Install dependencies

```bash
pnpm install
```

### 2) Start PostgreSQL (optional, recommended)

```bash
docker compose up -d
```

The `docker-compose.yml` starts a database with:
- host: `localhost`
- port: `5432`
- user: `sonoriza`
- password: `sonoriza`
- database: `sonoriza`

### 3) Configure environment

Create/update `.env`:

```env
DATABASE_URL="postgresql://sonoriza:sonoriza@localhost:5432/sonoriza?schema=public"
PORT=3333
JWT_PRIVATE_KEY="<BASE64_PRIVATE_KEY_PEM>"
JWT_PUBLIC_KEY="<BASE64_PUBLIC_KEY_PEM>"
```

### 4) Generate Prisma client and apply migrations

```bash
pnpm prisma generate
pnpm prisma migrate deploy
```

For local development:

```bash
pnpm prisma migrate dev
```

### 5) Start API

```bash
pnpm start:dev
```

API: `http://localhost:3333`  
Swagger: `http://localhost:3333/api`

## Scripts

- `pnpm build` - production build
- `pnpm start` - default start
- `pnpm start:dev` - watch mode
- `pnpm start:prod` - run from `dist`
- `pnpm lint` - lint
- `pnpm format` - format
- `pnpm test` - unit tests
- `pnpm test:e2e` - e2e tests
- `pnpm test:cov` - unit coverage
- `pnpm test:e2e:cov` - e2e coverage

## Authentication and authorization

- JWT signed with `RS256`
- token payload includes `sub` and `role` (`USER` | `ADMIN`)
- protected write routes require authenticated user
- admin-only write routes require `role = ADMIN`
- access also requires `isActive = true` and `deletedAt = null`

## Endpoints

### Users

Base paths:
- `/accounts`
- `/sessions`
- `/me`

- `POST /accounts` - create account
- `POST /sessions` - authenticate and return `access_token`
- `GET /me` - get authenticated profile
- `PATCH /me` - update own profile (`name`, `email`, `photoUrl`)
- `DELETE /me` - soft delete own account

### Musics

Base path: `/musics`

- `POST /musics` - create music (ADMIN)
- `GET /musics?page=1` - paginated list (public)
- `PATCH /musics/:id` - update music (ADMIN)
- `DELETE /musics/:id` - soft delete music (ADMIN)

### Genres

Base path: `/genres`

- `POST /genres` - create genre (ADMIN)
- `GET /genres?page=1` - paginated list (public)
- `PATCH /genres/:id` - update genre (ADMIN)
- `DELETE /genres/:id` - soft delete genre (ADMIN)

### Artists

Base path: `/artists`

- `POST /artists` - create artist (ADMIN)
- `GET /artists?page=1` - paginated list (public)
- `PATCH /artists/:id` - update artist (ADMIN)
- `DELETE /artists/:id` - soft delete artist (ADMIN)

## Architecture summary

```text
src/
  domain/
    users/
    musics/
    genres/
    artists/
  infra/
    auth/
    database/prisma/
    http/controllers/
    http/modules/
    http/presenters/
    http/swagger/
    main.ts
prisma/
  schema.prisma
  migrations/
test/
  setup-e2e.ts
```

## Notes

- Soft delete is applied to `users`, `musics`, `genres`, and `artists`.
- Controllers validate requests using Zod.
- Swagger is available at `/api`.
- On Windows, if `pnpm prisma generate` fails with `query_engine-windows.dll.node` lock, stop running Node processes (`nest`, `vitest --watch`) and retry.

## Credits

- Developed by [Joseilton Junior](https://github.com/joseiltonjunior)
- Technical founder profile: a product-oriented full stack engineer with pragmatic software architecture and systemic platform vision.
