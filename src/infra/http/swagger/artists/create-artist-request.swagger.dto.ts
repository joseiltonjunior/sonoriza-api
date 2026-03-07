import { ApiProperty } from '@nestjs/swagger'

export class CreateArtistRequestSwaggerDTO {
  @ApiProperty({ example: 'Djonga' })
  name!: string

  @ApiProperty({ example: 'https://cdn.sonoriza.com/artists/djonga.jpg' })
  photoURL!: string

  @ApiProperty({
    example: ['genre-id-uuid'],
    required: false,
    type: [String],
  })
  genreIds?: string[]
}
