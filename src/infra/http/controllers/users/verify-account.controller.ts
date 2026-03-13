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
import { VerifyAccountUseCase } from '@/domain/users/use-cases/verify-account.use-case'
import { AuthenticateResponseSwaggerDTO } from '../../swagger/users/authenticate-response.swagger.dto'
import { VerifyAccountRequestSwaggerDTO } from '../../swagger/users/verify-account-request.swagger.dto'

const verifyAccountBodySchema = z.object({
  email: z.email(),
  code: z.string().trim().length(6),
})

type VerifyAccountBody = z.infer<typeof verifyAccountBodySchema>

const bodyValidationPipe = new ZodValidationPipe(verifyAccountBodySchema)

@ApiTags('Users')
@Controller('/accounts/verify')
export class VerifyAccountController {
  constructor(private readonly verifyAccountUseCase: VerifyAccountUseCase) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify account and authenticate user',
  })
  @ApiBody({ type: VerifyAccountRequestSwaggerDTO })
  @ApiOkResponse({
    description: 'Account verified successfully',
    type: AuthenticateResponseSwaggerDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Blocked user' })
  @ApiConflictResponse({ description: 'Account already verified' })
  @ApiBadRequestResponse({ description: 'Invalid verification payload' })
  async handle(@Body(bodyValidationPipe) body: VerifyAccountBody) {
    const response = await this.verifyAccountUseCase.execute({
      email: body.email,
      code: body.code,
    })

    return {
      access_token: response.accessToken,
      refresh_token: response.refreshToken,
      user: response.user,
    }
  }
}
