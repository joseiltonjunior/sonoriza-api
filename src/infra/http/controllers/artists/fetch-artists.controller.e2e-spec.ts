import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { authenticateTestUser } from '@/utils/authenticate'
import { Role } from '@prisma/client'

describe('Fetch artists (E2E)', () => {
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

  test('[GET]/artists should require auth token', async () => {
    const response = await request(app.getHttpServer()).get('/artists?page=1')

    expect(response.statusCode).toBe(401)
  })

  test('[GET]/artists should fetch paginated artists with musics for authenticated USER/ADMIN', async () => {
    const { token } = await authenticateTestUser(app, prisma, Role.USER)
    const prefix = `fetch-artist-${Date.now()}-${Math.random()}`

    for (let i = 1; i <= 25; i++) {
      await prisma.artist.create({
        data: {
          name: `${prefix}-${i}`,
          photoURL: `https://cdn.sonoriza.com/artists/${prefix}-${i}.jpg`,
        },
      })
    }

    const featuredArtist = await prisma.artist.create({
      data: {
        name: `${prefix}-featured`,
        photoURL: `https://cdn.sonoriza.com/artists/${prefix}-featured.jpg`,
      },
    })

    await prisma.music.create({
      data: {
        title: `${prefix}-music-1`,
        slug: `${prefix}-music-1`,
        audioPath: `https://cdn.sonoriza.com/musics/${prefix}-music-1.mp3`,
        artists: {
          create: [{ artistId: featuredArtist.id }],
        },
      },
    })

    const toDelete = await prisma.artist.findFirst({
      where: { name: `${prefix}-25` },
    })

    if (toDelete) {
      await prisma.artist.update({
        where: { id: toDelete.id },
        data: { deletedAt: new Date() },
      })
    }

    const response = await request(app.getHttpServer())
      .get('/artists?page=1')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.data.length).toBeLessThanOrEqual(20)
    expect(response.body.meta.page).toBe(1)

    const artistResult = response.body.data.find(
      (item: { name: string }) =>
        typeof item.name === 'string' && item.name === `${prefix}-featured`,
    )

    expect(artistResult).toBeTruthy()
    expect(Array.isArray(artistResult.musics)).toBe(true)
    expect(
      artistResult.musics.some(
        (music: { title: string }) => music.title === `${prefix}-music-1`,
      ),
    ).toBe(true)
  })

  test('[GET]/artists should filter by name query', async () => {
    const { token } = await authenticateTestUser(app, prisma, Role.USER)
    const prefix = `fetch-artist-name-${Date.now()}-${Math.random()}`

    await prisma.artist.create({
      data: {
        name: `${prefix}-natanzinho`,
        photoURL: `https://cdn.sonoriza.com/artists/${prefix}-natanzinho.jpg`,
      },
    })

    await prisma.artist.create({
      data: {
        name: `${prefix}-nathan`,
        photoURL: `https://cdn.sonoriza.com/artists/${prefix}-nathan.jpg`,
      },
    })

    await prisma.artist.create({
      data: {
        name: `${prefix}-joao`,
        photoURL: `https://cdn.sonoriza.com/artists/${prefix}-joao.jpg`,
      },
    })

    const response = await request(app.getHttpServer())
      .get(`/artists?page=1&name=${prefix}-nat`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.meta.page).toBe(1)
    expect(response.body.data).toHaveLength(2)
    expect(
      response.body.data.map((artist: { name: string }) => artist.name),
    ).toEqual(
      expect.arrayContaining([
        `${prefix}-natanzinho`,
        `${prefix}-nathan`,
      ]),
    )
  })

  test('[GET]/artists should filter by genreId query', async () => {
    const { token } = await authenticateTestUser(app, prisma, Role.USER)
    const prefix = `fetch-artist-genre-${Date.now()}-${Math.random()}`

    const genreA = await prisma.genre.create({
      data: {
        name: `${prefix}-genre-a`,
      },
    })

    const genreB = await prisma.genre.create({
      data: {
        name: `${prefix}-genre-b`,
      },
    })

    await prisma.artist.create({
      data: {
        name: `${prefix}-artist-a`,
        photoURL: `https://cdn.sonoriza.com/artists/${prefix}-artist-a.jpg`,
        musicalGenres: {
          create: [{ genreId: genreA.id }],
        },
      },
    })

    await prisma.artist.create({
      data: {
        name: `${prefix}-artist-b`,
        photoURL: `https://cdn.sonoriza.com/artists/${prefix}-artist-b.jpg`,
        musicalGenres: {
          create: [{ genreId: genreB.id }],
        },
      },
    })

    await prisma.artist.create({
      data: {
        name: `${prefix}-artist-ab`,
        photoURL: `https://cdn.sonoriza.com/artists/${prefix}-artist-ab.jpg`,
        musicalGenres: {
          create: [{ genreId: genreA.id }, { genreId: genreB.id }],
        },
      },
    })

    const response = await request(app.getHttpServer())
      .get(`/artists?page=1&genreId=${genreA.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.meta.page).toBe(1)
    expect(response.body.data).toHaveLength(2)
    expect(
      response.body.data.map((artist: { name: string }) => artist.name),
    ).toEqual(
      expect.arrayContaining([
        `${prefix}-artist-a`,
        `${prefix}-artist-ab`,
      ]),
    )
  })
})
