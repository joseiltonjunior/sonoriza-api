import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Role } from '@prisma/client'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { authenticateTestUser } from '@/utils/authenticate'

describe('Fetch musics (E2E)', () => {
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

  test('[GET]/musics should require auth token', async () => {
    const response = await request(app.getHttpServer()).get('/musics?page=1')

    expect(response.statusCode).toBe(401)
  })

  test('[GET]/musics should filter by artistId query', async () => {
    const { token } = await authenticateTestUser(app, prisma, Role.USER)
    const prefix = `fetch-musics-${Date.now()}-${Math.random()}`

    const artistA = await prisma.artist.create({
      data: {
        name: `${prefix}-artist-a`,
        photoURL: `https://cdn.sonoriza.com/artists/${prefix}-a.jpg`,
      },
    })

    const artistB = await prisma.artist.create({
      data: {
        name: `${prefix}-artist-b`,
        photoURL: `https://cdn.sonoriza.com/artists/${prefix}-b.jpg`,
      },
    })

    await prisma.music.create({
      data: {
        title: `${prefix}-music-a1`,
        slug: `${prefix}-music-a1`,
        audioPath: `https://cdn.sonoriza.com/musics/${prefix}-a1.mp3`,
        artists: {
          create: [{ artistId: artistA.id }],
        },
      },
    })

    await prisma.music.create({
      data: {
        title: `${prefix}-music-a2`,
        slug: `${prefix}-music-a2`,
        audioPath: `https://cdn.sonoriza.com/musics/${prefix}-a2.mp3`,
        artists: {
          create: [{ artistId: artistA.id }],
        },
      },
    })

    await prisma.music.create({
      data: {
        title: `${prefix}-music-b1`,
        slug: `${prefix}-music-b1`,
        audioPath: `https://cdn.sonoriza.com/musics/${prefix}-b1.mp3`,
        artists: {
          create: [{ artistId: artistB.id }],
        },
      },
    })

    const response = await request(app.getHttpServer())
      .get(`/musics?page=1&artistId=${artistA.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.meta.page).toBe(1)
    expect(response.body.data.length).toBe(2)

    const containsOnlyArtistA = response.body.data.every(
      (music: { artists: Array<{ id: string }> }) =>
        music.artists.some((artist) => artist.id === artistA.id) &&
        !music.artists.some((artist) => artist.id === artistB.id),
    )

    expect(containsOnlyArtistA).toBe(true)
  })
})
