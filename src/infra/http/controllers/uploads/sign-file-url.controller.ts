import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { z } from 'zod'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { SignFileUrlUseCase } from '@/domain/uploads/use-cases/sign-file-url.use-case'
import { Roles } from '@/infra/auth/roles.decorator'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { SignFileUrlRequestSwaggerDTO } from '../../swagger/uploads/sign-file-url-request.swagger.dto'
import { SignFileUrlResponseSwaggerDTO } from '../../swagger/uploads/sign-file-url-response.swagger.dto'

const signFileUrlBodySchema = z.object({
  url: z.url(),
})

type SignFileUrlBody = z.infer<typeof signFileUrlBodySchema>

const bodyValidationPipe = new ZodValidationPipe(signFileUrlBodySchema)

@Controller('/uploads')
@ApiTags('Uploads')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class SignFileUrlController {
  constructor(private readonly signFileUrlUseCase: SignFileUrlUseCase) {}

  @Post('/sign')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sign a CloudFront file url' })
  @ApiBody({ type: SignFileUrlRequestSwaggerDTO })
  @ApiOkResponse({
    description: 'Signed url generated successfully',
    type: SignFileUrlResponseSwaggerDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Insufficient role permissions' })
  @ApiBadRequestResponse({ description: 'Invalid sign url payload' })
  async handle(@Body(bodyValidationPipe) body: SignFileUrlBody) {
    return this.signFileUrlUseCase.execute({
      url: body.url,
    })
  }
}
