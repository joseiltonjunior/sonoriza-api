import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Role } from '@prisma/client'
import request from 'supertest'
import { authenticateTestUser } from '@/utils/authenticate'

describe('Delete artist (E2E)', () => {
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

  test('[DELETE]/artists/:id should return 403 for USER role', async () => {
    const { token } = await authenticateTestUser(app, prisma, Role.USER)

    const artist = await prisma.artist.create({
      data: {
        name: `Delete User ${Date.now()} ${Math.random()}`,
        photoURL: 'https://cdn.sonoriza.com/artists/delete-user.jpg',
      },
    })

    const response = await request(app.getHttpServer())
      .delete(`/artists/${artist.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(403)
  })

  test('[DELETE]/artists/:id should soft delete artist for ADMIN role', async () => {
    const { token } = await authenticateTestUser(app, prisma, Role.ADMIN)

    const artist = await prisma.artist.create({
      data: {
        name: `Delete Admin ${Date.now()} ${Math.random()}`,
        photoURL: 'https://cdn.sonoriza.com/artists/delete-admin.jpg',
      },
    })

    const response = await request(app.getHttpServer())
      .delete(`/artists/${artist.id}`)
      .set('Authorization', `Bearer ${token}`)

    const deletedOnDatabase = await prisma.artist.findUnique({
      where: { id: artist.id },
    })

    expect(response.statusCode).toBe(204)
    expect(deletedOnDatabase?.deletedAt).toBeTruthy()
  })
})
