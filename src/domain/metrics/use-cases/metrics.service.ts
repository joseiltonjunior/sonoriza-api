import { BucketMetricDTO } from '../dtos/fetch-storage-metrics-response.dto'

export const MetricsServiceToken = Symbol('MetricsService')

export interface MetricsService {
  fetchStorageMetrics(): Promise<BucketMetricDTO[]>
}
