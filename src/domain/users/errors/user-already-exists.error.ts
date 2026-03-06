import { DomainError } from '@/shared/errors/domain-error'
import { HttpStatus } from '@nestjs/common'

export class UserAlreadyExistsError extends DomainError {
  readonly code = 'USER_ALREADY_EXISTS'
  readonly status = HttpStatus.CONFLICT

  constructor(email: string) {
    super(`User already exists: ${email}`)
  }
}
