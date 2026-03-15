import { Injectable, InternalServerErrorException } from '@nestjs/common'

import { ProfileImageProcessorService } from '@/domain/users/ports/profile-image-processor.service'

@Injectable()
export class SharpProfileImageProcessorService implements ProfileImageProcessorService {
  async process(params: { body: Buffer; contentType: string }) {
    try {
      const sharpModule = await import('sharp')
      const sharp = (
        'default' in sharpModule ? sharpModule.default : sharpModule
      ) as typeof sharpModule.default

      const body = await sharp(params.body)
        .rotate()
        .resize(512, 512, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({
          quality: 85,
        })
        .toBuffer()

      return {
        body,
        contentType: 'image/webp' as const,
      }
    } catch (error) {
      console.error('Failed to process profile photo with sharp', error)
      throw new InternalServerErrorException('Failed to process profile photo')
    }
  }
}
