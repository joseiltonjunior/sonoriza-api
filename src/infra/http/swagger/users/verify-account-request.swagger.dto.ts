import { ApiProperty } from '@nestjs/swagger'

export class VerifyAccountRequestSwaggerDTO {
  @ApiProperty({ example: 'user@email.com' })
  email!: string

  @ApiProperty({ example: '123456' })
  code!: string
}
