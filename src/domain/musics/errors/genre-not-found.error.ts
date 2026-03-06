import { DomainError } from '../../../shared/errors/domain-error'
import { HttpStatus } from '@nestjs/common'

export class GenreNotFoundError extends DomainError {
  readonly code = 'GENRE_NOT_FOUND'
  readonly status = HttpStatus.NOT_FOUND

  constructor(id: string) {
    super(`Genre with id '${id}' was not found.`)
  }
}
