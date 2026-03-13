import { ApiProperty } from '@nestjs/swagger'

export class SignFileUrlRequestSwaggerDTO {
  @ApiProperty({
    example: 'https://cdn.example.com/musics/paulo-pires/louvor.mp3',
  })
  url!: string
}
