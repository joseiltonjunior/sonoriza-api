import { ApiProperty } from '@nestjs/swagger'

export class LogoutSessionRequestSwaggerDTO {
  @ApiProperty({
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refresh_token!: string
}
