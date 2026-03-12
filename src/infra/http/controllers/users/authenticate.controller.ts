import { Body, Controller, Post } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import z from 'zod'
import { AuthenticateUserUseCase } from '@/domain/users/use-cases/authenticate-user.use-case'

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { AuthenticateRequestSwaggerDTO } from '../../swagger/users/authenticate-request.swagger.dto'
import { AuthenticateResponseSwaggerDTO } from '../../swagger/users/authenticate-response.swagger.dto'
import { CreateSessionUseCase } from '@/domain/sessions/use-cases/create-session.use-case'

const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})

const bodyValidationPipe = new ZodValidationPipe(authenticateBodySchema)

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@ApiTags('Sessions')
@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private authenticateUserUseCase: AuthenticateUserUseCase,
    private createSessionUseCase: CreateSessionUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Authenticate user',
    description:
      'Authenticates a user using email and password and returns access and refresh tokens.',
  })
  @ApiBody({
    type: AuthenticateRequestSwaggerDTO,
    description: 'User credentials',
  })
  @ApiOkResponse({
    description: 'User authenticated successfully',
    type: AuthenticateResponseSwaggerDTO,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  @ApiBadRequestResponse({
    description: 'Invalid request payload',
  })
  async handle(@Body(bodyValidationPipe) body: AuthenticateBodySchema) {
    const user = await this.authenticateUserUseCase.execute({
      email: body.email,
      password: body.password,
    })

    const session = await this.createSessionUseCase.execute({
      userId: user.id,
      role: user.role,
    })

    return {
      access_token: session.accessToken,
      refresh_token: session.refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        photoUrl: user.photoUrl,
        role: user.role,
        isActive: user.isActive,
      },
    }
  }
}
