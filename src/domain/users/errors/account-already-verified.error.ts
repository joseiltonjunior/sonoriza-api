import { DomainError } from '@/shared/errors/domain-error'
import { HttpStatus } from '@nestjs/common'

export class AccountAlreadyVerifiedError extends DomainError {
  readonly code = 'ACCOUNT_ALREADY_VERIFIED'
  readonly status = HttpStatus.CONFLICT

  constructor() {
    super('Account already verified', { isReportable: false })
  }
}
