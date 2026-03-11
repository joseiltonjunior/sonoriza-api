import { ApiProperty } from '@nestjs/swagger'

export class SignFileUrlResponseSwaggerDTO {
  @ApiProperty({
    example:
      'https://cdn.example.com/musics/paulo-pires/louvor.mp3?Expires=1867770188&Signature=abc&Key-Pair-Id=xyz',
  })
  signedUrl!: string
}
