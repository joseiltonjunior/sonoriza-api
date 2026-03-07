import { ApiProperty } from '@nestjs/swagger'

export class CreateMusicRequestSwaggerDTO {
  @ApiProperty({ example: 'Masada' })
  title!: string

  @ApiProperty({ example: 'masada' })
  slug!: string

  @ApiProperty({
    example: 'https://cdn.sonoriza.com/musics/masada.mp3',
    required: false,
    description: 'Alias of audioPath',
  })
  url?: string

  @ApiProperty({
    example: 'Best Of',
    required: false,
    nullable: true,
  })
  album?: string | null

  @ApiProperty({
    example: 'https://cdn.sonoriza.com/covers/masada.jpg',
    required: false,
    nullable: true,
    description: 'Alias of coverPath',
  })
  artwork?: string | null

  @ApiProperty({
    example: '#c53a27',
    required: false,
    nullable: true,
  })
  color?: string | null

  @ApiProperty({
    example: 245,
    required: false,
    nullable: true,
    description: 'Duration in seconds',
  })
  durationSec?: number | null

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    required: false,
    nullable: true,
  })
  releaseDate?: Date | null

  @ApiProperty({
    example: 'genre-id-uuid',
    required: false,
    nullable: true,
  })
  genreId?: string | null

  @ApiProperty({
    type: [String],
    example: ['artist-id-1', 'artist-id-2'],
    required: false,
  })
  artistIds?: string[]
}
