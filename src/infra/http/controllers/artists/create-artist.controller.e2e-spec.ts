import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Role } from '@prisma/client'
import request from 'supertest'
import { authenticateTestUser } from '@/utils/authenticate'

describe('Create artist (E2E)', () => {
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

  test('[POST]/artists should return 403 for USER role', async () => {
    const { token } = await authenticateTestUser(app, prisma, Role.USER)

    const response = await request(app.getHttpServer())
      .post('/artists')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Forbidden Artist',
        photoURL: 'https://cdn.sonoriza.com/artists/forbidden.jpg',
      })

    expect(response.statusCode).toBe(403)
  })

  test('[POST]/artists should reject manual like field', async () => {
    const { token } = await authenticateTestUser(app, prisma, Role.ADMIN)

    const response = await request(app.getHttpServer())
      .post('/artists')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Artist with forbidden like',
        photoURL: 'https://cdn.sonoriza.com/artists/forbidden-like.jpg',
        like: 999,
      })

    expect(response.statusCode).toBe(400)
  })

  test('[POST]/artists should create artist for ADMIN role and persist artist genres', async () => {
    const { token } = await authenticateTestUser(app, prisma, Role.ADMIN)
    const name = `Admin Artist ${Date.now()} ${Math.random()}`

    const genre = await prisma.genre.create({
      data: {
        name: `Genre for artist ${Date.now()} ${Math.random()}`,
      },
    })

    const response = await request(app.getHttpServer())
      .post('/artists')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name,
        photoURL: 'https://cdn.sonoriza.com/artists/admin.jpg',
        genreIds: [genre.id],
      })

    const artistOnDatabase = await prisma.artist.findFirst({
      where: { name },
      include: {
        musicalGenres: true,
      },
    })

    expect(response.statusCode).toBe(201)
    expect(artistOnDatabase).toBeTruthy()
    expect(artistOnDatabase?.likesCount).toBe(0)
    expect(
      artistOnDatabase?.musicalGenres.some((item) => item.genreId === genre.id),
    ).toBe(true)
  })
})
