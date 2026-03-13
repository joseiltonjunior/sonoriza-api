import { ApiProperty } from '@nestjs/swagger'

class MusicalGenreSwaggerDTO {
  @ApiProperty({ example: 'genre-id-uuid' })
  id!: string

  @ApiProperty({ example: 'Rap' })
  name!: string
}

class ArtistSwaggerDTO {
  @ApiProperty({ example: 'artist-id-uuid' })
  id!: string

  @ApiProperty({ example: 'Djonga' })
  name!: string

  @ApiProperty({ example: 'https://cdn.sonoriza.com/artists/djonga.jpg' })
  photoURL!: string

  @ApiProperty({ type: [String], example: ['music-id-1', 'music-id-2'] })
  musics!: string[]

  @ApiProperty({ example: 1450 })
  like!: number

  @ApiProperty({ type: [MusicalGenreSwaggerDTO] })
  musicalGenres!: MusicalGenreSwaggerDTO[]
}

export class MusicResponseSwaggerDTO {
  @ApiProperty({ example: 'music-id-uuid' })
  id!: string

  @ApiProperty({ example: 'Masada' })
  title!: string

  @ApiProperty({ example: 'https://cdn.sonoriza.com/musics/masada.mp3' })
  url!: string

  @ApiProperty({ example: 'genre-id-uuid', nullable: true })
  genreId!: string | null

  @ApiProperty({ example: 'Rap', nullable: true })
  genre!: string | null

  @ApiProperty({ example: 'Best Of', nullable: true })
  album!: string | null

  @ApiProperty({
    example: 'https://cdn.sonoriza.com/covers/masada.jpg',
    nullable: true,
  })
  artwork!: string | null

  @ApiProperty({ example: '#c53a27', nullable: true })
  color!: string | null

  @ApiProperty({ example: 92 })
  like!: number

  @ApiProperty({ example: 10500 })
  view!: number

  @ApiProperty({ type: [ArtistSwaggerDTO] })
  artists!: ArtistSwaggerDTO[]
}
