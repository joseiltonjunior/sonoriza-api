import { DomainError } from '@/shared/errors/domain-error'
import { HttpStatus } from '@nestjs/common'

export class VerificationResendCooldownError extends DomainError {
  readonly code = 'VERIFICATION_RESEND_COOLDOWN'
  readonly status = HttpStatus.TOO_MANY_REQUESTS

  constructor(public readonly retryAfterSeconds: number) {
    super('You must wait before requesting a new verification code', {
      isReportable: false,
    })
  }
}
