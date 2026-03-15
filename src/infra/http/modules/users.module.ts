import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

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
import {
  AccountVerificationRepository,
  AccountVerificationRepositoryToken,
} from '@/domain/users/repositories/account-verification-repository'
import { PrismaAccountVerificationRepository } from '@/infra/database/prisma/prisma-account-verification.repository.service'
import {
  TransactionalEmailService,
  TransactionalEmailServiceToken,
} from '@/domain/users/ports/transactional-email.service'
import { LambdaTransactionalEmailService } from '@/infra/integrations/lambda-transactional-email.service'
import { NoopTransactionalEmailService } from '@/infra/integrations/noop-transactional-email.service'
import { IssueAccountVerificationUseCase } from '@/domain/users/use-cases/issue-account-verification.use-case'
import { VerifyAccountUseCase } from '@/domain/users/use-cases/verify-account.use-case'
import { ResendAccountVerificationUseCase } from '@/domain/users/use-cases/resend-account-verification.use-case'
import { Env } from '@/infra/env'
import {
  FileSignerService,
  FileSignerServiceToken,
} from '@/domain/uploads/ports/file-signer.service'
import {
  StorageService,
  StorageServiceToken,
} from '@/domain/uploads/ports/storage.service'
import { UploadUserProfilePhotoUseCase } from '@/domain/users/use-cases/upload-user-profile-photo.use-case'
import {
  ProfileImageProcessorService,
  ProfileImageProcessorServiceToken,
} from '@/domain/users/ports/profile-image-processor.service'

import { AuthenticateController } from '../controllers/users/authenticate.controller'
import { CreateAccountController } from '../controllers/users/create-account.controller'
import { FetchUsersController } from '../controllers/users/fetch-users.controller'
import { GetProfileController } from '../controllers/users/get-profile.controller'
import { LogoutSessionController } from '../controllers/users/logout-session.controller'
import { RefreshSessionController } from '../controllers/users/refresh-session.controller'
import { ResendAccountVerificationController } from '../controllers/users/resend-account-verification.controller'
import { SoftDeleteProfileController } from '../controllers/users/soft-delete-profile.controller'
import { UploadUserProfilePhotoController } from '../controllers/users/upload-user-profile-photo.controller'
import { UpdateProfileController } from '../controllers/users/update-profile.controller'
import { UpdateUserStatusController } from '../controllers/users/update-user-status.controller'
import { VerifyAccountController } from '../controllers/users/verify-account.controller'
import { LambdaFileSignerService } from '@/infra/integrations/lambda-file-signer.service'
import { NoopFileSignerService } from '@/infra/integrations/noop-file-signer.service'
import { NoopProfileImageProcessorService } from '@/infra/images/noop-profile-image-processor.service'
import { SharpProfileImageProcessorService } from '@/infra/images/sharp-profile-image-processor.service'
import { NoopStorageService } from '@/infra/storage/noop-storage.service'
import { S3StorageService } from '@/infra/storage/s3-storage.service'

