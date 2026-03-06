import { DomainError } from '../../../shared/errors/domain-error'
import { HttpStatus } from '@nestjs/common'

export class GenreNameAlreadyExistsError extends DomainError {
  readonly code = 'GENRE_NAME_ALREADY_EXISTS'
  readonly status = HttpStatus.CONFLICT

  constructor(name: string) {
    super(`Genre with name '${name}' already exists.`)
  }
}
