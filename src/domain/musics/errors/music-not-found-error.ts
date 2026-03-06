import { DomainError } from '../../../shared/errors/domain-error'
import { HttpStatus } from '@nestjs/common'

export class MusicNotFoundError extends DomainError {
  readonly code = 'MUSIC_NOT_FOUND'
  readonly status = HttpStatus.NOT_FOUND

  constructor() {
    super('Music not found.')
  }
}
