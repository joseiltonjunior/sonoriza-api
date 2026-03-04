import { DomainError } from '../../../shared/erros/domain-error'
import { HttpStatus } from '@nestjs/common'

export class MusicSlugAlreadyExistsError extends DomainError {
  readonly code = 'MUSIC_SLUG_ALREADY_EXISTS'
  readonly status = HttpStatus.CONFLICT

  constructor(slug: string) {
    super(`Music with slug '${slug}' already exists.`)
  }
}
