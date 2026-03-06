import { ApiProperty } from '@nestjs/swagger'

export class AuthenticateRequestSwaggerDTO {
  @ApiProperty({ example: 'user@email.com' })
  email!: string

  @ApiProperty({
    example: '123456',
    description: 'Password must be at least 6 characters long',
  })
  password!: string
}
