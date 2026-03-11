import { Module } from '@nestjs/common'

import { RolesGuard } from '@/infra/auth/roles.guard'
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

import { AuthenticateController } from '../controllers/users/authenticate.controller'
import { CreateAccountController } from '../controllers/users/create-account.controller'
import { FetchUsersController } from '../controllers/users/fetch-users.controller'
import { GetProfileController } from '../controllers/users/get-profile.controller'
import { SoftDeleteProfileController } from '../controllers/users/soft-delete-profile.controller'
import { UpdateProfileController } from '../controllers/users/update-profile.controller'
import { UpdateUserStatusController } from '../controllers/users/update-user-status.controller'

@Module({
  controllers: [
    CreateAccountController,
    AuthenticateController,
    GetProfileController,
    FetchUsersController,
    UpdateUserStatusController,
    UpdateProfileController,
    SoftDeleteProfileController,
  ],
  providers: [
    PrismaService,
    RolesGuard,
    {
      provide: UserRepositoryToken,
      useClass: PrismaUserRepository,
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
    GetUserProfileUseCase,
    FetchUsersUseCase,
    UpdateUserStatusUseCase,
    UpdateUserUseCase,
    SoftDeleteUserUseCase,
    UserRepositoryToken,
  ],
})
export class UsersModule {}
