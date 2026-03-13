import { ApiProperty } from '@nestjs/swagger'

export class CreateGenreResponseSwaggerDTO {
  @ApiProperty({ example: 'genre-id-uuid' })
  id!: string

  @ApiProperty({ example: 'Rap' })
  name!: string
}
