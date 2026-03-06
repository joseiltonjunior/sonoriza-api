import { Module } from '@nestjs/common'

import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { CreateAccountController } from '../controllers/users/create-account.controller'
import { AuthenticateController } from '../controllers/users/authenticate.controller'
import { PrismaUserRepository } from '@/infra/database/prisma/prisma-user.repository.service'
import {
  UserRepository,
  UserRepositoryToken,
} from '@/domain/users/repositories/user-repository'
import { CreateUserUseCase } from '@/domain/users/use-cases/create-user.use-case'
import { AuthenticateUserUseCase } from '@/domain/users/use-cases/authenticate-user.use-case'
import { UpdateUserUseCase } from '@/domain/users/use-cases/update-user.use-case'
import { SoftDeleteUserUseCase } from '@/domain/users/use-cases/soft-delete-user.use-case'
import { UpdateProfileController } from '../controllers/users/update-profile.controller'
import { SoftDeleteProfileController } from '../controllers/users/soft-delete-profile.controller'
import { GetProfileController } from '../controllers/users/get-profile.controller'
import { GetUserProfileUseCase } from '@/domain/users/use-cases/get-user-profile.use-case'

@Module({
  controllers: [
    CreateAccountController,
    AuthenticateController,
    GetProfileController,
    UpdateProfileController,
    SoftDeleteProfileController,
  ],
  providers: [
    PrismaService,
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
    UpdateUserUseCase,
    SoftDeleteUserUseCase,
    UserRepositoryToken,
  ],
})
export class UsersModule {}
