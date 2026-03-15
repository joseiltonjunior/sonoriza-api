import { randomUUID } from 'node:crypto'

import { User } from '../entities/user'
import { AccountVerification } from '../entities/account-verification'
import { AccountVerificationRepository } from '../repositories/account-verification-repository'
import { generateVerificationCode } from './generate-verification-code'
import { hashVerificationCode } from './hash-verification-code'
import { TransactionalEmailService } from '../ports/transactional-email.service'

export class IssueAccountVerificationUseCase {
  constructor(
    private readonly accountVerificationRepository: AccountVerificationRepository,
    private readonly transactionalEmailService: TransactionalEmailService,
    private readonly codeExpiresInMinutes: number,
    private readonly resendCooldownInSeconds: number,
    private readonly maxAttempts: number,
  ) {}

  async execute(user: User) {
    const verificationCode = generateVerificationCode()
    const now = new Date()
    const expiresAt = new Date(
      now.getTime() + this.codeExpiresInMinutes * 60 * 1000,
    )
    const resendAvailableAt = new Date(
      now.getTime() + this.resendCooldownInSeconds * 1000,
    )

    const accountVerification = new AccountVerification(
      randomUUID(),
      user.id,
      hashVerificationCode(verificationCode),
      expiresAt,
      resendAvailableAt,
      0,
      this.maxAttempts,
    )

    await this.accountVerificationRepository.create(accountVerification)

    await this.transactionalEmailService.sendAccountVerification({
      to: user.email,
      name: user.name,
      code: verificationCode,
      expiresInMinutes: this.codeExpiresInMinutes,
    })

    return {
      code: verificationCode,
      expiresAt,
      resendAvailableAt,
    }
  }
}
