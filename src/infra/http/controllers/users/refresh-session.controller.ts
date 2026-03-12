import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { z } from 'zod'

import { RefreshSessionUseCase } from '@/domain/sessions/use-cases/refresh-session.use-case'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { RefreshSessionRequestSwaggerDTO } from '../../swagger/sessions/refresh-session-request.swagger.dto'
import { RefreshSessionResponseSwaggerDTO } from '../../swagger/sessions/refresh-session-response.swagger.dto'

const refreshSessionBodySchema = z.object({
  refresh_token: z.string().min(1),
})

type RefreshSessionBody = z.infer<typeof refreshSessionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(refreshSessionBodySchema)

@ApiTags('Sessions')
@Controller('/sessions/refresh')
export class RefreshSessionController {
  constructor(private readonly refreshSessionUseCase: RefreshSessionUseCase) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshSessionRequestSwaggerDTO })
  @ApiOkResponse({
    description: 'Session refreshed successfully',
    type: RefreshSessionResponseSwaggerDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid refresh token' })
  @ApiBadRequestResponse({ description: 'Invalid request payload' })
  async handle(@Body(bodyValidationPipe) body: RefreshSessionBody) {
    const response = await this.refreshSessionUseCase.execute({
      refreshToken: body.refresh_token,
    })

    return {
      access_token: response.accessToken,
      refresh_token: response.refreshToken,
    }
  }
}
