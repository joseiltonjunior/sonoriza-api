import { ApiProperty } from '@nestjs/swagger'

export class CreateUserResponseSwaggerDTO {
  @ApiProperty({
    example: '67502595-593c-4ada-8f2c-b6cd6a743f61',
    format: 'uuid',
  })
  id!: string

  @ApiProperty({
    example: 'Seu Paulo',
  })
  name!: string

  @ApiProperty({
    example: 'seupauleo@gmail.com',
  })
  email!: string
}
