import { ApiProperty } from '@nestjs/swagger'

class MusicalGenreItemSwaggerDTO {
  @ApiProperty({ example: 'genre-id-uuid' })
  id!: string

  @ApiProperty({ example: 'Forro' })
  name!: string
}

class ArtistMusicItemSwaggerDTO {
  @ApiProperty({ example: 'music-id-uuid' })
  id!: string

  @ApiProperty({ example: 'Masada' })
  title!: string

  @ApiProperty({ example: 'masada' })
  slug!: string

  @ApiProperty({ example: 'https://cdn.sonoriza.com/musics/masada.mp3' })
  audioPath!: string

  @ApiProperty({
    example: 'https://cdn.sonoriza.com/covers/masada.jpg',
    nullable: true,
  })
  coverPath!: string | null
}

export class UpdateArtistResponseSwaggerDTO {
  @ApiProperty({ example: 'artist-id-uuid' })
  id!: string

  @ApiProperty({ example: 'BK' })
  name!: string

  @ApiProperty({ example: 'https://cdn.sonoriza.com/artists/bk.jpg' })
  photoURL!: string

  @ApiProperty({ example: 10 })
  like!: number

  @ApiProperty({ example: ['genre-id-uuid'], type: [String] })
  genreIds!: string[]

  @ApiProperty({ type: [MusicalGenreItemSwaggerDTO] })
  musicalGenres!: MusicalGenreItemSwaggerDTO[]

  @ApiProperty({ type: [ArtistMusicItemSwaggerDTO] })
  musics!: ArtistMusicItemSwaggerDTO[]
}
