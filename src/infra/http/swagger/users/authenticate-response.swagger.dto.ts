import { ApiProperty } from '@nestjs/swagger'

class AuthenticatedUserSwaggerDTO {
  @ApiProperty({ example: '67502595-593c-4ada-8f2c-b6cd6a743f61' })
  id!: string

  @ApiProperty({ example: 'John Doe' })
  name!: string

  @ApiProperty({ example: 'john@example.com' })
  email!: string

  @ApiProperty({ example: 'USER' })
  role!: 'USER' | 'ADMIN'

  @ApiProperty({ example: 'ACTIVE' })
  accountStatus!: 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED'

  @ApiProperty({
    example: 'https://cdn.example.com/profiles/john.jpg',
    nullable: true,
  })
  photoUrl!: string | null
}

export class AuthenticateResponseSwaggerDTO {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token!: string

  @ApiProperty({
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refresh_token!: string

  @ApiProperty({ type: AuthenticatedUserSwaggerDTO })
  user!: AuthenticatedUserSwaggerDTO
}
