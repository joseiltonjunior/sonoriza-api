import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { UploadUserProfilePhotoUseCase } from '@/domain/users/use-cases/upload-user-profile-photo.use-case'
import { UserProfileResponseSwaggerDTO } from '../../swagger/users/user-profile-response.swagger.dto'
import { UploadUserProfilePhotoRequestSwaggerDTO } from '../../swagger/users/upload-user-profile-photo-request.swagger.dto'

@ApiTags('Users')
@Controller('/me')
@UseGuards(JwtAuthGuard)
export class UploadUserProfilePhotoController {
  constructor(
    private readonly uploadUserProfilePhotoUseCase: UploadUserProfilePhotoUseCase,
  ) {}

  @Post('/photo')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload authenticated user profile photo',
  })
  @ApiBody({
    type: UploadUserProfilePhotoRequestSwaggerDTO,
  })
  @ApiCreatedResponse({
    description: 'Profile photo uploaded successfully',
    type: UserProfileResponseSwaggerDTO,
  })
  @ApiBadRequestResponse({ description: 'Invalid profile photo payload' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  async handle(
    @CurrentUser() user: UserPayload,
    @UploadedFile()
    file:
      | {
          buffer: Buffer
          mimetype: string
          size: number
        }
      | undefined,
  ) {
    if (!file) {
      throw new BadRequestException('Profile photo is required')
    }

    return this.uploadUserProfilePhotoUseCase.execute({
      userId: user.sub,
      file,
    })
  }
}
