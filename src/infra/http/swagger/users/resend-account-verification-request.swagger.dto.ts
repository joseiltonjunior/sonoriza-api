import { ApiProperty } from '@nestjs/swagger'

export class ResendAccountVerificationRequestSwaggerDTO {
  @ApiProperty({ example: 'user@email.com' })
  email!: string
}
