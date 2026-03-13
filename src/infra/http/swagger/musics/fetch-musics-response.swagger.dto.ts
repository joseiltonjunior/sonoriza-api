import { ApiProperty } from '@nestjs/swagger'
import { MusicResponseSwaggerDTO } from './music-response.swagger.dto'

class FetchMusicsMetaSwaggerDTO {
  @ApiProperty({ example: 100 })
  total!: number

  @ApiProperty({ example: 1 })
  page!: number

  @ApiProperty({ example: 5 })
  lastPage!: number
}

export class FetchMusicsResponseSwaggerDTO {
  @ApiProperty({ type: [MusicResponseSwaggerDTO] })
  data!: MusicResponseSwaggerDTO[]

  @ApiProperty({ type: FetchMusicsMetaSwaggerDTO })
  meta!: FetchMusicsMetaSwaggerDTO
}
