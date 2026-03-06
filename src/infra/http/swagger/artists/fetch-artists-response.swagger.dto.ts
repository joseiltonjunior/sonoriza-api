import { ApiProperty } from '@nestjs/swagger'

class FetchArtistsMetaSwaggerDTO {
  @ApiProperty({ example: 100 })
  total!: number

  @ApiProperty({ example: 1 })
  page!: number

  @ApiProperty({ example: 5 })
  lastPage!: number
}

class ArtistItemSwaggerDTO {
  @ApiProperty({ example: 'artist-id-uuid' })
  id!: string

  @ApiProperty({ example: 'Djonga' })
  name!: string

  @ApiProperty({ example: 'https://cdn.sonoriza.com/artists/djonga.jpg' })
  photoURL!: string

  @ApiProperty({ example: 1450 })
  like!: number
}

export class FetchArtistsResponseSwaggerDTO {
  @ApiProperty({ type: [ArtistItemSwaggerDTO] })
  data!: ArtistItemSwaggerDTO[]

  @ApiProperty({ type: FetchArtistsMetaSwaggerDTO })
  meta!: FetchArtistsMetaSwaggerDTO
}
