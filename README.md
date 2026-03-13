# Sonoriza API

![Sonoriza Logo](https://i.ibb.co/hZ7QNB3/sonoriza.png)

Sonoriza backend built with NestJS, Prisma, and PostgreSQL.

## Overview

The API currently covers:
- JWT authentication with RS256
- access token + refresh token with session rotation
- account verification by email with code confirmation
- user lifecycle (`/accounts`, `/me`, `/users`)
- session endpoints (`/sessions`, `/sessions/refresh`, `/sessions/logout`)
- user status administration
- CRUD for artists, genres, and musics
- file upload to S3 with Lambda-based signing
- standalone CloudFront URL signing through the API
- S3 bucket metrics through CloudWatch
- Swagger at `/docs`
- request validation with Zod
- unit and e2e tests with Vitest

## Stack

- Node.js
- NestJS 11
- Prisma
- PostgreSQL
- AWS S3
- AWS Lambda
- AWS CloudWatch
- Swagger
- Vitest

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

Update `.env` with at least:

```env
DATABASE_URL="postgresql://sonoriza:sonoriza@localhost:5432/sonoriza?schema=public"
PORT=3333
JWT_PRIVATE_KEY="<BASE64_PRIVATE_KEY_PEM>"
JWT_PUBLIC_KEY="<BASE64_PUBLIC_KEY_PEM>"
JWT_ACCESS_TOKEN_EXPIRES_IN="3h"
JWT_REFRESH_TOKEN_EXPIRES_IN="30d"
ACCOUNT_VERIFICATION_CODE_EXPIRES_IN_MINUTES=10
ACCOUNT_VERIFICATION_RESEND_COOLDOWN_SECONDS=60
ACCOUNT_VERIFICATION_MAX_ATTEMPTS=5
AWS_REGION="sa-east-1"
AWS_ACCESS_KEY_ID="replace-me"
AWS_SECRET_ACCESS_KEY="replace-me"
AWS_S3_BUCKET="sonoriza-media"
CLOUDFRONT_DOMAIN="https://cdn.example.com/"
UPLOAD_LAMBDA_SIGN_FUNCTION_NAME="cloudfront-presign-url"
TRANSACTIONAL_EMAIL_LAMBDA_FUNCTION_NAME="send-transactional-email"
UPLOAD_MAX_FILE_SIZE_MB=15
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

### 5) Start the API

```bash
pnpm start:dev
```

API: `http://localhost:3333`  
Swagger: `http://localhost:3333/docs`

## Scripts

- `pnpm build` - production build
- `pnpm start` - default start
- `pnpm start:dev` - watch mode
- `pnpm start:prod` - run from `dist`
- `pnpm lint` - lint
- `pnpm format` - formatting
- `pnpm test` - unit tests
- `pnpm test:e2e` - e2e tests
- `pnpm test:cov` - unit coverage
- `pnpm test:e2e:cov` - e2e coverage

## Authentication and authorization

- JWT is signed with `RS256`
- the access token includes `sub` and `role` (`USER` | `ADMIN`)
- protected routes require a valid access token
- admin routes require `role = ADMIN`
- account access is controlled by `accountStatus`
- new accounts are created as `PENDING_VERIFICATION`
- login is allowed only for `accountStatus = ACTIVE` and `deletedAt = null`
- account verification codes are emailed through Lambda + SES
- refresh tokens are persisted in `sessions`
- refresh tokens use `jti`, hashed storage, and mandatory rotation

## Endpoints

### Users

Base paths:
- `/accounts`
- `/me`
- `/users`

- `POST /accounts` - create account
- `POST /accounts/verify` - verify account code and immediately authenticate the user
- `POST /accounts/resend-verification` - resend verification code with API-side cooldown
- `GET /me` - return authenticated profile
- `PATCH /me` - update own profile
- `DELETE /me` - soft delete own user
- `GET /users?page=1` - paginated user list (ADMIN)
- `PATCH /users/:id/status` - update `accountStatus` for a user (ADMIN)

User account statuses:
- `PENDING_VERIFICATION`
- `ACTIVE`
- `SUSPENDED`

### Sessions

Base path: `/sessions`

- `POST /sessions` - authenticate and return `access_token`, `refresh_token`, and `user`
- `POST /sessions/refresh` - rotate the session and return a new `access_token` and `refresh_token`
- `POST /sessions/logout` - revoke the current session using `refresh_token`

Notes:
- `POST /sessions` returns `403` when the account is still pending verification.
- `POST /accounts/verify` activates the account and opens the first session in the same request.

### Musics

Base path: `/musics`

- `POST /musics` - create music (ADMIN)
- `GET /musics?page=1` - paginated authenticated list
- `GET /musics?page=1&title=<term>` - filter by title
- `GET /musics?page=1&artistId=<artist-id>` - filter by artist
- `GET /musics?page=1&album=<album>` - filter by album
- `GET /musics/:id` - get music by id
- `PATCH /musics/:id` - update music (ADMIN)
- `DELETE /musics/:id` - soft delete music (ADMIN)

### Genres

Base path: `/genres`

- `POST /genres` - create genre (ADMIN)
- `GET /genres?page=1` - paginated authenticated list
- `PATCH /genres/:id` - update genre (ADMIN)
- `DELETE /genres/:id` - soft delete genre (ADMIN)

### Artists

Base path: `/artists`

- `POST /artists` - create artist (ADMIN)
- `GET /artists?page=1` - paginated authenticated list
- `GET /artists?page=1&name=<term>` - filter by name
- `GET /artists?page=1&genreId=<genre-id>` - filter by genre
- `GET /artists/:id` - get artist by id
- `PATCH /artists/:id` - update artist (ADMIN)
- `DELETE /artists/:id` - soft delete artist (ADMIN)

Notes:
- `GET /artists` also returns the musics linked to each artist.
- `GET /artists/:id` returns linked musics with `album` in the nested payload.

### Uploads

Base path: `/uploads`

- `POST /uploads` - multipart upload to S3 with Lambda-based signing (ADMIN)
- `POST /uploads/sign` - receive a CloudFront URL and return `signedUrl` (ADMIN)

`POST /uploads` payload:
- `files` - file array
- `folder` - `artists` or `musics`
- `slug` - segment used in the file key

### Metrics

Base path: `/metrics`

- `GET /metrics/storage` - return S3 bucket metrics through CloudWatch (ADMIN)

Response format:

```json
{
  "data": [
    {
      "Label": "NumberOfObjects",
      "Datapoints": []
    },
    {
      "Label": "BucketSizeBytes",
      "Datapoints": []
    }
  ]
}
```

## Architecture summary

```text
src/
  domain/
    artists/
    genres/
    metrics/
    musics/
    sessions/
    uploads/
    users/
  infra/
    auth/
    database/prisma/
    http/controllers/
    http/modules/
    http/presenters/
    http/swagger/
    integrations/
    storage/
    main.ts
prisma/
  schema.prisma
  migrations/
```

## Notes

- Soft delete is applied to `users`, `musics`, `genres`, and `artists`.
- Controllers validate requests with Zod.
- Swagger is available at `/docs`.
- File signing uses a Lambda function by name, not direct frontend AWS access.
- The CMS and mobile app can consume uploads, signing, and metrics without shipping AWS credentials.
- Refresh token does not replace the access token on protected routes; it is only used to renew the session.
- `users.isActive` was removed; user access now depends on `accountStatus`.

## Credits

- Developed by [Joseilton Junior](https://github.com/joseiltonjunior)
- Technical founder profile: a product-oriented full stack engineer with pragmatic software architecture and systemic platform vision.
