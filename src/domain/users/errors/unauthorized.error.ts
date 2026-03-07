import { DomainError } from '@/shared/errors/domain-error'
import { HttpStatus } from '@nestjs/common'

export class UnauthorizedError extends DomainError {
  readonly code = 'UNAUTHORIZED'
  readonly status = HttpStatus.UNAUTHORIZED

  constructor() {
    super('Unauthorized', { isReportable: false })
  }
}
