import { DomainError } from '@/shared/errors/domain-error'
import { HttpStatus } from '@nestjs/common'

export class AccountPendingVerificationError extends DomainError {
  readonly code = 'ACCOUNT_PENDING_VERIFICATION'
  readonly status = HttpStatus.FORBIDDEN

  constructor() {
    super('Account pending verification', { isReportable: false })
  }
}
