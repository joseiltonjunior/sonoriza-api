import { DomainError } from '@/shared/errors/domain-error'
import { HttpStatus } from '@nestjs/common'

export class InvalidSessionError extends DomainError {
  readonly code = 'INVALID_SESSION'
  readonly status = HttpStatus.UNAUTHORIZED

  constructor() {
    super('Invalid session', { isReportable: false })
  }
}
