import { Injectable } from '@nestjs/common'

import { TransactionalEmailService } from '@/domain/users/use-cases/transactional-email.service'

@Injectable()
export class NoopTransactionalEmailService implements TransactionalEmailService {
  async sendAccountVerification(): Promise<void> {}
}
