import { DomainError } from '../../../shared/errors/domain-error'
import { HttpStatus } from '@nestjs/common'

export class ArtistNotFoundError extends DomainError {
  readonly code = 'ARTIST_NOT_FOUND'
  readonly status = HttpStatus.NOT_FOUND

  constructor(id: string) {
    super(`Artist with id '${id}' was not found.`)
  }
}
