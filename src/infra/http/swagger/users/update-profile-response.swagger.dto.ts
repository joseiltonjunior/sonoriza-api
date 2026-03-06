import { ApiProperty } from '@nestjs/swagger'

export class UpdateProfileResponseSwaggerDTO {
  @ApiProperty({
    example: '67502595-593c-4ada-8f2c-b6cd6a743f61',
    format: 'uuid',
  })
  id!: string

  @ApiProperty({
    example: 'John Doe Updated',
  })
  name!: string

  @ApiProperty({
    example: 'john.updated@example.com',
  })
  email!: string

  @ApiProperty({
    example: 'https://cdn.example.com/profiles/john.jpg',
    nullable: true,
  })
  photoUrl!: string | null
}
