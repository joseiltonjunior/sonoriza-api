import { DomainError } from '@/shared/errors/domain-error'
import { HttpStatus } from '@nestjs/common'

export class UnsupportedUploadFileError extends DomainError {
  readonly code = 'UNSUPPORTED_UPLOAD_FILE'
  readonly status = HttpStatus.BAD_REQUEST

  constructor(message: string) {
    super(message)
  }
}
