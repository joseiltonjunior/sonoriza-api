import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: process.env.NODE_ENV === 'test' ? [] : ['warn', 'error'],
    })
  }

  onModuleDestroy() {
    return this.$disconnect()
  }

  onModuleInit() {
    return this.$connect()
  }
}
