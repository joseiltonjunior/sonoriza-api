import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Authenticate account (E2E)', () => {
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

  test('[POST]/sessions', async () => {
    const email = `johndoe-${Date.now()}-${Math.random()}@example.com`

    await prisma.user.create({
      data: {
        name: 'John Doe',
        email,
        password: await hash('123456', 8),
        accountStatus: 'ACTIVE',
      },
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email,
      password: '123456',
    })

    expect(response.statusCode).toBe(201)
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
  })

  test('[POST]/sessions should return forbidden for pending verification account', async () => {
    const email = `pending-${Date.now()}-${Math.random()}@example.com`

    await prisma.user.create({
      data: {
        name: 'Pending User',
        email,
        password: await hash('123456', 8),
        accountStatus: 'PENDING_VERIFICATION',
      },
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email,
      password: '123456',
    })

    expect(response.statusCode).toBe(403)
    expect(response.body).toEqual({
      message: 'Account pending verification',
      code: 'ACCOUNT_PENDING_VERIFICATION',
    })
  })

  test('[POST]/sessions should return unauthorized for suspended user', async () => {
    const email = `suspended-${Date.now()}-${Math.random()}@example.com`

    await prisma.user.create({
      data: {
        name: 'Suspended User',
        email,
        password: await hash('123456', 8),
        accountStatus: 'SUSPENDED',
      },
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email,
      password: '123456',
    })

    expect(response.statusCode).toBe(401)
    expect(response.body).toEqual({
      message: 'Unauthorized',
      code: 'UNAUTHORIZED',
    })
  })
})
