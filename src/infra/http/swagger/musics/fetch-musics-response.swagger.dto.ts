import { ApiProperty } from '@nestjs/swagger'

class MusicItemSwaggerDTO {
  @ApiProperty({ example: 'uuid' })
  id!: string

  @ApiProperty({ example: 'Masada' })
  title!: string

  @ApiProperty({ example: 'masada' })
  slug!: string
}

class FetchMusicsMetaSwaggerDTO {
  @ApiProperty({ example: 100 })
  total!: number

  @ApiProperty({ example: 1 })
  page!: number

  @ApiProperty({ example: 5 })
  lastPage!: number
}

export class FetchMusicsResponseSwaggerDTO {
  @ApiProperty({ type: [MusicItemSwaggerDTO] })
  data!: MusicItemSwaggerDTO[]

  @ApiProperty({ type: FetchMusicsMetaSwaggerDTO })
  meta!: FetchMusicsMetaSwaggerDTO
}
