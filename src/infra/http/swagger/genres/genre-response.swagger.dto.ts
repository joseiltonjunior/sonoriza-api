import { ApiProperty } from '@nestjs/swagger'

export class GenreResponseSwaggerDTO {
  @ApiProperty({ example: 'genre-id-uuid' })
  id!: string

  @ApiProperty({ example: 'Rap' })
  name!: string
}
