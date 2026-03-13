import { DomainError } from '@/shared/errors/domain-error'
import { HttpStatus } from '@nestjs/common'

export class InvalidUploadRequestError extends DomainError {
  readonly code = 'INVALID_UPLOAD_REQUEST'
  readonly status = HttpStatus.BAD_REQUEST

  constructor(message: string) {
    super(message)
  }
}
