import { ApiProperty } from '@nestjs/swagger'

export class UpdateProfileRequestSwaggerDTO {
  @ApiProperty({ example: 'John Doe Updated', required: false })
  name?: string

  @ApiProperty({ example: 'john.updated@example.com', required: false })
  email?: string

  @ApiProperty({
    example: 'https://cdn.example.com/profiles/john.jpg',
    required: false,
    nullable: true,
  })
  photoUrl?: string | null
}
