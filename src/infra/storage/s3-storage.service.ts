import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'

import { Env } from '@/infra/env'
import { StorageService } from '@/domain/uploads/ports/storage.service'

@Injectable()
export class S3StorageService implements StorageService {
  private readonly client: S3Client

  constructor(private readonly config: ConfigService<Env, true>) {
    this.client = new S3Client({
      region: this.config.get('AWS_REGION', { infer: true }),
      credentials: {
        accessKeyId: this.config.get('AWS_ACCESS_KEY_ID', { infer: true }),
        secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY', {
          infer: true,
        }),
      },
    })
  }

  async upload(params: { key: string; body: Buffer; contentType: string }) {
    try {
      await new Upload({
        client: this.client,
        params: {
          Bucket: this.config.get('AWS_S3_BUCKET', { infer: true }),
          Key: params.key,
          Body: params.body,
          ContentType: params.contentType,
        },
      }).done()

      return {
        key: params.key,
        url: `${this.normalizeBaseUrl(this.config.get('CLOUDFRONT_DOMAIN', { infer: true }))}${params.key}`,
      }
    } catch {
      throw new InternalServerErrorException('Failed to upload file')
    }
  }

  private normalizeBaseUrl(url: string) {
    return url.endsWith('/') ? url : `${url}/`
  }
}
