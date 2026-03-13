import { ApiProperty } from '@nestjs/swagger'

export class DeleteProfileResponseSwaggerDTO {
  @ApiProperty({ example: 'Account deleted successfully' })
  message!: string
}
