import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { FileSignerService, FileSignerServiceToken } from '@/domain/uploads/use-cases/file-signer.service'
import { SignFileUrlUseCase } from '@/domain/uploads/use-cases/sign-file-url.use-case'
import { StorageServiceToken } from '@/domain/uploads/use-cases/storage.service'
import { UploadFilesUseCase } from '@/domain/uploads/use-cases/upload-files.use-case'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Env } from '@/infra/env'
import { SignFileUrlController } from '../controllers/uploads/sign-file-url.controller'
import { UploadFilesController } from '../controllers/uploads/upload-files.controller'
import { LambdaFileSignerService } from '@/infra/integrations/lambda-file-signer.service'
import { S3StorageService } from '@/infra/storage/s3-storage.service'

@Module({
  controllers: [UploadFilesController, SignFileUrlController],
  providers: [
    RolesGuard,
    {
      provide: StorageServiceToken,
      useClass: S3StorageService,
    },
    {
      provide: FileSignerServiceToken,
      useClass: LambdaFileSignerService,
    },
    {
      provide: UploadFilesUseCase,
      useFactory: (
        storageService: S3StorageService,
        fileSignerService: LambdaFileSignerService,
        configService: ConfigService<Env, true>,
      ) =>
        new UploadFilesUseCase(
          storageService,
          fileSignerService,
          configService.get('UPLOAD_MAX_FILE_SIZE_MB', { infer: true }),
        ),
      inject: [StorageServiceToken, FileSignerServiceToken, ConfigService],
    },
    {
      provide: SignFileUrlUseCase,
      useFactory: (fileSignerService: FileSignerService) =>
        new SignFileUrlUseCase(fileSignerService),
      inject: [FileSignerServiceToken],
    },
  ],
})
export class UploadsModule {}
