import { FileSignerService } from '@/domain/uploads/ports/file-signer.service'
import { StorageService } from '@/domain/uploads/ports/storage.service'

import { UserNotFoundError } from '../errors/user-not-found.error'
import { UserRepository } from '../repositories/user-repository'
import { InvalidProfilePhotoError } from '../errors/invalid-profile-photo.error'
import { ProfileImageProcessorService } from '../ports/profile-image-processor.service'

type UploadUserProfilePhotoInput = {
  userId: string
  file?: {
    buffer: Buffer
    mimetype: string
    size: number
  }
}

export class UploadUserProfilePhotoUseCase {
  private static readonly allowedMimeTypes = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
  ])

  constructor(
    private readonly userRepository: UserRepository,
    private readonly storageService: StorageService,
    private readonly fileSignerService: FileSignerService,
    private readonly profileImageProcessorService: ProfileImageProcessorService,
  ) {}

  async execute({ userId, file }: UploadUserProfilePhotoInput) {
    const user = await this.userRepository.findById(userId)

    if (!user || user.deletedAt) {
      throw new UserNotFoundError()
    }

    if (!file) {
      throw new InvalidProfilePhotoError('Profile photo is required')
    }

    if (!UploadUserProfilePhotoUseCase.allowedMimeTypes.has(file.mimetype)) {
      throw new InvalidProfilePhotoError('Unsupported profile photo type')
    }

    const processedFile = await this.profileImageProcessorService.process({
      body: file.buffer,
      contentType: file.mimetype,
    })

    const key = `users/${user.id}-${Date.now()}.webp`

    const uploaded = await this.storageService.upload({
      key,
      body: processedFile.body,
      contentType: processedFile.contentType,
    })

    const signedUrl = await this.fileSignerService.sign(uploaded.url)

    user.updateProfile({
      photoUrl: signedUrl,
    })

    await this.userRepository.update(user)

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      accountStatus: user.accountStatus,
      photoUrl: user.photoUrl,
    }
  }
}
