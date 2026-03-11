export type UploadableFile = {
  originalname: string
  mimetype: string
  size: number
  buffer: Buffer
}

export type UploadFilesDTO = {
  files: UploadableFile[]
  folder: 'artists' | 'musics'
  slug: string
}
