import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda'

import { TransactionalEmailService } from '@/domain/users/use-cases/transactional-email.service'
import { Env } from '@/infra/env'

@Injectable()
export class LambdaTransactionalEmailService implements TransactionalEmailService {
  private readonly client: LambdaClient

  constructor(private readonly config: ConfigService<Env, true>) {
    this.client = new LambdaClient({
      region: this.config.get('AWS_REGION', { infer: true }),
      credentials: {
        accessKeyId: this.config.get('AWS_ACCESS_KEY_ID', { infer: true }),
        secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY', {
          infer: true,
        }),
      },
    })
  }

  async sendAccountVerification(input: {
    to: string
    name: string
    code: string
    expiresInMinutes: number
  }): Promise<void> {
    try {
      const command = new InvokeCommand({
        FunctionName: this.config.get(
          'TRANSACTIONAL_EMAIL_LAMBDA_FUNCTION_NAME',
          { infer: true },
        ),
        InvocationType: 'RequestResponse',
        Payload: Buffer.from(
          JSON.stringify({
            type: 'ACCOUNT_VERIFICATION',
            to: input.to,
            variables: {
              name: input.name,
              code: input.code,
              expiresInMinutes: input.expiresInMinutes,
            },
          }),
        ),
      })

      const response = await this.client.send(command)
      const payloadString = Buffer.from(response.Payload ?? []).toString(
        'utf-8',
      )
      const payload = payloadString ? JSON.parse(payloadString) : null
      const statusCode = Number(payload?.statusCode ?? 500)

      if (response.FunctionError || statusCode >= 400) {
        throw new InternalServerErrorException(
          'Failed to send account verification email',
        )
      }
    } catch {
      throw new InternalServerErrorException(
        'Failed to send account verification email',
      )
    }
  }
}
