# Sonoriza API

![Sonoriza Logo](https://i.ibb.co/hZ7QNB3/sonoriza.png)

<!-- Project developed by [Joseilton Junior](https://github.com/joseiltonjunior) -->

Sonoriza backend API built with NestJS + Prisma + PostgreSQL.

## Overview

This project exposes endpoints for:
- user authentication with JWT (RS256)
- user management (account, session, profile)
- music CRUD (with soft delete)
- music genre CRUD (with soft delete)
- Swagger documentation
- payload validation with Zod

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
- Docker (optional, to run a local database)

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

Create/update the `.env` file:

```env
DATABASE_URL="postgresql://sonoriza:sonoriza@localhost:5432/sonoriza?schema=public"
PORT=3333
JWT_PRIVATE_KEY="<BASE64_PRIVATE_KEY_PEM>"
JWT_PUBLIC_KEY="<BASE64_PUBLIC_KEY_PEM>"
```

### 4) Generate Prisma Client and apply migrations

```bash
pnpm prisma generate
pnpm prisma migrate deploy
```

For development:

```bash
pnpm prisma migrate dev
```

### 5) Start the API

```bash
pnpm start:dev
```

API: `http://localhost:3333`
Swagger: `http://localhost:3333/api`

## Scripts

- `pnpm build` - production build
- `pnpm start` - default start
- `pnpm start:dev` - start with watch
- `pnpm start:prod` - run `dist`
- `pnpm lint` - lint
- `pnpm format` - format
- `pnpm test` - unit tests
- `pnpm test:e2e` - e2e tests
- `pnpm test:cov` - unit coverage
- `pnpm test:e2e:cov` - e2e coverage

## Authentication and authorization

- JWT signed with `RS256`.
- Current payload: `sub` (user id) and `role` (`USER` | `ADMIN`).
- Write routes for `musics` and `genres` are protected by JWT and `ADMIN` role.
- Profile routes (`/me`) require an authenticated user.

## Endpoints

### Users

Base paths:
- `/accounts`
- `/sessions`
- `/me`

- `POST /accounts` - create account
- `POST /sessions` - authenticate and return `access_token`
- `GET /me` - return authenticated user profile
- `PATCH /me` - update authenticated user name/email/photoUrl
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

## Structure (summary)

```text
src/
  domain/
    users/
    musics/
    genres/
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

- The project uses soft delete for `users`, `musics`, `genres`, and `artists`.
- Request validation is done with Zod in controllers.
- Swagger is served at `/api`.
- On Windows, if `pnpm prisma generate` fails with a lock on `query_engine-windows.dll.node`, stop running Node processes (`nest`, `vitest --watch`) and run it again.

## Credits

- Developed by [Joseilton Junior](https://github.com/joseiltonjunior)
- Technical founder and full stack engineer with systemic product vision and pragmatic architecture mindset.
