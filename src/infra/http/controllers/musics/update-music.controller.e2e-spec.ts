import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Role } from '@prisma/client'
import request from 'supertest'
import { authenticateTestUser } from '@/utils/authenticate'

describe('Update music (E2E)', () => {
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

  test('[PATCH]/musics/:id should return 403 for USER role', async () => {
    const { token } = await authenticateTestUser(app, prisma, Role.USER)

    const music = await prisma.music.create({
      data: {
        title: 'Music to Update (USER)',
        slug: `update-user-${Date.now()}-${Math.random()}`,
        audioPath: 'https://cdn.example.com/update-user.mp3',
      },
    })

    const response = await request(app.getHttpServer())
      .patch(`/musics/${music.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Should not update' })

    expect(response.statusCode).toBe(403)
  })

  test('[PATCH]/musics/:id should reject manual like/view fields', async () => {
    const { token } = await authenticateTestUser(app, prisma, Role.ADMIN)

    const music = await prisma.music.create({
      data: {
        title: 'Music to Reject Manual Counters',
        slug: `reject-counters-${Date.now()}-${Math.random()}`,
        audioPath: 'https://cdn.example.com/reject-counters.mp3',
      },
    })

    const response = await request(app.getHttpServer())
      .patch(`/musics/${music.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ like: 999, view: 9999 })

    expect(response.statusCode).toBe(400)
  })

  test('[PATCH]/musics/:id should update music for ADMIN role', async () => {
    const { token } = await authenticateTestUser(app, prisma, Role.ADMIN)

    const music = await prisma.music.create({
      data: {
        title: 'Music to Update (ADMIN)',
        slug: `update-admin-${Date.now()}-${Math.random()}`,
        audioPath: 'https://cdn.example.com/update-admin.mp3',
      },
    })

    const response = await request(app.getHttpServer())
      .patch(`/musics/${music.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated by Admin' })

    const updatedOnDatabase = await prisma.music.findUnique({
      where: { id: music.id },
    })

    expect(response.statusCode).toBe(200)
    expect(updatedOnDatabase?.title).toBe('Updated by Admin')
  })
})
