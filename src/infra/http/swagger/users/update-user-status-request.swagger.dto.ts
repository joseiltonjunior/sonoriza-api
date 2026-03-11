import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserStatusRequestSwaggerDTO {
  @ApiProperty({
    example: true,
  })
  isActive!: boolean
}
