import { PipeTransform, BadRequestException } from '@nestjs/common'
import { ZodError, z } from 'zod'
import { fromZodError } from 'zod-validation-error'

export class ZodValidationPipe<T extends z.Schema> implements PipeTransform {
  constructor(private readonly schema: T) {}

  transform(value: unknown): z.infer<T> {
    try {
      return this.schema.parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          statusCode: 400,
          errors: fromZodError(error),
        })
      }

      throw new BadRequestException('Validation failed')
    }
  }
}
