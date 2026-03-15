import { Injectable } from '@nestjs/common'

import { FileSignerService } from '@/domain/uploads/ports/file-signer.service'

@Injectable()
export class NoopFileSignerService implements FileSignerService {
  async sign(url: string) {
    return `${url}?signed=test`
  }
}

