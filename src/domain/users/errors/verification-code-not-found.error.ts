import { DomainError } from '@/shared/errors/domain-error'
import { HttpStatus } from '@nestjs/common'

export class VerificationCodeNotFoundError extends DomainError {
  readonly code = 'VERIFICATION_CODE_NOT_FOUND'
  readonly status = HttpStatus.NOT_FOUND

  constructor() {
    super('Verification code not found', { isReportable: false })
  }
}
