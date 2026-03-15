import { UploadFilesUseCase } from './upload-files.use-case'
import { FileSignerService } from '../ports/file-signer.service'
import { StorageService } from '../ports/storage.service'
import { InvalidUploadRequestError } from '../errors/invalid-upload-request.error'
import { UnsupportedUploadFileError } from '../errors/unsupported-upload-file.error'
import { UploadFileTooLargeError } from '../errors/upload-file-too-large.error'

class FakeStorageService implements StorageService {
  async upload(params: { key: string; body: Buffer; contentType: string }) {
    return {
      key: params.key,
      url: `https://cdn.sonoriza.com/${params.key}`,
    }
  }
}

class FakeFileSignerService implements FileSignerService {
  async sign(url: string) {
    return `${url}?signed=true`
  }
}

describe('UploadFilesUseCase', () => {
  it('should upload and sign files', async () => {
    const useCase = new UploadFilesUseCase(
      new FakeStorageService(),
      new FakeFileSignerService(),
      12,
    )

    const result = await useCase.execute({
      folder: 'musics',
      slug: 'Paulo Pires',
      files: [
        {
          originalname: 'Track 01.mp3',
          mimetype: 'audio/mpeg',
          size: 1024,
          buffer: Buffer.from('audio'),
        },
        {
          originalname: 'Cover.jpg',
          mimetype: 'image/jpeg',
          size: 1024,
          buffer: Buffer.from('image'),
        },
      ],
    })

    expect(result.files).toHaveLength(2)
    expect(result.files[0]).toEqual(
      expect.objectContaining({
        key: 'musics/paulo-pires/track-01.mp3',
        kind: 'audio',
      }),
    )
    expect(result.files[1]).toEqual(
      expect.objectContaining({
        key: 'musics/paulo-pires/cover.jpg',
        kind: 'image',
      }),
    )
  })

  it('should reject missing files', async () => {
    const useCase = new UploadFilesUseCase(
      new FakeStorageService(),
      new FakeFileSignerService(),
      12,
    )

    await expect(
      useCase.execute({
        folder: 'musics',
        slug: 'paulo-pires',
        files: [],
      }),
    ).rejects.toBeInstanceOf(InvalidUploadRequestError)
  })

  it('should reject unsupported file types for artists folder', async () => {
    const useCase = new UploadFilesUseCase(
      new FakeStorageService(),
      new FakeFileSignerService(),
      12,
    )

    await expect(
      useCase.execute({
        folder: 'artists',
        slug: 'paulo-pires',
        files: [
          {
            originalname: 'track.mp3',
            mimetype: 'audio/mpeg',
            size: 1024,
            buffer: Buffer.from('audio'),
          },
        ],
      }),
    ).rejects.toBeInstanceOf(UnsupportedUploadFileError)
  })

  it('should reject files above the max audio size', async () => {
    const useCase = new UploadFilesUseCase(
      new FakeStorageService(),
      new FakeFileSignerService(),
      1,
    )

    await expect(
      useCase.execute({
        folder: 'musics',
        slug: 'paulo-pires',
        files: [
          {
            originalname: 'track.mp3',
            mimetype: 'audio/mpeg',
            size: 2 * 1024 * 1024,
            buffer: Buffer.from('audio'),
          },
        ],
      }),
    ).rejects.toBeInstanceOf(UploadFileTooLargeError)
  })
})

