import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { z } from 'zod'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { ResendAccountVerificationUseCase } from '@/domain/users/use-cases/resend-account-verification.use-case'
import { ResendAccountVerificationRequestSwaggerDTO } from '../../swagger/users/resend-account-verification-request.swagger.dto'
import { ResendAccountVerificationResponseSwaggerDTO } from '../../swagger/users/resend-account-verification-response.swagger.dto'

const resendAccountVerificationBodySchema = z.object({
  email: z.email(),
})

type ResendAccountVerificationBody = z.infer<
  typeof resendAccountVerificationBodySchema
>

const bodyValidationPipe = new ZodValidationPipe(
  resendAccountVerificationBodySchema,
)

@ApiTags('Users')
@Controller('/accounts/resend-verification')
export class ResendAccountVerificationController {
  constructor(
    private readonly resendAccountVerificationUseCase: ResendAccountVerificationUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Resend account verification code',
  })
  @ApiBody({ type: ResendAccountVerificationRequestSwaggerDTO })
  @ApiOkResponse({
    description: 'Verification code sent successfully',
    type: ResendAccountVerificationResponseSwaggerDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Blocked user' })
  @ApiConflictResponse({ description: 'Account already verified' })
  @ApiBadRequestResponse({ description: 'Invalid resend payload' })
  async handle(@Body(bodyValidationPipe) body: ResendAccountVerificationBody) {
    return this.resendAccountVerificationUseCase.execute({
      email: body.email,
    })
  }
}
