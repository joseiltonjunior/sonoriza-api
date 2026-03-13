import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { hashVerificationCode } from '@/domain/users/use-cases/hash-verification-code'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Verify account (E2E)', () => {
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

  test('[POST]/accounts/verify should verify account and authenticate user', async () => {
    const email = `verify-${Date.now()}-${Math.random()}@example.com`

    const createResponse = await request(app.getHttpServer())
      .post('/accounts')
      .send({
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
        codeHash: hashVerificationCode('123456'),
      },
    })

    expect(createResponse.statusCode).toBe(201)

    const response = await request(app.getHttpServer())
      .post('/accounts/verify')
      .send({ email, code: '123456' })

    const updatedUser = await prisma.user.findUnique({ where: { email } })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      access_token: expect.any(String),
      refresh_token: expect.any(String),
      user: {
        id: expect.any(String),
        name: 'John Doe',
        email,
        role: 'USER',
        accountStatus: 'ACTIVE',
        photoUrl: null,
      },
    })
    expect(updatedUser?.accountStatus).toBe('ACTIVE')
    expect(updatedUser?.emailVerifiedAt).toBeTruthy()
  })

  test('[POST]/accounts/verify should reject invalid code', async () => {
    const email = `verify-invalid-${Date.now()}-${Math.random()}@example.com`

    await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email,
      password: '123456',
    })

    const response = await request(app.getHttpServer())
      .post('/accounts/verify')
      .send({ email, code: '999999' })

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({
      message: 'Invalid verification code',
      code: 'INVALID_VERIFICATION_CODE',
    })
  })
})
