import { ApiProperty } from '@nestjs/swagger'

export class RefreshSessionRequestSwaggerDTO {
  @ApiProperty({
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refresh_token!: string
}
