import { ResendAccountVerificationDTO } from '../dtos/resend-account-verification.dto'
import { AccountAlreadyVerifiedError } from '../errors/account-already-verified.error'
import { UserNotFoundError } from '../errors/user-not-found.error'
import { VerificationResendCooldownError } from '../errors/verification-resend-cooldown.error'
import { AccountVerificationRepository } from '../repositories/account-verification-repository'
import { UserRepository } from '../repositories/user-repository'
import { IssueAccountVerificationUseCase } from './issue-account-verification.use-case'

export class ResendAccountVerificationUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly accountVerificationRepository: AccountVerificationRepository,
    private readonly issueAccountVerificationUseCase: IssueAccountVerificationUseCase,
  ) {}

  async execute({ email }: ResendAccountVerificationDTO) {
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

    if (currentVerification && !currentVerification.canResend()) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil(
          (currentVerification.resendAvailableAt.getTime() - Date.now()) / 1000,
        ),
      )

      throw new VerificationResendCooldownError(retryAfterSeconds)
    }

    if (currentVerification) {
      currentVerification.revoke()
      await this.accountVerificationRepository.update(currentVerification)
    }

    await this.issueAccountVerificationUseCase.execute(user)

    return {
      message: 'Verification code sent successfully.',
    }
  }
}
