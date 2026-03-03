import { ApiProperty } from '@nestjs/swagger'

export class UpdateMusicRequestSwaggerDTO {
  @ApiProperty({ example: 'Masada - Remastered', required: false })
  title?: string

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
  })
  coverPath?: string | null

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
}
