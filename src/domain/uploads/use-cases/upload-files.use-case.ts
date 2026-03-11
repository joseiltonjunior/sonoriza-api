import { UploadFilesDTO } from '../dtos/upload-files.dto'
import { UploadFilesResponseDTO } from '../dtos/upload-files-response.dto'
import { InvalidUploadRequestError } from '../errors/invalid-upload-request.error'
import { UnsupportedUploadFileError } from '../errors/unsupported-upload-file.error'
import { UploadFileTooLargeError } from '../errors/upload-file-too-large.error'
import { FileSignerService } from './file-signer.service'
import { StorageService } from './storage.service'

const allowedFolders = ['artists', 'musics'] as const

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/webp']
const audioMimeTypes = ['audio/mpeg', 'audio/mp3']

const imageMaxBytes = 5 * 1024 * 1024

export class UploadFilesUseCase {
  constructor(
    private readonly storageService: StorageService,
    private readonly fileSignerService: FileSignerService,
    private readonly uploadMaxFileSizeMb: number,
  ) {}

  async execute({
    files,
    folder,
    slug,
  }: UploadFilesDTO): Promise<UploadFilesResponseDTO> {
    if (!files || files.length === 0) {
      throw new InvalidUploadRequestError('At least one file is required')
    }

    if (!allowedFolders.includes(folder)) {
      throw new InvalidUploadRequestError('Invalid folder')
    }

    const safeSlug = this.sanitizeSlug(slug)

    if (!safeSlug) {
      throw new InvalidUploadRequestError('Invalid slug')
    }

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        this.validateFile(folder, file)

        const key = `${folder}/${safeSlug}/${this.buildSafeFileName(file.originalname)}`

        const uploadedFile = await this.storageService.upload({
          key,
          body: file.buffer,
          contentType: file.mimetype,
        })

        const signedUrl = await this.fileSignerService.sign(uploadedFile.url)

        return {
          originalName: file.originalname,
          key: uploadedFile.key,
          url: uploadedFile.url,
          signedUrl,
          contentType: file.mimetype,
          size: file.size,
          kind: this.resolveKind(file.mimetype),
        }
      }),
    )

    return {
      files: uploadedFiles,
    }
  }

  private validateFile(
    folder: 'artists' | 'musics',
    file: UploadFilesDTO['files'][number],
  ) {
    const isImage = imageMimeTypes.includes(file.mimetype)
    const isAudio = audioMimeTypes.includes(file.mimetype)

    if (folder === 'artists' && !isImage) {
      throw new UnsupportedUploadFileError(
        'Artists folder only accepts image files',
      )
    }

    if (folder === 'musics' && !isImage && !isAudio) {
      throw new UnsupportedUploadFileError(
        'Musics folder only accepts image or audio files',
      )
    }

    const maxBytes = isAudio
      ? this.uploadMaxFileSizeMb * 1024 * 1024
      : imageMaxBytes

    if (file.size > maxBytes) {
      throw new UploadFileTooLargeError(
        `File ${file.originalname} exceeds the maximum allowed size`,
      )
    }
  }

  private resolveKind(mimeType: string): 'audio' | 'image' {
    return audioMimeTypes.includes(mimeType) ? 'audio' : 'image'
  }

  private sanitizeSlug(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase()
  }

  private buildSafeFileName(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9._-]/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase()
  }
}
