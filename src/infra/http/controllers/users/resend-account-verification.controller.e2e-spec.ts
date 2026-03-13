import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Resend account verification (E2E)', () => {
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

  test('[POST]/accounts/resend-verification should resend after cooldown', async () => {
    const email = `resend-${Date.now()}-${Math.random()}@example.com`

    await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email,
      password: '123456',
    })

    const user = await prisma.user.findUnique({ where: { email } })

    await prisma.accountVerification.updateMany({
      where: {
        userId: user?.id,
        revokedAt: null,
        verifiedAt: null,
      },
      data: {
        resendAvailableAt: new Date(Date.now() - 1000),
      },
    })

    const response = await request(app.getHttpServer())
      .post('/accounts/resend-verification')
      .send({ email })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      message: 'Verification code sent successfully.',
    })
  })

  test('[POST]/accounts/resend-verification should enforce cooldown', async () => {
    const email = `resend-cooldown-${Date.now()}-${Math.random()}@example.com`

    await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email,
      password: '123456',
    })

    const response = await request(app.getHttpServer())
      .post('/accounts/resend-verification')
      .send({ email })

    expect(response.statusCode).toBe(429)
    expect(response.body.code).toBe('VERIFICATION_RESEND_COOLDOWN')
    expect(typeof response.body.retryAfterSeconds).toBe('number')
  })
})
