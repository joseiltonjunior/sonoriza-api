export type UploadFileItemResponseDTO = {
  originalName: string
  key: string
  url: string
  signedUrl: string
  contentType: string
  size: number
  kind: 'audio' | 'image'
}

export type UploadFilesResponseDTO = {
  files: UploadFileItemResponseDTO[]
}
