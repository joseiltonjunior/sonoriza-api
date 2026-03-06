import { ApiProperty } from '@nestjs/swagger'

export class UpdateArtistResponseSwaggerDTO {
  @ApiProperty({ example: 'artist-id-uuid' })
  id!: string

  @ApiProperty({ example: 'BK' })
  name!: string

  @ApiProperty({ example: 'https://cdn.sonoriza.com/artists/bk.jpg' })
  photoURL!: string

  @ApiProperty({ example: 10 })
  like!: number
}
