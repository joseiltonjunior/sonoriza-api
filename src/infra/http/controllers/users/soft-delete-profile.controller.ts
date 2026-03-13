import { Controller, Delete, HttpCode, UseGuards } from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { SoftDeleteUserUseCase } from '@/domain/users/use-cases/soft-delete-user.use-case'

@ApiTags('Users')
@Controller('/me')
@UseGuards(JwtAuthGuard)
export class SoftDeleteProfileController {
  constructor(private softDeleteUserUseCase: SoftDeleteUserUseCase) {}

  @Delete()
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Soft delete authenticated user account',
  })
  @ApiNoContentResponse({
    description: 'Account deleted successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async handle(@CurrentUser() user: UserPayload): Promise<void> {
    await this.softDeleteUserUseCase.execute(user.sub)
  }
}
