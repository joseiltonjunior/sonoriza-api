import { DomainError } from '@/shared/errors/domain-error'
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'

@Catch(DomainError)
export class DomainHttpExceptionFilter implements ExceptionFilter {
  catch(error: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    const payload: Record<string, unknown> = {
      message: error.message,
      code: error.code,
    }

    if ('retryAfterSeconds' in error) {
      payload.retryAfterSeconds = (
        error as DomainError & {
          retryAfterSeconds: number
        }
      ).retryAfterSeconds
    }

    return response.status(error.status).json(payload)
  }
}
