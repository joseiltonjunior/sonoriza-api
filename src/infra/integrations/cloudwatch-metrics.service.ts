import {
  GetMetricStatisticsCommand,
  CloudWatchClient,
} from '@aws-sdk/client-cloudwatch'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { BucketMetricDTO } from '@/domain/metrics/dtos/fetch-storage-metrics-response.dto'
import { MetricsService } from '@/domain/metrics/ports/metrics.service'
import { Env } from '@/infra/env'

@Injectable()
export class CloudWatchMetricsService implements MetricsService {
  private readonly client: CloudWatchClient

  constructor(private readonly config: ConfigService<Env, true>) {
    this.client = new CloudWatchClient({
      region: this.config.get('AWS_REGION', { infer: true }),
      credentials: {
        accessKeyId: this.config.get('AWS_ACCESS_KEY_ID', { infer: true }),
        secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY', {
          infer: true,
        }),
      },
    })
  }

  async fetchStorageMetrics(): Promise<BucketMetricDTO[]> {
    try {
      const endTime = new Date()
      const startTime = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
      const bucketName = this.config.get('AWS_S3_BUCKET', { infer: true })

      const [numberOfObjects, bucketSizeBytes] = await Promise.all([
        this.client.send(
          new GetMetricStatisticsCommand({
            MetricName: 'NumberOfObjects',
            Namespace: 'AWS/S3',
            Dimensions: [
              {
                Name: 'BucketName',
                Value: bucketName,
              },
              {
                Name: 'StorageType',
                Value: 'AllStorageTypes',
              },
            ],
            StartTime: startTime,
            EndTime: endTime,
            Period: 3600,
            Statistics: ['Average'],
          }),
        ),
        this.client.send(
          new GetMetricStatisticsCommand({
            MetricName: 'BucketSizeBytes',
            Namespace: 'AWS/S3',
            Dimensions: [
              {
                Name: 'BucketName',
                Value: bucketName,
              },
              {
                Name: 'StorageType',
                Value: 'StandardStorage',
              },
            ],
            StartTime: startTime,
            EndTime: endTime,
            Period: 3600,
            Statistics: ['Average'],
          }),
        ),
      ])

      return [
        {
          Label: numberOfObjects.Label,
          Datapoints: numberOfObjects.Datapoints?.map((item) => ({
            Timestamp: item.Timestamp,
            Average: item.Average,
            Unit: item.Unit,
          })),
        },
        {
          Label: bucketSizeBytes.Label,
          Datapoints: bucketSizeBytes.Datapoints?.map((item) => ({
            Timestamp: item.Timestamp,
            Average: item.Average,
            Unit: item.Unit,
          })),
        },
      ]
    } catch {
      throw new InternalServerErrorException('Failed to fetch storage metrics')
    }
  }
}

