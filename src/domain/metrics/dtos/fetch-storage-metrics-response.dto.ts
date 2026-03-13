export type BucketMetricDatapointDTO = {
  Timestamp?: Date
  Average?: number
  Unit?: string
}

export type BucketMetricDTO = {
  Label?: string
  Datapoints?: BucketMetricDatapointDTO[]
}

export type FetchStorageMetricsResponseDTO = {
  data: BucketMetricDTO[]
}
