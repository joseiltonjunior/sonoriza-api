import { FetchStorageMetricsUseCase } from './fetch-storage-metrics.use-case'
import { MetricsService } from '../ports/metrics.service'

class FakeMetricsService implements MetricsService {
  async fetchStorageMetrics() {
    return [
      {
        Label: 'NumberOfObjects',
        Datapoints: [
          {
            Average: 10,
            Unit: 'Count',
          },
        ],
      },
      {
        Label: 'BucketSizeBytes',
        Datapoints: [
          {
            Average: 1024,
            Unit: 'Bytes',
          },
        ],
      },
    ]
  }
}

describe('FetchStorageMetricsUseCase', () => {
  it('should return storage metrics inside data', async () => {
    const useCase = new FetchStorageMetricsUseCase(new FakeMetricsService())

    const result = await useCase.execute()

    expect(result).toEqual({
      data: [
        {
          Label: 'NumberOfObjects',
          Datapoints: [
            {
              Average: 10,
              Unit: 'Count',
            },
          ],
        },
        {
          Label: 'BucketSizeBytes',
          Datapoints: [
            {
              Average: 1024,
              Unit: 'Bytes',
            },
          ],
        },
      ],
    })
  })
})
