import { ApiProperty } from '@nestjs/swagger'

export class UpdateArtistRequestSwaggerDTO {
  @ApiProperty({ example: 'BK', required: false })
  name?: string

  @ApiProperty({
    example: 'https://cdn.sonoriza.com/artists/bk.jpg',
    required: false,
  })
  photoURL?: string

  @ApiProperty({ example: 10, required: false })
  like?: number
}
