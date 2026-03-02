import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as bodyParser from 'body-parser'

import { Env } from './env'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
    bodyParser: false,
  })

  app.use(bodyParser.json())

  const configService = app.get<ConfigService<Env, true>>(ConfigService)
  const port = configService.get('PORT', { infer: true })

  await app.listen(port)
}
bootstrap()
