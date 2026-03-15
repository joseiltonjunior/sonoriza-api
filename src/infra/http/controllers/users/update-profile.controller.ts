import { Body, Controller, Patch, UseGuards } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { UpdateUserUseCase } from '@/domain/users/use-cases/update-user.use-case'
import { UpdateUserDTO } from '@/domain/users/dtos/update-user.dto'

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { UpdateProfileRequestSwaggerDTO } from '../../swagger/users/update-profile-request.swagger.dto'
import { UpdateProfileResponseSwaggerDTO } from '../../swagger/users/update-profile-response.swagger.dto'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const updateProfileBodySchema = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(updateProfileBodySchema)

type UpdateProfileBodySchema = z.infer<typeof updateProfileBodySchema>

@ApiTags('Users')
@Controller('/me')
@UseGuards(JwtAuthGuard)
export class UpdateProfileController {
  constructor(private updateUserUseCase: UpdateUserUseCase) {}

  @Patch()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update authenticated user profile',
  })
  @ApiBody({
    type: UpdateProfileRequestSwaggerDTO,
  })
  @ApiOkResponse({
    description: 'Profile updated successfully',
    type: UpdateProfileResponseSwaggerDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiConflictResponse({ description: 'Email already in use' })
  @ApiBadRequestResponse({ description: 'Invalid request payload' })
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: UpdateProfileBodySchema,
  ) {
    const dto: UpdateUserDTO = {
      name: body.name,
      email: body.email,
    }

    const updated = await this.updateUserUseCase.execute(user.sub, dto)

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      photoUrl: updated.photoUrl,
    }
  }
}
