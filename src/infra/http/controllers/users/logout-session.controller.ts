import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { z } from 'zod'

import { LogoutSessionUseCase } from '@/domain/sessions/use-cases/logout-session.use-case'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { LogoutSessionRequestSwaggerDTO } from '../../swagger/sessions/logout-session-request.swagger.dto'

const logoutSessionBodySchema = z.object({
  refresh_token: z.string().min(1),
})

type LogoutSessionBody = z.infer<typeof logoutSessionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(logoutSessionBodySchema)

@ApiTags('Sessions')
@Controller('/sessions/logout')
export class LogoutSessionController {
  constructor(private readonly logoutSessionUseCase: LogoutSessionUseCase) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Logout current session' })
  @ApiBody({ type: LogoutSessionRequestSwaggerDTO })
  @ApiNoContentResponse({ description: 'Session logged out successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid refresh token' })
  @ApiBadRequestResponse({ description: 'Invalid request payload' })
  async handle(@Body(bodyValidationPipe) body: LogoutSessionBody) {
    await this.logoutSessionUseCase.execute({
      refreshToken: body.refresh_token,
    })
  }
}
