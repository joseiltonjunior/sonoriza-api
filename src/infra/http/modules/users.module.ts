import { Module } from '@nestjs/common'

import { RolesGuard } from '@/infra/auth/roles.guard'
import { JwtSessionTokenService } from '@/infra/auth/jwt-session-token.service'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { AuthenticateUserUseCase } from '@/domain/users/use-cases/authenticate-user.use-case'
import { CreateUserUseCase } from '@/domain/users/use-cases/create-user.use-case'
import { FetchUsersUseCase } from '@/domain/users/use-cases/fetch-users.use-case'
import { GetUserProfileUseCase } from '@/domain/users/use-cases/get-user-profile.use-case'
import {
  UserRepository,
  UserRepositoryToken,
} from '@/domain/users/repositories/user-repository'
import { SoftDeleteUserUseCase } from '@/domain/users/use-cases/soft-delete-user.use-case'
import { UpdateUserStatusUseCase } from '@/domain/users/use-cases/update-user-status.use-case'
import { UpdateUserUseCase } from '@/domain/users/use-cases/update-user.use-case'
import { PrismaUserRepository } from '@/infra/database/prisma/prisma-user.repository.service'
import { CreateSessionUseCase } from '@/domain/sessions/use-cases/create-session.use-case'
import { RefreshSessionUseCase } from '@/domain/sessions/use-cases/refresh-session.use-case'
import { LogoutSessionUseCase } from '@/domain/sessions/use-cases/logout-session.use-case'
import {
  SessionRepository,
  SessionRepositoryToken,
} from '@/domain/sessions/repositories/session-repository'
import {
  SessionTokenService,
  SessionTokenServiceToken,
} from '@/domain/sessions/use-cases/session-token.service'
import { PrismaSessionRepository } from '@/infra/database/prisma/prisma-session.repository.service'

import { AuthenticateController } from '../controllers/users/authenticate.controller'
import { CreateAccountController } from '../controllers/users/create-account.controller'
import { FetchUsersController } from '../controllers/users/fetch-users.controller'
import { GetProfileController } from '../controllers/users/get-profile.controller'
import { LogoutSessionController } from '../controllers/users/logout-session.controller'
import { RefreshSessionController } from '../controllers/users/refresh-session.controller'
import { SoftDeleteProfileController } from '../controllers/users/soft-delete-profile.controller'
import { UpdateProfileController } from '../controllers/users/update-profile.controller'
import { UpdateUserStatusController } from '../controllers/users/update-user-status.controller'

@Module({
  controllers: [
    CreateAccountController,
    AuthenticateController,
    RefreshSessionController,
    LogoutSessionController,
    GetProfileController,
    FetchUsersController,
    UpdateUserStatusController,
    UpdateProfileController,
    SoftDeleteProfileController,
  ],
  providers: [
    PrismaService,
    RolesGuard,
    JwtSessionTokenService,
    {
      provide: UserRepositoryToken,
      useClass: PrismaUserRepository,
    },
    {
      provide: SessionRepositoryToken,
      useClass: PrismaSessionRepository,
    },
    {
      provide: SessionTokenServiceToken,
      useExisting: JwtSessionTokenService,
    },
    {
      provide: CreateUserUseCase,
      useFactory: (repo: UserRepository) => new CreateUserUseCase(repo),
      inject: [UserRepositoryToken],
    },
    {
      provide: AuthenticateUserUseCase,
      useFactory: (repo: UserRepository) => new AuthenticateUserUseCase(repo),
      inject: [UserRepositoryToken],
    },
    {
      provide: CreateSessionUseCase,
      useFactory: (
        sessionRepo: SessionRepository,
        tokenService: SessionTokenService,
      ) => new CreateSessionUseCase(sessionRepo, tokenService),
      inject: [SessionRepositoryToken, SessionTokenServiceToken],
    },
    {
      provide: RefreshSessionUseCase,
      useFactory: (
        sessionRepo: SessionRepository,
        userRepo: UserRepository,
        tokenService: SessionTokenService,
      ) => new RefreshSessionUseCase(sessionRepo, userRepo, tokenService),
      inject: [
        SessionRepositoryToken,
        UserRepositoryToken,
        SessionTokenServiceToken,
      ],
    },
    {
      provide: LogoutSessionUseCase,
      useFactory: (
        sessionRepo: SessionRepository,
        tokenService: SessionTokenService,
      ) => new LogoutSessionUseCase(sessionRepo, tokenService),
      inject: [SessionRepositoryToken, SessionTokenServiceToken],
    },
    {
      provide: GetUserProfileUseCase,
      useFactory: (repo: UserRepository) => new GetUserProfileUseCase(repo),
      inject: [UserRepositoryToken],
    },
    {
      provide: FetchUsersUseCase,
      useFactory: (repo: UserRepository) => new FetchUsersUseCase(repo),
      inject: [UserRepositoryToken],
    },
    {
      provide: UpdateUserStatusUseCase,
      useFactory: (repo: UserRepository) => new UpdateUserStatusUseCase(repo),
      inject: [UserRepositoryToken],
    },
    {
      provide: UpdateUserUseCase,
      useFactory: (repo: UserRepository) => new UpdateUserUseCase(repo),
      inject: [UserRepositoryToken],
    },
    {
      provide: SoftDeleteUserUseCase,
      useFactory: (repo: UserRepository) => new SoftDeleteUserUseCase(repo),
      inject: [UserRepositoryToken],
    },
  ],
  exports: [
    CreateUserUseCase,
    AuthenticateUserUseCase,
    CreateSessionUseCase,
    RefreshSessionUseCase,
    LogoutSessionUseCase,
    GetUserProfileUseCase,
    FetchUsersUseCase,
    UpdateUserStatusUseCase,
    UpdateUserUseCase,
    SoftDeleteUserUseCase,
    UserRepositoryToken,
    SessionRepositoryToken,
    SessionTokenServiceToken,
  ],
})
export class UsersModule {}
