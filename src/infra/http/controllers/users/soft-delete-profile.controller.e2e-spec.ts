import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { authenticateTestUser } from '@/utils/authenticate'

describe('Soft delete profile (E2E)', () => {
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

  test('[DELETE]/me', async () => {
    const { token, user } = await authenticateTestUser(app, prisma)

    const response = await request(app.getHttpServer())
      .delete('/me')
      .set('Authorization', `Bearer ${token}`)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    })

    const authAgain = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email: user.email,
        password: '123456',
      })

    expect(response.statusCode).toBe(204)
    expect(userOnDatabase?.isActive).toBe(false)
    expect(userOnDatabase?.deletedAt).toBeTruthy()
    expect(authAgain.statusCode).toBe(401)
  })
})
