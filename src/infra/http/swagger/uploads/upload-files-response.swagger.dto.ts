import { ApiProperty } from '@nestjs/swagger'

class UploadFileItemSwaggerDTO {
  @ApiProperty({ example: 'louvor.mp3' })
  originalName!: string

  @ApiProperty({ example: 'musics/paulo-pires/louvor.mp3' })
  key!: string

  @ApiProperty({
    example: 'https://cdn.sonoriza.com/musics/paulo-pires/louvor.mp3',
  })
  url!: string

  @ApiProperty({
    example:
      'https://cdn.sonoriza.com/musics/paulo-pires/louvor.mp3?signature=abc',
  })
  signedUrl!: string

  @ApiProperty({ example: 'audio/mpeg' })
  contentType!: string

  @ApiProperty({ example: 5832104 })
  size!: number

  @ApiProperty({ example: 'audio', enum: ['audio', 'image'] })
  kind!: 'audio' | 'image'
}

export class UploadFilesResponseSwaggerDTO {
  @ApiProperty({ type: [UploadFileItemSwaggerDTO] })
  files!: UploadFileItemSwaggerDTO[]
}
