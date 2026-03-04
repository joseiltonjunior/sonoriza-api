import { ApiProperty } from '@nestjs/swagger'
import { MusicResponseSwaggerDTO } from './music-response.swagger.dto'

export class UpdateMusicResponseSwaggerDTO extends MusicResponseSwaggerDTO {
  @ApiProperty({ example: 'music-id-uuid' })
  id!: string
}
