import { ApiProperty } from '@nestjs/swagger'

export class UpdateMusicResponseSwaggerDTO {
  @ApiProperty({ example: 'uuid' })
  id!: string

  @ApiProperty({ example: 'Masada - Remastered' })
  title!: string

  @ApiProperty({ example: 'masada' })
  slug!: string
}
