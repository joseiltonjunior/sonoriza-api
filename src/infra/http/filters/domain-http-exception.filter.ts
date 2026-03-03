import { DomainError } from '@/shared/erros/domain-error'
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'

@Catch(DomainError)
export class DomainHttpExceptionFilter implements ExceptionFilter {
  catch(error: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    return response.status(error.status).json({
      message: error.message,
      code: error.code,
    })
  }
}
