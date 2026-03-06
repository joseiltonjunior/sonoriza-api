import { ApiProperty } from '@nestjs/swagger'

export class CreateUserRequestSwaggerDTO {
  @ApiProperty({ example: 'user@email.com' })
  email!: string

  @ApiProperty({ example: 'John Doe' })
  name!: string

  @ApiProperty({ example: '123456' })
  password!: string
}
