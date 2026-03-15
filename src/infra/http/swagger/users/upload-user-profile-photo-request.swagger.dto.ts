import { ApiProperty } from '@nestjs/swagger'

export class UploadUserProfilePhotoRequestSwaggerDTO {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file!: string
}
