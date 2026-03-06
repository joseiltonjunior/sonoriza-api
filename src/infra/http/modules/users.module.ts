import { Module } from '@nestjs/common'

import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { JwtModule } from '@nestjs/jwt'
import { CreateAccountController } from '../controllers/users/create-account.controller'
import { AuthenticateController } from '../controllers/users/authenticate.controller'
import { PrismaUserRepository } from '@/infra/database/prisma/prisma-user.repository.service'
import {
  UserRepository,
  UserRepositoryToken,
} from '@/domain/users/repositories/user-repository'
import { CreateUserUseCase } from '@/domain/users/use-cases/create-user.use-case'
import { AuthenticateUserUseCase } from '@/domain/users/use-cases/authenticate-user.use-case'

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev',
      signOptions: { expiresIn: '3h' },
    }),
  ],
  controllers: [CreateAccountController, AuthenticateController],
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
  ],
  exports: [CreateUserUseCase, AuthenticateUserUseCase, UserRepositoryToken],
})
export class UsersModule {}
