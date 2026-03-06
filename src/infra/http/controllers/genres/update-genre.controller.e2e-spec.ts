import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Role } from '@prisma/client'
import request from 'supertest'
import { authenticateTestUser } from '@/utils/authenticate'

describe('Update genre (E2E)', () => {
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

  test('[PATCH]/genres/:id should return 403 for USER role', async () => {
    const { token } = await authenticateTestUser(app, prisma, Role.USER)

    const genre = await prisma.genre.create({
      data: {
        name: `Update User ${Date.now()} ${Math.random()}`,
      },
    })

    const response = await request(app.getHttpServer())
      .patch(`/genres/${genre.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Should not update' })

    expect(response.statusCode).toBe(403)
  })

  test('[PATCH]/genres/:id should update genre for ADMIN role', async () => {
    const { token } = await authenticateTestUser(app, prisma, Role.ADMIN)

    const genre = await prisma.genre.create({
      data: {
        name: `Update Admin ${Date.now()} ${Math.random()}`,
      },
    })

    const response = await request(app.getHttpServer())
      .patch(`/genres/${genre.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Genre' })

    const updatedOnDatabase = await prisma.genre.findUnique({
      where: { id: genre.id },
    })

    expect(response.statusCode).toBe(200)
    expect(updatedOnDatabase?.name).toBe('Updated Genre')
  })
})
