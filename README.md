# Sonoriza API

![Sonoriza Logo](https://i.ibb.co/hZ7QNB3/sonoriza.png)

Backend da Sonoriza construida com NestJS, Prisma e PostgreSQL.

## Overview

A API hoje cobre:
- autenticacao JWT com RS256
- ciclo de vida de usuarios (`/accounts`, `/sessions`, `/me`)
- administracao de status de usuario
- CRUD de artistas, generos e musicas
- upload de arquivos para S3 com assinatura via Lambda
- metricas de bucket S3 via CloudWatch
- Swagger em `/api`
- validacao com Zod
- testes unitarios e e2e com Vitest

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
- Docker (opcional, para PostgreSQL local)

## Quick setup

### 1) Install dependencies

```bash
pnpm install
```

### 2) Start PostgreSQL (optional, recommended)

```bash
docker compose up -d
```

O `docker-compose.yml` sobe um banco com:
- host: `localhost`
- port: `5432`
- user: `sonoriza`
- password: `sonoriza`
- database: `sonoriza`

### 3) Configure environment

Atualize o `.env` com pelo menos:

```env
DATABASE_URL="postgresql://sonoriza:sonoriza@localhost:5432/sonoriza?schema=public"
PORT=3333
JWT_PRIVATE_KEY="<BASE64_PRIVATE_KEY_PEM>"
JWT_PUBLIC_KEY="<BASE64_PUBLIC_KEY_PEM>"
AWS_REGION="sa-east-1"
AWS_ACCESS_KEY_ID="replace-me"
AWS_SECRET_ACCESS_KEY="replace-me"
AWS_S3_BUCKET="sonoriza-media"
CLOUDFRONT_DOMAIN="https://cdn.example.com/"
UPLOAD_LAMBDA_SIGN_FUNCTION_NAME="cloudfront-presign-url"
UPLOAD_MAX_FILE_SIZE_MB=12
```

### 4) Generate Prisma client and apply migrations

```bash
pnpm prisma generate
pnpm prisma migrate deploy
```

Para desenvolvimento local:

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

- `pnpm build` - build de producao
- `pnpm start` - start padrao
- `pnpm start:dev` - watch mode
- `pnpm start:prod` - run de `dist`
- `pnpm lint` - lint
- `pnpm format` - formatacao
- `pnpm test` - testes unitarios
- `pnpm test:e2e` - testes e2e
- `pnpm test:cov` - coverage unitario
- `pnpm test:e2e:cov` - coverage e2e

## Authentication and authorization

- JWT assinado com `RS256`
- o payload do token inclui `sub` e `role` (`USER` | `ADMIN`)
- rotas protegidas exigem usuario autenticado
- rotas administrativas exigem `role = ADMIN`
- login exige `isActive = true` e `deletedAt = null`
- contas novas sao criadas desativadas por padrao

## Endpoints

### Users

Base paths:
- `/accounts`
- `/sessions`
- `/me`
- `/users`

- `POST /accounts` - cria conta (usuario nasce inativo)
- `POST /sessions` - autentica e retorna `access_token`
- `GET /me` - retorna perfil autenticado
- `PATCH /me` - atualiza proprio perfil
- `DELETE /me` - soft delete do proprio usuario
- `GET /users?page=1` - lista paginada de usuarios (ADMIN)
- `PATCH /users/:id/status` - ativa ou desativa usuario (ADMIN)

### Musics

Base path: `/musics`

- `POST /musics` - cria musica (ADMIN)
- `GET /musics?page=1` - lista paginada autenticada
- `GET /musics?page=1&artistId=<artist-id>` - lista paginada filtrando por artista
- `GET /musics/:id` - retorna musica por id
- `PATCH /musics/:id` - atualiza musica (ADMIN)
- `DELETE /musics/:id` - soft delete de musica (ADMIN)

### Genres

Base path: `/genres`

- `POST /genres` - cria genero (ADMIN)
- `GET /genres?page=1` - lista paginada autenticada
- `PATCH /genres/:id` - atualiza genero (ADMIN)
- `DELETE /genres/:id` - soft delete de genero (ADMIN)

### Artists

Base path: `/artists`

- `POST /artists` - cria artista (ADMIN)
- `GET /artists?page=1` - lista paginada autenticada
- `PATCH /artists/:id` - atualiza artista (ADMIN)
- `DELETE /artists/:id` - soft delete de artista (ADMIN)

Observacao: `GET /artists` retorna tambem as musicas vinculadas a cada artista.

### Uploads

Base path: `/uploads`

- `POST /uploads` - upload multipart para S3 com assinatura via Lambda (ADMIN)
- `POST /uploads/sign` - recebe uma URL do CloudFront e retorna `signedUrl` (ADMIN)

Payload de `POST /uploads`:
- `files` - array de arquivos
- `folder` - `artists` ou `musics`
- `slug` - segmento usado na key do arquivo

### Metrics

Base path: `/metrics`

- `GET /metrics/storage` - retorna metricas do bucket S3 via CloudWatch (ADMIN)

Formato de resposta:

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

- Soft delete e aplicado em `users`, `musics`, `genres` e `artists`.
- Controllers validam requests com Zod.
- Swagger fica disponivel em `/api`.
- O signer de arquivos usa Lambda por nome de funcao, nao chamada direta do frontend para AWS.
- O CMS pode consumir upload, assinatura e metricas sem carregar credenciais AWS.

## Credits

- Developed by [Joseilton Junior](https://github.com/joseiltonjunior)
- Technical founder profile: a product-oriented full stack engineer with pragmatic software architecture and systemic platform vision.
