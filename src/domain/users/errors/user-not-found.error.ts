import { DomainError } from '@/shared/errors/domain-error'
import { HttpStatus } from '@nestjs/common'

export class UserNotFoundError extends DomainError {
  readonly code = 'USER_NOT_FOUND'
  readonly status = HttpStatus.NOT_FOUND

  constructor() {
    super(`User not found`)
  }
}
