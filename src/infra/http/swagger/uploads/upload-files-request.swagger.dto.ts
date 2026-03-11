import { ApiProperty } from '@nestjs/swagger'

export class UploadFilesRequestSwaggerDTO {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
  })
  files!: unknown[]

  @ApiProperty({
    example: 'musics',
    enum: ['artists', 'musics'],
  })
  folder!: 'artists' | 'musics'

  @ApiProperty({
    example: 'paulo-pires',
  })
  slug!: string
}
