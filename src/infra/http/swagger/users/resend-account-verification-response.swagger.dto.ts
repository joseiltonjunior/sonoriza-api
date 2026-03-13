import { ApiProperty } from '@nestjs/swagger'

export class ResendAccountVerificationResponseSwaggerDTO {
  @ApiProperty({ example: 'Verification code sent successfully.' })
  message!: string
}
