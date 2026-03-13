import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { authenticateTestUser } from '@/utils/authenticate'

describe('Refresh session (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    await app.init()
  })

  test('[POST]/sessions/refresh should issue a new token pair', async () => {
    const { refreshToken } = await authenticateTestUser(app, prisma)

    const response = await request(app.getHttpServer())
      .post('/sessions/refresh')
      .send({ refresh_token: refreshToken })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      access_token: expect.any(String),
      refresh_token: expect.any(String),
    })
    expect(response.body.refresh_token).not.toBe(refreshToken)
  })
})
