import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { z } from 'zod'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { Roles } from '@/infra/auth/roles.decorator'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { FetchUsersDTO } from '@/domain/users/dtos/fetch-users.dto'
import { FetchUsersUseCase } from '@/domain/users/use-cases/fetch-users.use-case'

import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger'
import { FetchUsersResponseSwaggerDTO } from '../../swagger/users/fetch-users-response.swagger.dto'
import { UserPresenter } from '../../presenters/user.presenter'

const fetchUsersQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
})

type FetchUsersQuery = z.infer<typeof fetchUsersQuerySchema>

const queryValidationPipe = new ZodValidationPipe(fetchUsersQuerySchema)

@ApiTags('Users')
@Controller('/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class FetchUsersController {
  constructor(private fetchUsersUseCase: FetchUsersUseCase) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Fetch paginated users (admin only)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
  })
  @ApiOkResponse({
    description: 'Paginated list of users',
    type: FetchUsersResponseSwaggerDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Insufficient role permissions' })
  async handle(@Query(queryValidationPipe) query: FetchUsersQuery) {
    const dto: FetchUsersDTO = {
      page: query.page,
    }

    const response = await this.fetchUsersUseCase.execute(dto)

    return {
      data: response.data.map(UserPresenter.toHTTP),
      meta: response.meta,
    }
  }
}
