import { Module } from '@nestjs/common'

import { FetchStorageMetricsUseCase } from '@/domain/metrics/use-cases/fetch-storage-metrics.use-case'
import {
  MetricsService,
  MetricsServiceToken,
} from '@/domain/metrics/ports/metrics.service'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { CloudWatchMetricsService } from '@/infra/integrations/cloudwatch-metrics.service'

import { FetchStorageMetricsController } from '../controllers/metrics/fetch-storage-metrics.controller'

@Module({
  controllers: [FetchStorageMetricsController],
  providers: [
    RolesGuard,
    {
      provide: MetricsServiceToken,
      useClass: CloudWatchMetricsService,
    },
    {
      provide: FetchStorageMetricsUseCase,
      useFactory: (metricsService: MetricsService) =>
        new FetchStorageMetricsUseCase(metricsService),
      inject: [MetricsServiceToken],
    },
  ],
})
export class MetricsModule {}

