import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { authenticateTestUser } from '@/utils/authenticate'

describe('Update profile (E2E)', () => {
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

  test('[PATCH]/me', async () => {
    const { token, user } = await authenticateTestUser(app, prisma)

    const response = await request(app.getHttpServer())
      .patch('/me')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated User',
        email: `updated-${Date.now()}@example.com`,
      })

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    })

    expect(response.statusCode).toBe(200)
    expect(userOnDatabase?.name).toBe('Updated User')
    expect(userOnDatabase?.photoUrl).toBeNull()
  })
})
