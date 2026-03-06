import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env'
import { HttpModule } from './http/http.module'
import { APP_FILTER } from '@nestjs/core'
import { DomainHttpExceptionFilter } from './http/filters/domain-http-exception.filter'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainHttpExceptionFilter,
    },
  ],
})
export class AppModule {}
