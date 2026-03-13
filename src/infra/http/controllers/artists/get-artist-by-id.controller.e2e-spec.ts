import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Role } from '@prisma/client'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { authenticateTestUser } from '@/utils/authenticate'

describe('Get artist by id (E2E)', () => {
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

  test('[GET]/artists/:id should require auth token', async () => {
    const response = await request(app.getHttpServer()).get(
      '/artists/artist-id',
    )

    expect(response.statusCode).toBe(401)
  })

  test('[GET]/artists/:id should return the requested artist for authenticated users', async () => {
    const { token } = await authenticateTestUser(app, prisma, Role.USER)
    const prefix = `get-artist-${Date.now()}-${Math.random()}`

    const artist = await prisma.artist.create({
      data: {
        name: `${prefix}-name`,
        photoURL: `https://cdn.sonoriza.com/artists/${prefix}.jpg`,
      },
    })

    await prisma.music.create({
      data: {
        title: `${prefix}-music`,
        slug: `${prefix}-music`,
        album: `${prefix}-album`,
        audioPath: `https://cdn.sonoriza.com/musics/${prefix}-music.mp3`,
        artists: {
          create: [{ artistId: artist.id }],
        },
      },
    })

    const response = await request(app.getHttpServer())
      .get(`/artists/${artist.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        id: artist.id,
        name: `${prefix}-name`,
      }),
    )
    expect(response.body.musics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: `${prefix}-music`,
          album: `${prefix}-album`,
        }),
      ]),
    )
  })
})
