import { Injectable } from '@nestjs/common'

import { ProfileImageProcessorService } from '@/domain/users/ports/profile-image-processor.service'

@Injectable()
export class NoopProfileImageProcessorService implements ProfileImageProcessorService {
  async process(params: { body: Buffer; contentType: string }) {
    return {
      body: params.body,
      contentType: 'image/webp' as const,
    }
  }
}

