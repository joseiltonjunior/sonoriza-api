import { InMemoryUserRepository } from '../repositories/in-memory-user.repository'
import { UserNotFoundError } from '../errors/user-not-found.error'
import { InvalidProfilePhotoError } from '../errors/invalid-profile-photo.error'
import { UploadUserProfilePhotoUseCase } from './upload-user-profile-photo.use-case'
import { User } from '../entities/user'

class FakeStorageService {
  async upload({ key }: { key: string; body: Buffer; contentType: string }) {
    return {
      key,
      url: `https://cdn.example.com/${key}`,
    }
  }
}

class FakeFileSignerService {
  async sign(url: string) {
    return `${url}?signed=test`
  }
}

class FakeProfileImageProcessorService {
  async process() {
    return {
      body: Buffer.from('processed-image'),
      contentType: 'image/webp' as const,
    }
  }
}

describe('UploadUserProfilePhotoUseCase', () => {
  it('should upload and update the authenticated user profile photo', async () => {
    const userRepo = new InMemoryUserRepository()
    const user = new User(
      'user-1',
      'John Doe',
      'john@example.com',
      'hashed-password',
      'USER',
      'ACTIVE',
    )
    userRepo.items.push(user)

    const useCase = new UploadUserProfilePhotoUseCase(
      userRepo,
      new FakeStorageService(),
      new FakeFileSignerService(),
      new FakeProfileImageProcessorService(),
    )

    const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(1710360000000)

    const result = await useCase.execute({
      userId: user.id,
      file: {
        buffer: Buffer.from('raw-image'),
        mimetype: 'image/png',
        size: 1024,
      },
    })

    expect(result.photoUrl).toBe(
      `https://cdn.example.com/users/${user.id}-1710360000000.webp?signed=test`,
    )
    expect(userRepo.items[0].photoUrl).toBe(result.photoUrl)
    nowSpy.mockRestore()
  })

  it('should throw when file type is invalid', async () => {
    const userRepo = new InMemoryUserRepository()
    userRepo.items.push(
      new User(
        'user-1',
        'John Doe',
        'john@example.com',
        'hashed-password',
        'USER',
        'ACTIVE',
      ),
    )

    const useCase = new UploadUserProfilePhotoUseCase(
      userRepo,
      new FakeStorageService(),
      new FakeFileSignerService(),
      new FakeProfileImageProcessorService(),
    )

    await expect(
      useCase.execute({
        userId: 'user-1',
        file: {
          buffer: Buffer.from('raw-file'),
          mimetype: 'application/pdf',
          size: 1024,
        },
      }),
    ).rejects.toBeInstanceOf(InvalidProfilePhotoError)
  })

  it('should throw when user does not exist', async () => {
    const useCase = new UploadUserProfilePhotoUseCase(
      new InMemoryUserRepository(),
      new FakeStorageService(),
      new FakeFileSignerService(),
      new FakeProfileImageProcessorService(),
    )

    await expect(
      useCase.execute({
        userId: 'missing-user',
        file: {
          buffer: Buffer.from('raw-image'),
          mimetype: 'image/png',
          size: 1024,
        },
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
