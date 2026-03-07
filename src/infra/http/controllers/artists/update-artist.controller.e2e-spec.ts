import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Role } from '@prisma/client'
import request from 'supertest'
import { authenticateTestUser } from '@/utils/authenticate'

describe('Update artist (E2E)', () => {
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

  test('[PATCH]/artists/:id should return 403 for USER role', async () => {
    const { token } = await authenticateTestUser(app, prisma, Role.USER)

    const artist = await prisma.artist.create({
      data: {
        name: `Update User ${Date.now()} ${Math.random()}`,
        photoURL: 'https://cdn.sonoriza.com/artists/update-user.jpg',
      },
    })

    const response = await request(app.getHttpServer())
      .patch(`/artists/${artist.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Should not update' })

    expect(response.statusCode).toBe(403)
  })

  test('[PATCH]/artists/:id should reject manual like field', async () => {
    const { token } = await authenticateTestUser(app, prisma, Role.ADMIN)

    const artist = await prisma.artist.create({
      data: {
        name: `Reject artist like ${Date.now()} ${Math.random()}`,
        photoURL: 'https://cdn.sonoriza.com/artists/reject-like.jpg',
      },
    })

    const response = await request(app.getHttpServer())
      .patch(`/artists/${artist.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ like: 999 })

    expect(response.statusCode).toBe(400)
  })

  test('[PATCH]/artists/:id should update artist for ADMIN role and sync artist genres', async () => {
    const { token } = await authenticateTestUser(app, prisma, Role.ADMIN)

    const artist = await prisma.artist.create({
      data: {
        name: `Update Admin ${Date.now()} ${Math.random()}`,
        photoURL: 'https://cdn.sonoriza.com/artists/update-admin.jpg',
      },
    })

    const genre = await prisma.genre.create({
      data: {
        name: `Updated artist genre ${Date.now()} ${Math.random()}`,
      },
    })

    const response = await request(app.getHttpServer())
      .patch(`/artists/${artist.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Artist', genreIds: [genre.id] })

    const updatedOnDatabase = await prisma.artist.findUnique({
      where: { id: artist.id },
      include: {
        musicalGenres: true,
      },
    })

    expect(response.statusCode).toBe(200)
    expect(updatedOnDatabase?.name).toBe('Updated Artist')
    expect(updatedOnDatabase?.musicalGenres.some((item) => item.genreId === genre.id)).toBe(true)
  })
})
