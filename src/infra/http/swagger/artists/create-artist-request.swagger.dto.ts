import { ApiProperty } from '@nestjs/swagger'

export class CreateArtistRequestSwaggerDTO {
  @ApiProperty({ example: 'Djonga' })
  name!: string

  @ApiProperty({ example: 'https://cdn.sonoriza.com/artists/djonga.jpg' })
  photoURL!: string

  @ApiProperty({ example: 0, required: false, nullable: true })
  like?: number | null
}
