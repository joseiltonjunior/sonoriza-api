import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Role } from '@prisma/client'
import request from 'supertest'
import { authenticateTestUser } from '@/utils/authenticate'

describe('Delete music (E2E)', () => {
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

  test('[DELETE]/musics/:id should return 403 for USER role', async () => {
    const { token } = await authenticateTestUser(app, prisma, Role.USER)

    const music = await prisma.music.create({
      data: {
        title: 'Music to Delete (USER)',
        slug: `delete-user-${Date.now()}-${Math.random()}`,
        audioPath: 'https://cdn.example.com/delete-user.mp3',
      },
    })

    const response = await request(app.getHttpServer())
      .delete(`/musics/${music.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(403)
  })

  test('[DELETE]/musics/:id should soft delete music for ADMIN role', async () => {
    const { token } = await authenticateTestUser(app, prisma, Role.ADMIN)

    const music = await prisma.music.create({
      data: {
        title: 'Music to Delete (ADMIN)',
        slug: `delete-admin-${Date.now()}-${Math.random()}`,
        audioPath: 'https://cdn.example.com/delete-admin.mp3',
      },
    })

    const response = await request(app.getHttpServer())
      .delete(`/musics/${music.id}`)
      .set('Authorization', `Bearer ${token}`)

    const deletedOnDatabase = await prisma.music.findUnique({
      where: { id: music.id },
    })

    expect(response.statusCode).toBe(204)
    expect(deletedOnDatabase?.deletedAt).toBeTruthy()
  })
})
