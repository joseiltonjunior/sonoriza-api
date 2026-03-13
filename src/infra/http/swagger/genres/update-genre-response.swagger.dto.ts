import { ApiProperty } from '@nestjs/swagger'

export class UpdateGenreResponseSwaggerDTO {
  @ApiProperty({ example: 'genre-id-uuid' })
  id!: string

  @ApiProperty({ example: 'Hip Hop' })
  name!: string
}
