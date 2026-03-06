import { Controller, Get, UseGuards } from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { GetUserProfileUseCase } from '@/domain/users/use-cases/get-user-profile.use-case'
import { UserProfileResponseSwaggerDTO } from '../../swagger/users/user-profile-response.swagger.dto'

@ApiTags('Users')
@Controller('/me')
@UseGuards(JwtAuthGuard)
export class GetProfileController {
  constructor(private getUserProfileUseCase: GetUserProfileUseCase) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get authenticated user profile',
  })
  @ApiOkResponse({
    description: 'Profile fetched successfully',
    type: UserProfileResponseSwaggerDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async handle(@CurrentUser() user: UserPayload) {
    return this.getUserProfileUseCase.execute(user.sub)
  }
}
