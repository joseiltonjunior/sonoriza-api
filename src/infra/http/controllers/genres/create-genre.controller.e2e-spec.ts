import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Role } from '@prisma/client'
import request from 'supertest'
import { authenticateTestUser } from '@/utils/authenticate'

describe('Create genre (E2E)', () => {
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

  test('[POST]/genres should return 403 for USER role', async () => {
    const { token } = await authenticateTestUser(app, prisma, Role.USER)

    const response = await request(app.getHttpServer())
      .post('/genres')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Forbidden ${Date.now()}` })

    expect(response.statusCode).toBe(403)
  })

  test('[POST]/genres should create genre for ADMIN role', async () => {
    const { token } = await authenticateTestUser(app, prisma, Role.ADMIN)
    const name = `Admin Genre ${Date.now()} ${Math.random()}`

    const response = await request(app.getHttpServer())
      .post('/genres')
      .set('Authorization', `Bearer ${token}`)
      .send({ name })

    const genreOnDatabase = await prisma.genre.findUnique({
      where: { name },
    })

    expect(response.statusCode).toBe(201)
    expect(genreOnDatabase).toBeTruthy()
  })
})
