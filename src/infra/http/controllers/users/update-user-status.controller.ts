import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { z } from 'zod'

import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { Roles } from '@/infra/auth/roles.decorator'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { UpdateUserStatusDTO } from '@/domain/users/dtos/update-user-status.dto'
import { UpdateUserStatusUseCase } from '@/domain/users/use-cases/update-user-status.use-case'

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { UpdateUserStatusRequestSwaggerDTO } from '../../swagger/users/update-user-status-request.swagger.dto'
import { UpdateUserStatusResponseSwaggerDTO } from '../../swagger/users/update-user-status-response.swagger.dto'

const updateUserStatusBodySchema = z
  .object({
    accountStatus: z.enum(['ACTIVE', 'PENDING_VERIFICATION', 'SUSPENDED']),
  })
  .strict()

type UpdateUserStatusBody = z.infer<typeof updateUserStatusBodySchema>

const bodyValidationPipe = new ZodValidationPipe(updateUserStatusBodySchema)

@ApiTags('Users')
@Controller('/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UpdateUserStatusController {
  constructor(private updateUserStatusUseCase: UpdateUserStatusUseCase) {}

  @Patch(':id/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user account status (admin only)' })
  @ApiParam({
    name: 'id',
    example: '67502595-593c-4ada-8f2c-b6cd6a743f61',
  })
  @ApiBody({ type: UpdateUserStatusRequestSwaggerDTO })
  @ApiOkResponse({
    description: 'User status updated successfully',
    type: UpdateUserStatusResponseSwaggerDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Insufficient role permissions' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Invalid request payload' })
  async handle(
    @Param('id') id: string,
    @Body(bodyValidationPipe) body: UpdateUserStatusBody,
  ) {
    const dto: UpdateUserStatusDTO = {
      accountStatus: body.accountStatus,
    }

    return this.updateUserStatusUseCase.execute(id, dto)
  }
}
