import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserStatusResponseSwaggerDTO {
  @ApiProperty({
    example: '67502595-593c-4ada-8f2c-b6cd6a743f61',
    format: 'uuid',
  })
  id!: string

  @ApiProperty({
    example: true,
  })
  isActive!: boolean

  @ApiProperty({
    example: '2026-01-01T00:00:00.000Z',
  })
  updatedAt!: Date
}
