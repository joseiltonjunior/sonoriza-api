import { ApiProperty } from '@nestjs/swagger'

export class UpdateGenreRequestSwaggerDTO {
  @ApiProperty({ example: 'Hip Hop' })
  name!: string
}
