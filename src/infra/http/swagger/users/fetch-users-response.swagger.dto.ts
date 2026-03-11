import { ApiProperty } from '@nestjs/swagger'

class FetchUsersMetaSwaggerDTO {
  @ApiProperty({ example: 100 })
  total!: number

  @ApiProperty({ example: 1 })
  page!: number

  @ApiProperty({ example: 5 })
  lastPage!: number
}

class UserItemSwaggerDTO {
  @ApiProperty({
    example: '67502595-593c-4ada-8f2c-b6cd6a743f61',
    format: 'uuid',
  })
  id!: string

  @ApiProperty({ example: 'John Doe' })
  name!: string

  @ApiProperty({ example: 'john@example.com' })
  email!: string

  @ApiProperty({ example: 'USER' })
  role!: 'USER' | 'ADMIN'

  @ApiProperty({ example: true })
  isActive!: boolean

  @ApiProperty({
    example: 'https://cdn.example.com/profiles/john.jpg',
    nullable: true,
  })
  photoUrl!: string | null

  @ApiProperty({
    example: '2026-01-01T00:00:00.000Z',
  })
  createdAt!: Date
}

export class FetchUsersResponseSwaggerDTO {
  @ApiProperty({ type: [UserItemSwaggerDTO] })
  data!: UserItemSwaggerDTO[]

  @ApiProperty({ type: FetchUsersMetaSwaggerDTO })
  meta!: FetchUsersMetaSwaggerDTO
}
