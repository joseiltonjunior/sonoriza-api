import { DomainError } from '@/shared/errors/domain-error'
import { HttpStatus } from '@nestjs/common'

export class UploadFileTooLargeError extends DomainError {
  readonly code = 'UPLOAD_FILE_TOO_LARGE'
  readonly status = HttpStatus.BAD_REQUEST

  constructor(message: string) {
    super(message)
  }
}
