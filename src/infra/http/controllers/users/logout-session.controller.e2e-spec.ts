import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { authenticateTestUser } from '@/utils/authenticate'

describe('Logout session (E2E)', () => {
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

  test('[POST]/sessions/logout should revoke the refresh token', async () => {
    const { refreshToken } = await authenticateTestUser(app, prisma)

    const logoutResponse = await request(app.getHttpServer())
      .post('/sessions/logout')
      .send({ refresh_token: refreshToken })

    expect(logoutResponse.statusCode).toBe(204)

    const refreshResponse = await request(app.getHttpServer())
      .post('/sessions/refresh')
      .send({ refresh_token: refreshToken })

    expect(refreshResponse.statusCode).toBe(401)
    expect(refreshResponse.body).toEqual({
      message: 'Invalid session',
      code: 'INVALID_SESSION',
    })
  })
})
