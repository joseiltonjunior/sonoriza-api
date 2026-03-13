import { ApiProperty } from '@nestjs/swagger'

class BucketMetricDatapointSwaggerDTO {
  @ApiProperty({ example: '2026-03-11T12:00:00.000Z', nullable: true })
  Timestamp?: Date

  @ApiProperty({ example: 120, nullable: true })
  Average?: number

  @ApiProperty({ example: 'Count', nullable: true })
  Unit?: string
}

class BucketMetricItemSwaggerDTO {
  @ApiProperty({ example: 'NumberOfObjects', nullable: true })
  Label?: string

  @ApiProperty({ type: [BucketMetricDatapointSwaggerDTO], nullable: true })
  Datapoints?: BucketMetricDatapointSwaggerDTO[]
}

export class FetchStorageMetricsResponseSwaggerDTO {
  @ApiProperty({ type: [BucketMetricItemSwaggerDTO] })
  data!: BucketMetricItemSwaggerDTO[]
}