@Module({
  controllers: [
    CreateAccountController,
    VerifyAccountController,
    ResendAccountVerificationController,
    AuthenticateController,
    RefreshSessionController,
    LogoutSessionController,
    GetProfileController,
    FetchUsersController,
    UpdateUserStatusController,
    UpdateProfileController,
    UploadUserProfilePhotoController,
    SoftDeleteProfileController,
  ],
  providers: [
    PrismaService,
    RolesGuard,
    JwtSessionTokenService,
    LambdaTransactionalEmailService,
    NoopTransactionalEmailService,
    LambdaFileSignerService,
    NoopFileSignerService,
    S3StorageService,
    NoopStorageService,
    SharpProfileImageProcessorService,
    NoopProfileImageProcessorService,
    {
      provide: UserRepositoryToken,
      useClass: PrismaUserRepository,
    },
    {
      provide: SessionRepositoryToken,
      useClass: PrismaSessionRepository,
    },
    {
      provide: AccountVerificationRepositoryToken,
      useClass: PrismaAccountVerificationRepository,
    },
    {
      provide: SessionTokenServiceToken,
      useExisting: JwtSessionTokenService,
    },
    {
      provide: TransactionalEmailServiceToken,
      useFactory: (
        lambdaEmailService: LambdaTransactionalEmailService,
        noopEmailService: NoopTransactionalEmailService,
      ): TransactionalEmailService => {
        return process.env.NODE_ENV === 'test'
          ? noopEmailService
          : lambdaEmailService
      },
      inject: [LambdaTransactionalEmailService, NoopTransactionalEmailService],
    },
    {
      provide: StorageServiceToken,
      useFactory: (
        s3StorageService: S3StorageService,
        noopStorageService: NoopStorageService,
      ): StorageService => {
        return process.env.NODE_ENV === 'test'
          ? noopStorageService
          : s3StorageService
      },
      inject: [S3StorageService, NoopStorageService],
    },
    {
      provide: FileSignerServiceToken,
      useFactory: (
        lambdaFileSignerService: LambdaFileSignerService,
        noopFileSignerService: NoopFileSignerService,
      ): FileSignerService => {
        return process.env.NODE_ENV === 'test'
          ? noopFileSignerService
          : lambdaFileSignerService
      },
      inject: [LambdaFileSignerService, NoopFileSignerService],
    },
    {
      provide: ProfileImageProcessorServiceToken,
      useFactory: (
        sharpProfileImageProcessorService: SharpProfileImageProcessorService,
        noopProfileImageProcessorService: NoopProfileImageProcessorService,
      ): ProfileImageProcessorService => {
        return process.env.NODE_ENV === 'test'
          ? noopProfileImageProcessorService
          : sharpProfileImageProcessorService
      },
      inject: [
        SharpProfileImageProcessorService,
        NoopProfileImageProcessorService,
      ],
    },
    {
      provide: IssueAccountVerificationUseCase,
      useFactory: (
        accountVerificationRepo: AccountVerificationRepository,
        transactionalEmailService: TransactionalEmailService,
        configService: ConfigService<Env, true>,
      ) =>
        new IssueAccountVerificationUseCase(
          accountVerificationRepo,
          transactionalEmailService,
          configService.get('ACCOUNT_VERIFICATION_CODE_EXPIRES_IN_MINUTES', {
            infer: true,
          }),
          configService.get('ACCOUNT_VERIFICATION_RESEND_COOLDOWN_SECONDS', {
            infer: true,
          }),
          configService.get('ACCOUNT_VERIFICATION_MAX_ATTEMPTS', {
            infer: true,
          }),
        ),
      inject: [
        AccountVerificationRepositoryToken,
        TransactionalEmailServiceToken,
        ConfigService,
      ],
    },
    {
      provide: CreateUserUseCase,
      useFactory: (
        repo: UserRepository,
        issueAccountVerificationUseCase: IssueAccountVerificationUseCase,
      ) => new CreateUserUseCase(repo, issueAccountVerificationUseCase),
      inject: [UserRepositoryToken, IssueAccountVerificationUseCase],
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
      provide: VerifyAccountUseCase,
      useFactory: (
        userRepo: UserRepository,
        accountVerificationRepo: AccountVerificationRepository,
        createSessionUseCase: CreateSessionUseCase,
      ) =>
        new VerifyAccountUseCase(
          userRepo,
          accountVerificationRepo,
          createSessionUseCase,
        ),
      inject: [
        UserRepositoryToken,
        AccountVerificationRepositoryToken,
        CreateSessionUseCase,
      ],
    },
    {
      provide: ResendAccountVerificationUseCase,
      useFactory: (
        userRepo: UserRepository,
        accountVerificationRepo: AccountVerificationRepository,
        issueAccountVerificationUseCase: IssueAccountVerificationUseCase,
      ) =>
        new ResendAccountVerificationUseCase(
          userRepo,
          accountVerificationRepo,
          issueAccountVerificationUseCase,
        ),
      inject: [
        UserRepositoryToken,
        AccountVerificationRepositoryToken,
        IssueAccountVerificationUseCase,
      ],
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
      provide: UploadUserProfilePhotoUseCase,
      useFactory: (
        repo: UserRepository,
        storageService: StorageService,
        fileSignerService: FileSignerService,
        profileImageProcessorService: ProfileImageProcessorService,
      ) =>
        new UploadUserProfilePhotoUseCase(
          repo,
          storageService,
          fileSignerService,
          profileImageProcessorService,
        ),
      inject: [
        UserRepositoryToken,
        StorageServiceToken,
        FileSignerServiceToken,
        ProfileImageProcessorServiceToken,
      ],
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
    VerifyAccountUseCase,
    ResendAccountVerificationUseCase,
    RefreshSessionUseCase,
    LogoutSessionUseCase,
    GetUserProfileUseCase,
    FetchUsersUseCase,
    UpdateUserStatusUseCase,
    UpdateUserUseCase,
    UploadUserProfilePhotoUseCase,
    SoftDeleteUserUseCase,
    UserRepositoryToken,
    SessionRepositoryToken,
    SessionTokenServiceToken,
    AccountVerificationRepositoryToken,
    TransactionalEmailServiceToken,
  ],
})
export class UsersModule {}

