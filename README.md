# Sonoriza API

API backend do Sonoriza, construida com NestJS + Prisma + PostgreSQL.

## Visao geral

Este projeto expoe endpoints para gestao de musicas com:
- criacao de musica
- listagem paginada
- atualizacao
- soft delete
- documentacao Swagger
- validacao de payload com Zod

## Stack

- Node.js
- NestJS 11
- Prisma
- PostgreSQL
- Swagger (`/api`)
- Jest (testes unitarios)

## Requisitos

- Node.js 20+
- pnpm
- Docker (opcional, para subir o banco local)

## Setup rapido

### 1) Instalar dependencias

```bash
pnpm install
```

### 2) Subir PostgreSQL (opcional, recomendado)

```bash
docker compose up -d
```

O `docker-compose.yml` ja sobe um banco com:
- host: `localhost`
- porta: `5432`
- user: `sonoriza`
- password: `sonoriza`
- database: `sonoriza`

### 3) Configurar ambiente

Crie/ajuste o arquivo `.env`:

```env
DATABASE_URL="postgresql://sonoriza:sonoriza@localhost:5432/sonoriza?schema=public"
PORT=3333
```

### 4) Rodar migrations

```bash
pnpm exec prisma migrate deploy
```

Para desenvolvimento:

```bash
pnpm exec prisma migrate dev
```

### 5) Iniciar API

```bash
pnpm start:dev
```

API em: `http://localhost:3333`
Swagger em: `http://localhost:3333/api`

## Scripts

- `pnpm build` - build de producao
- `pnpm start` - start padrao
- `pnpm start:dev` - start com watch
- `pnpm start:prod` - executa `dist`
- `pnpm lint` - lint
- `pnpm format` - formatacao
- `pnpm test` - testes unitarios (Jest)
- `pnpm test:watch` - testes em watch
- `pnpm test:cov` - cobertura

## Endpoints de Musics

Base path: `/musics`

### `POST /musics`
Cria uma musica.

Campos principais do body:
- `title` (string, obrigatorio)
- `slug` (string, obrigatorio)
- `url` ou `audioPath` (um dos dois obrigatorio)
- `album` (string | null)
- `artwork` ou `coverPath` (aliases)
- `color` (string | null)
- `like` (number | null)
- `view` (number | null)
- `durationSec` (number | null)
- `releaseDate` (ISO string | null)
- `genreId` (string | null)
- `artistIds` (string[])

Retorno (shape atual):
- `id`, `title`, `url`, `genre`, `album`, `artwork`, `color`, `like`, `view`, `artists`

### `GET /musics?page=1`
Lista musicas paginadas.

Retorno:
- `data`: array de musicas
- `meta`: `{ total, page, lastPage }`

### `PATCH /musics/:id`
Atualiza campos da musica.

### `DELETE /musics/:id`
Soft delete da musica (`204`).

## Erros de dominio esperados

No fluxo de criacao de musica:
- `MUSIC_SLUG_ALREADY_EXISTS` (409)
- `GENRE_NOT_FOUND` (404)
- `ARTIST_NOT_FOUND` (404)

## Testes

Exemplo para rodar apenas os testes de use-cases de musicas:

```bash
pnpm test -- src/domain/musics/use-cases
```

Exemplo para rodar um teste especifico:

```bash
pnpm test -- src/domain/musics/use-cases/create-music.use-case.spec.ts
```

## Estrutura (resumo)

```text
src/
  domain/
    musics/
      entities/
      dtos/
      use-cases/
      repositories/
      errors/
  infra/
    database/prisma/
    http/controllers/
    http/swagger/
    http/presenters/
    main.ts
prisma/
  schema.prisma
  migrations/
```

## Observacoes

- O projeto usa soft delete para musicas.
- O endpoint Swagger e montado em `/api` no bootstrap da aplicacao.
- Validacoes de request sao feitas com Zod nos controllers.
