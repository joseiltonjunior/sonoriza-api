import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda'

import { FileSignerService } from '@/domain/uploads/ports/file-signer.service'
import { Env } from '@/infra/env'

@Injectable()
export class LambdaFileSignerService implements FileSignerService {
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

  async sign(url: string): Promise<string> {
    try {
      const command = new InvokeCommand({
        FunctionName: this.config.get('UPLOAD_LAMBDA_SIGN_FUNCTION_NAME', {
          infer: true,
        }),
        InvocationType: 'RequestResponse',
        Payload: Buffer.from(JSON.stringify({ url })),
      })

      const response = await this.client.send(command)
      const payloadString = Buffer.from(response.Payload ?? []).toString(
        'utf-8',
      )
      const payload = JSON.parse(payloadString) as {
        signedUrl?: string
        responseObject?: {
          signedUrl?: string
        }
      }

      const signedUrl = payload.signedUrl ?? payload.responseObject?.signedUrl

      if (!signedUrl) {
        throw new InternalServerErrorException('Invalid sign url response')
      }

      return signedUrl
    } catch {
      throw new InternalServerErrorException('Failed to sign uploaded file')
    }
  }
}

