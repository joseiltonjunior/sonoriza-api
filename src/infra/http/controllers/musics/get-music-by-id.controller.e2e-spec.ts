import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Role } from '@prisma/client'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { authenticateTestUser } from '@/utils/authenticate'

describe('Get music by id (E2E)', () => {
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

  test('[GET]/musics/:id should require auth token', async () => {
    const response = await request(app.getHttpServer()).get('/musics/music-id')

    expect(response.statusCode).toBe(401)
  })

  test('[GET]/musics/:id should return the requested music for authenticated users', async () => {
    const { token } = await authenticateTestUser(app, prisma, Role.USER)
    const prefix = `get-music-${Date.now()}-${Math.random()}`

    const music = await prisma.music.create({
      data: {
        title: `${prefix}-title`,
        slug: `${prefix}-slug`,
        audioPath: `https://cdn.sonoriza.com/musics/${prefix}.mp3`,
      },
    })

    const response = await request(app.getHttpServer())
      .get(`/musics/${music.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        id: music.id,
        title: `${prefix}-title`,
      }),
    )
  })
})
