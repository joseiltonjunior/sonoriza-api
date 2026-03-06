import { ApiProperty } from '@nestjs/swagger'

class FetchGenresMetaSwaggerDTO {
  @ApiProperty({ example: 100 })
  total!: number

  @ApiProperty({ example: 1 })
  page!: number

  @ApiProperty({ example: 5 })
  lastPage!: number
}

class GenreItemSwaggerDTO {
  @ApiProperty({ example: 'genre-id-uuid' })
  id!: string

  @ApiProperty({ example: 'Rap' })
  name!: string
}

export class FetchGenresResponseSwaggerDTO {
  @ApiProperty({ type: [GenreItemSwaggerDTO] })
  data!: GenreItemSwaggerDTO[]

  @ApiProperty({ type: FetchGenresMetaSwaggerDTO })
  meta!: FetchGenresMetaSwaggerDTO
}
