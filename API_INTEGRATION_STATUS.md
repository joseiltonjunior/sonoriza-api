# Sonoriza API - Full Integration Reference

## Purpose of this document

This file documents the current state of the Sonoriza API for the projects:
- Sonoriza Admin
- Sonoriza Mobile (React Native)

It is intended to be copied into other project chats so every client stays aligned with how the API currently works.

## Online environment

- Swagger: [https://sonoriza-api.onrender.com/docs](https://sonoriza-api.onrender.com/docs)
- API base URL: `https://sonoriza-api.onrender.com`

## Product context

The current API is the backend for the Sonoriza platform and already supports:
- user authentication and session lifecycle
- account verification by e-mail with code confirmation
- user administration
- music catalog management
- artist catalog management
- genre management
- S3 upload orchestration
- CloudFront URL signing through the backend
- CloudWatch bucket metrics through the backend

It is no longer just a simple CRUD API. It now centralizes authentication, session renewal, AWS integration, transactional e-mail onboarding, and core catalog operations.

## Current architecture

The codebase is organized in layered form:

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

Main architectural characteristics:
- domain rules are separated from HTTP and Prisma
- repositories are abstracted in the domain and implemented in Prisma
- request validation uses Zod
- documentation is exposed through Swagger
- soft delete is used instead of destructive removal for core entities

## Current database model

### Enums

- `Role`
  - `USER`
  - `ADMIN`
- `AccountStatus`
  - `PENDING_VERIFICATION`
  - `ACTIVE`
  - `SUSPENDED`

### Main entities

#### User
Represents the platform account.

Fields:
- `id`
- `name`
- `email`
- `password`
- `role`
- `accountStatus`
- `photoUrl`
- `emailVerifiedAt`
- `createdAt`
- `updatedAt`
- `deletedAt`

Relations:
- `musicLikes`
- `artistLikes`
- `musicViews`
- `sessions`
- `accountVerifications`

Current rule:
- user is created as `accountStatus = PENDING_VERIFICATION`
- user becomes `ACTIVE` only after code verification
- user can later be moved to `SUSPENDED` by admin

#### Music
Represents a music item in the catalog.

Fields:
- `id`
- `title`
- `slug`
- `album`
- `coverPath`
- `audioPath`
- `color`
- `likesCount`
- `viewsCount`
- `durationSec`
- `releaseDate`
- `genreId`
- `createdAt`
- `updatedAt`
- `deletedAt`

Relations:
- `genre`
- `artists`
- `likes`
- `views`

#### Artist
Represents an artist.

Fields:
- `id`
- `name`
- `photoURL`
- `likesCount`
- `createdAt`
- `updatedAt`
- `deletedAt`

Relations:
- `musics`
- `musicalGenres`
- `likes`

#### Genre
Represents a music genre.

Fields:
- `id`
- `name`
- `createdAt`
- `updatedAt`
- `deletedAt`

Relations:
- `musics`
- `artists`

#### Session
Represents a persisted refresh-token-backed session.

Fields:
- `id`
- `userId`
- `refreshTokenJti`
- `refreshTokenHash`
- `expiresAt`
- `revokedAt`
- `lastUsedAt`
- `replacedById`
- `createdAt`
- `updatedAt`

Purpose:
- keep refresh token state in the database
- support refresh rotation
- support logout with revocation

#### AccountVerification
Represents the current e-mail verification state for a pending account.

Fields:
- `id`
- `userId`
- `codeHash`
- `expiresAt`
- `resendAvailableAt`
- `attempts`
- `maxAttempts`
- `verifiedAt`
- `revokedAt`
- `createdAt`
- `updatedAt`

Purpose:
- store verification codes as hashes
- enforce code expiration
- enforce resend cooldown
- track attempts and invalidate abused codes

### Join tables

- `MusicArtist`
- `ArtistGenre`
- `MusicLike`
- `ArtistLike`

### View tracking

#### MusicView
Represents a view/listen tracking record.

Fields:
- `id`
- `musicId`
- `userId`
- `ipHash`
- `userAgentHash`
- `createdAt`

## Authentication and authorization

### Access model

The API uses:
- short-lived `access_token`
- long-lived `refresh_token`

### Access token
Used on protected routes.

Characteristics:
- JWT with RS256
- contains `sub` and `role`
- used in `Authorization: Bearer <token>`

### Refresh token
Used only to renew the session.

Characteristics:
- persisted in database through `sessions`
- uses `jti`
- stored as hash in database
- rotated on refresh

### Current authorization rules

A user can authenticate only if:
- user exists
- password matches
- `accountStatus = ACTIVE`
- `deletedAt = null`

Admin-only routes require:
- valid `access_token`
- `role = ADMIN`

## Session lifecycle

### Login

Endpoint:
- `POST /sessions`

Request:

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

Response:

```json
{
  "access_token": "jwt-access-token",
  "refresh_token": "jwt-refresh-token",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "photoUrl": null,
    "role": "USER",
    "accountStatus": "ACTIVE"
  }
}
```

Important:
- pending accounts receive `403 Account pending verification`
- suspended accounts receive `401 Unauthorized`

### Refresh session

Endpoint:
- `POST /sessions/refresh`

Request:

```json
{
  "refresh_token": "jwt-refresh-token"
}
```

Response:

```json
{
  "access_token": "new-access-token",
  "refresh_token": "new-refresh-token"
}
```

### Logout

Endpoint:
- `POST /sessions/logout`

Request:

```json
{
  "refresh_token": "jwt-refresh-token"
}
```

Response:
- `204 No Content`

### Current session behavior

- refresh token rotation is mandatory
- old session is revoked when refresh succeeds
- logout revokes the current session
- abandoned sessions can remain stored in the database until expiration or cleanup
- expired session rows may still exist physically in the database but are no longer valid for use

### What is not implemented yet

Not implemented yet:
- deviceId-based session lifecycle
- FCM token linkage
- session cleanup job
- device registry

## User domain

### Create account

Endpoint:
- `POST /accounts`

Behavior:
- API creates the account internally
- `accountStatus` is not received from the client
- new account is created as `PENDING_VERIFICATION`
- API generates and persists a verification code
- API dispatches the transactional e-mail through Lambda

### Verify account

Endpoint:
- `POST /accounts/verify`

Behavior:
- receives `email` and `code`
- validates the latest pending verification
- activates the account
- returns `access_token`, `refresh_token`, and `user`

### Resend verification code

Endpoint:
- `POST /accounts/resend-verification`

Behavior:
- receives `email`
- enforces a backend cooldown of `60s`
- revokes the previous pending code
- issues and sends a new verification code

### Get authenticated profile

Endpoint:
- `GET /me`

Response includes:
- `id`
- `name`
- `email`
- `role`
- `accountStatus`
- `photoUrl`

Example:

```json
{
  "id": "user-id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "accountStatus": "ACTIVE",
  "photoUrl": null
}
```

### Update own profile

Endpoint:
- `PATCH /me`

Purpose:
- update authenticated user profile
- does not serve as admin edit endpoint for other users

### Soft delete own profile

Endpoint:
- `DELETE /me`

Behavior:
- user is soft deleted
- user should no longer authenticate after deletion
- soft delete also moves the user to `SUSPENDED`

### Admin user endpoints

#### Fetch paginated users
- `GET /users?page=1`

#### Update user status
- `PATCH /users/:id/status`

Purpose:
- update the specific user `accountStatus` as admin

Important:
- admin can move status between `ACTIVE`, `PENDING_VERIFICATION`, and `SUSPENDED`
- admin is not using `PATCH /me` to edit another user profile

## Music domain

### What a music currently represents

A music is still a catalog entity focused on streaming/music consumption.

Response payload uses the presenter shape:

```json
{
  "id": "music-id",
  "title": "Masada",
  "url": "https://cdn.example.com/musics/masada.mp3",
  "genreId": "genre-id",
  "genre": "Rap",
  "album": "Best Of",
  "artwork": "https://cdn.example.com/covers/masada.jpg",
  "color": "#c53a27",
  "like": 92,
  "view": 10500,
  "artists": []
}
```

### Create music

Endpoint:
- `POST /musics`

Access:
- ADMIN

### Fetch musics

Endpoint:
- `GET /musics?page=1`

Filters currently supported:
- `title`
- `artistId`
- `album`

Examples:
- `GET /musics?page=1&title=sonho`
- `GET /musics?page=1&artistId=<artist-id>`
- `GET /musics?page=1&album=ao-vivo`
- `GET /musics?page=1&title=sonho&album=ao-vivo`

Search behavior:
- partial match
- case-insensitive
- paginated
- excludes soft deleted records

### Get music by id

Endpoint:
- `GET /musics/:id`

Purpose:
- fetch exactly one music item

### Update music

Endpoint:
- `PATCH /musics/:id`

Access:
- ADMIN

### Delete music

Endpoint:
- `DELETE /musics/:id`

Behavior:
- soft delete
- ADMIN only

## Artist domain

### What an artist currently represents

An artist includes:
- core artist data
- linked genres
- linked musics

Presenter response shape:

```json
{
  "id": "artist-id",
  "name": "Paulo Pires",
  "photoURL": "https://cdn.example.com/artists/paulo-pires.jpg",
  "like": 0,
  "genreIds": ["genre-id"],
  "musicalGenres": [
    {
      "id": "genre-id",
      "name": "Forro"
    }
  ],
  "musics": [
    {
      "id": "music-id",
      "title": "Nome da faixa",
      "slug": "nome-da-faixa",
      "audioPath": "https://cdn.example.com/musics/faixa.mp3",
      "album": "Ao Vivo",
      "coverPath": "https://cdn.example.com/covers/faixa.jpg"
    }
  ]
}
```

### Create artist

Endpoint:
- `POST /artists`

Access:
- ADMIN

### Fetch artists

Endpoint:
- `GET /artists?page=1`

Filters currently supported:
- `name`
- `genreId`

Examples:
- `GET /artists?page=1&name=natan`
- `GET /artists?page=1&genreId=<genre-id>`
- `GET /artists?page=1&name=natan&genreId=<genre-id>`

Behavior:
- paginated
- case-insensitive search by name
- genre filter by relation table
- excludes soft deleted artists

### Get artist by id

Endpoint:
- `GET /artists/:id`

Purpose:
- fetch exactly one artist
- includes linked musics
- nested music payload currently includes `album`

### Update artist

Endpoint:
- `PATCH /artists/:id`

Access:
- ADMIN

### Delete artist

Endpoint:
- `DELETE /artists/:id`

Behavior:
- soft delete
- ADMIN only

## Genre domain

### Create genre
- `POST /genres`

### Fetch genres
- `GET /genres?page=1`

### Update genre
- `PATCH /genres/:id`

### Delete genre
- `DELETE /genres/:id`

Genre routes are authenticated and admin-protected where mutation is involved.

## Upload domain

AWS access has been centralized into the API.

Frontend should no longer upload directly with AWS credentials.

### Upload files

Endpoint:
- `POST /uploads`

Protection:
- valid JWT
- ADMIN role

Payload:
- `multipart/form-data`
- fields:
  - `files`
  - `folder`
  - `slug`

Current allowed folders:
- `artists`
- `musics`

Example use cases:
- artist image upload
- music cover upload
- audio upload

Response example:

```json
{
  "files": [
    {
      "originalName": "toque-carinhoso.mp3",
      "key": "musics/paulo-pires/toque-carinhoso.mp3",
      "url": "https://cdn.example.com/musics/paulo-pires/toque-carinhoso.mp3",
      "signedUrl": "https://cdn.example.com/musics/paulo-pires/toque-carinhoso.mp3?...",
      "contentType": "audio/mpeg",
      "size": 7561926,
      "kind": "audio"
    }
  ]
}
```

### Sign existing CloudFront URL

Endpoint:
- `POST /uploads/sign`

Payload:

```json
{
  "url": "https://cdn.example.com/musics/paulo-pires/toque-carinhoso.mp3"
}
```

Response:

```json
{
  "signedUrl": "https://cdn.example.com/musics/paulo-pires/toque-carinhoso.mp3?..."
}
```

### Important note for mobile

The current upload endpoint is administrative.
It does not support regular authenticated user uploads.

If mobile needs avatar upload or user-generated upload later, this should be introduced as a separate endpoint and permission model.

## Metrics domain

### Fetch storage metrics

Endpoint:
- `GET /metrics/storage`

Protection:
- valid JWT
- ADMIN role

Purpose:
- centralize S3/CloudWatch metrics in the backend
- remove direct AWS CloudWatch usage from CMS/frontend

Response shape:

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

## Soft delete policy

Soft delete is currently applied to:
- `users`
- `musics`
- `artists`
- `genres`

Consequences:
- deleted records stop appearing in normal fetch endpoints
- historical data remains in the database
- authentication is blocked for deleted users

## API sections in Swagger

Swagger is organized in these sections:
- `Users`
- `Sessions`
- `Musics`
- `Artists`
- `Genres`
- `Uploads`
- `Metrics`

Session routes were explicitly separated from Users to keep authentication/session concerns clearer.

## What each client should use

### Sonoriza Admin

Should rely on the API for:
- login
- refresh token
- logout
- account verification administration when needed
- user management
- music CRUD
- artist CRUD
- genre CRUD
- uploads
- signed URL generation
- bucket metrics

Admin should not use AWS directly anymore.

### Sonoriza Mobile

Should rely on the API for:
- account creation
- account verification flow
- resend verification flow
- login
- refresh token flow
- logout
- `GET /me`
- `GET /musics`
- `GET /musics/:id`
- `GET /artists`
- `GET /artists/:id`
- `GET /genres`

Recommended mobile auth flow:
1. create account with `POST /accounts`
2. prompt for verification code
3. verify account with `POST /accounts/verify`
4. store `access_token` and `refresh_token`
5. call protected routes using `access_token`
6. when expired, call `POST /sessions/refresh`
7. replace stored tokens with the new pair
8. if refresh fails, send user back to login

## Current limitations and next natural steps

Known limitations at the current stage:
- no device lifecycle yet
- no FCM token lifecycle in the API yet
- no cleanup job for expired/revoked sessions
- upload endpoint is not designed for regular user uploads
- user profile photo upload still needs a dedicated authenticated endpoint outside the admin upload flow
- the domain is still centered on music/artist/genre and has not yet been remodeled into broader distribution/content architecture

Most natural next steps:
- deviceId support
- FCM token registration/update flow
- session cleanup routine
- dedicated authenticated avatar upload
- future content/distribution remodel

## Executive summary

The Sonoriza API has evolved from a simple music backend into a platform-oriented backend with:
- structured authentication
- persisted session lifecycle
- refresh token support
- account verification by e-mail
- admin governance
- richer mobile search/filter capabilities
- centralized AWS operations
- stable integration contracts through Swagger

This document should be considered the current integration reference for Sonoriza Admin and Sonoriza Mobile.
