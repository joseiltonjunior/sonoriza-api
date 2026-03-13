import { ApiProperty } from '@nestjs/swagger'

export class UserProfileResponseSwaggerDTO {
  @ApiProperty({
    example: '67502595-593c-4ada-8f2c-b6cd6a743f61',
    format: 'uuid',
  })
  id!: string

  @ApiProperty({
    example: 'John Doe',
  })
  name!: string

  @ApiProperty({
    example: 'john@example.com',
  })
  email!: string

  @ApiProperty({
    example: 'USER',
  })
  role!: 'USER' | 'ADMIN'

  @ApiProperty({
    example: 'ACTIVE',
  })
  accountStatus!: 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED'

  @ApiProperty({
    example: 'https://cdn.example.com/profiles/john.jpg',
    nullable: true,
  })
  photoUrl!: string | null
}
