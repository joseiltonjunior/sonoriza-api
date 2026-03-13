import { DomainError } from '@/shared/errors/domain-error'
import { HttpStatus } from '@nestjs/common'

export class InvalidVerificationCodeError extends DomainError {
  readonly code = 'INVALID_VERIFICATION_CODE'
  readonly status = HttpStatus.BAD_REQUEST

  constructor() {
    super('Invalid verification code', { isReportable: false })
  }
}
