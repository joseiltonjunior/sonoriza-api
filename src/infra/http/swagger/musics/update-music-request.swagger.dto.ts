import { ApiProperty } from '@nestjs/swagger'

export class UpdateMusicRequestSwaggerDTO {
  @ApiProperty({ example: 'Masada - Remastered', required: false })
  title?: string

  @ApiProperty({ example: 'masada-remastered', required: false })
  slug?: string

  @ApiProperty({
    example: 'https://cdn.sonoriza.com/musics/masada.mp3',
    required: false,
    description: 'Alias accepted: url',
  })
  audioPath?: string

  @ApiProperty({
    example: 'https://cdn.sonoriza.com/musics/masada.mp3',
    required: false,
    description: 'Alias of audioPath',
  })
  url?: string

  @ApiProperty({
    example: 'Best Of Deluxe',
    required: false,
    nullable: true,
  })
  album?: string | null

  @ApiProperty({
    example: 'https://cdn.sonoriza.com/covers/masada.jpg',
    required: false,
    nullable: true,
    description: 'Alias accepted: artwork',
  })
  coverPath?: string | null

  @ApiProperty({
    example: 'https://cdn.sonoriza.com/covers/masada.jpg',
    required: false,
    nullable: true,
    description: 'Alias of coverPath',
  })
  artwork?: string | null

  @ApiProperty({
    example: '#000000',
    required: false,
    nullable: true,
  })
  color?: string | null

  @ApiProperty({
    example: 300,
    required: false,
    nullable: true,
  })
  durationSec?: number | null

  @ApiProperty({
    example: '2025-01-01T00:00:00.000Z',
    required: false,
    nullable: true,
  })
  releaseDate?: Date | null

  @ApiProperty({
    example: 'uuid-do-genero',
    required: false,
    nullable: true,
  })
  genreId?: string | null

  @ApiProperty({
    type: [String],
    required: false,
    example: ['artist-id-1', 'artist-id-2'],
  })
  artistIds?: string[]
}
