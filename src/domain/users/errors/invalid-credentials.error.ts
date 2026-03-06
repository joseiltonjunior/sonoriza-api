import { DomainError } from '@/shared/errors/domain-error'
import { HttpStatus } from '@nestjs/common'

export class InvalidCredentialsError extends DomainError {
  readonly code = 'INVALID_CREDENTIALS'
  readonly status = HttpStatus.UNAUTHORIZED

  constructor() {
    super('Invalid credentials', { isReportable: true })
  }
}
