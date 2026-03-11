import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { z } from 'zod'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { Roles } from '@/infra/auth/roles.decorator'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { UploadFilesUseCase } from '@/domain/uploads/use-cases/upload-files.use-case'
import { UploadFilesRequestSwaggerDTO } from '../../swagger/uploads/upload-files-request.swagger.dto'
import { UploadFilesResponseSwaggerDTO } from '../../swagger/uploads/upload-files-response.swagger.dto'

const uploadFilesBodySchema = z.object({
  folder: z.enum(['artists', 'musics']),
  slug: z.string().min(1),
})

type UploadFilesBody = z.infer<typeof uploadFilesBodySchema>

const bodyValidationPipe = new ZodValidationPipe(uploadFilesBodySchema)

@Controller('/uploads')
@ApiTags('Uploads')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UploadFilesController {
  constructor(private readonly uploadFilesUseCase: UploadFilesUseCase) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload files and return signed urls' })
  @ApiBody({ type: UploadFilesRequestSwaggerDTO })
  @ApiCreatedResponse({
    description: 'Files uploaded successfully',
    type: UploadFilesResponseSwaggerDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Insufficient role permissions' })
  @ApiBadRequestResponse({ description: 'Invalid upload payload' })
  async handle(
    @UploadedFiles()
    files: Array<{
      originalname: string
      mimetype: string
      size: number
      buffer: Buffer
    }>,
    @Body(bodyValidationPipe) body: UploadFilesBody,
  ) {
    return this.uploadFilesUseCase.execute({
      files,
      folder: body.folder,
      slug: body.slug,
    })
  }
}
