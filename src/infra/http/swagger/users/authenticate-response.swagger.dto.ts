import { ApiProperty } from '@nestjs/swagger'

export class AuthenticateResponseSwaggerDTO {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token!: string
}
