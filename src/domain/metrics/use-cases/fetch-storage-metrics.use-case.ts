import { FetchStorageMetricsResponseDTO } from '../dtos/fetch-storage-metrics-response.dto'
import { MetricsService } from './metrics.service'

export class FetchStorageMetricsUseCase {
  constructor(private readonly metricsService: MetricsService) {}

  async execute(): Promise<FetchStorageMetricsResponseDTO> {
    const data = await this.metricsService.fetchStorageMetrics()

    return {
      data,
    }
  }
}
