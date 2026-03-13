import { ApiProperty } from '@nestjs/swagger'

export class CreateGenreRequestSwaggerDTO {
  @ApiProperty({ example: 'Rap' })
  name!: string
}
