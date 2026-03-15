import { Injectable } from '@nestjs/common'

import { StorageService } from '@/domain/uploads/ports/storage.service'

@Injectable()
export class NoopStorageService implements StorageService {
  async upload({ key }: { key: string; body: Buffer; contentType: string }) {
    return {
      key,
      url: `https://cdn.example.com/${key}`,
    }
  }
}
