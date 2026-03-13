import { CreateSessionUseCase } from '@/domain/sessions/use-cases/create-session.use-case'

import { VerifyAccountDTO } from '../dtos/verify-account.dto'
import { AccountAlreadyVerifiedError } from '../errors/account-already-verified.error'
import { InvalidVerificationCodeError } from '../errors/invalid-verification-code.error'
import { UserNotFoundError } from '../errors/user-not-found.error'
import { VerificationCodeExpiredError } from '../errors/verification-code-expired.error'
import { VerificationCodeNotFoundError } from '../errors/verification-code-not-found.error'
import { AccountVerificationRepository } from '../repositories/account-verification-repository'
import { UserRepository } from '../repositories/user-repository'
import { hashVerificationCode } from './hash-verification-code'

export class VerifyAccountUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly accountVerificationRepository: AccountVerificationRepository,
    private readonly createSessionUseCase: CreateSessionUseCase,
  ) {}

  async execute({ email, code }: VerifyAccountDTO) {
    const user = await this.userRepository.findByEmail(email)

    if (!user || user.deletedAt) {
      throw new UserNotFoundError()
    }

    if (user.accountStatus === 'ACTIVE') {
      throw new AccountAlreadyVerifiedError()
    }

    const currentVerification =
      await this.accountVerificationRepository.findLatestPendingByUserId(
        user.id,
      )

    if (!currentVerification) {
      throw new VerificationCodeNotFoundError()
    }

    if (currentVerification.isExpired()) {
      currentVerification.revoke()
      await this.accountVerificationRepository.update(currentVerification)
      throw new VerificationCodeExpiredError()
    }

    if (currentVerification.codeHash !== hashVerificationCode(code)) {
      currentVerification.incrementAttempts()

      if (currentVerification.hasReachedMaxAttempts()) {
        currentVerification.revoke()
      }

      await this.accountVerificationRepository.update(currentVerification)
      throw new InvalidVerificationCodeError()
    }

    currentVerification.verify()
    await this.accountVerificationRepository.update(currentVerification)

    user.markEmailVerified()
    await this.userRepository.update(user)

    const session = await this.createSessionUseCase.execute({
      userId: user.id,
      role: user.role,
    })

    return {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus,
        photoUrl: user.photoUrl,
      },
    }
  }
}
