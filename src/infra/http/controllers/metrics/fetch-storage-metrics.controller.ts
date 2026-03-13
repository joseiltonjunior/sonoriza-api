import { Controller, Get, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { FetchStorageMetricsUseCase } from '@/domain/metrics/use-cases/fetch-storage-metrics.use-case'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { Roles } from '@/infra/auth/roles.decorator'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { FetchStorageMetricsResponseSwaggerDTO } from '../../swagger/metrics/fetch-storage-metrics-response.swagger.dto'

@ApiTags('Metrics')
@Controller('/metrics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class FetchStorageMetricsController {
  constructor(
    private readonly fetchStorageMetricsUseCase: FetchStorageMetricsUseCase,
  ) {}

  @Get('/storage')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fetch S3 bucket storage metrics' })
  @ApiOkResponse({
    description: 'Storage metrics fetched successfully',
    type: FetchStorageMetricsResponseSwaggerDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Insufficient role permissions' })
  async handle() {
    return this.fetchStorageMetricsUseCase.execute()
  }
}
