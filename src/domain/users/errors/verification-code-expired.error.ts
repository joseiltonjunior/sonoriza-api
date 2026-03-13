import { DomainError } from '@/shared/errors/domain-error'
import { HttpStatus } from '@nestjs/common'

export class VerificationCodeExpiredError extends DomainError {
  readonly code = 'VERIFICATION_CODE_EXPIRED'
  readonly status = HttpStatus.BAD_REQUEST

  constructor() {
    super('Verification code expired', { isReportable: false })
  }
}
