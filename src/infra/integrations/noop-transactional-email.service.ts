import { Injectable } from '@nestjs/common'

import { TransactionalEmailService } from '@/domain/users/ports/transactional-email.service'

@Injectable()
export class NoopTransactionalEmailService implements TransactionalEmailService {
  async sendAccountVerification(): Promise<void> {}
}

