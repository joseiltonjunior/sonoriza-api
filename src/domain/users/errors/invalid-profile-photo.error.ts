import { DomainError } from '@/shared/errors/domain-error'

export class InvalidProfilePhotoError extends DomainError {
  readonly code = 'INVALID_PROFILE_PHOTO'
  readonly status = 400

  constructor(message = 'Invalid profile photo') {
    super(message)
  }
}
