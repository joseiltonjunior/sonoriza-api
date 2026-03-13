import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserStatusRequestSwaggerDTO {
  @ApiProperty({
    example: 'SUSPENDED',
    enum: ['ACTIVE', 'PENDING_VERIFICATION', 'SUSPENDED'],
  })
  accountStatus!: 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED'
}
