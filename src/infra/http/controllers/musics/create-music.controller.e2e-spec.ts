import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Role } from '@prisma/client'
import request from 'supertest'
import { authenticateTestUser } from '@/utils/authenticate'

describe('Create music (E2E)', () => {
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

  test('[POST]/musics should return 403 for USER role', async () => {
    const { token } = await authenticateTestUser(app, prisma, Role.USER)
    const slug = `user-forbidden-${Date.now()}-${Math.random()}`

    const response = await request(app.getHttpServer())
      .post('/musics')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Forbidden Music',
        slug,
        url: 'https://cdn.example.com/audio.mp3',
      })

    expect(response.statusCode).toBe(403)
  })

  test('[POST]/musics should create music for ADMIN role', async () => {
    const { token } = await authenticateTestUser(app, prisma, Role.ADMIN)
    const slug = `admin-create-${Date.now()}-${Math.random()}`

    const response = await request(app.getHttpServer())
      .post('/musics')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Admin Music',
        slug,
        url: 'https://cdn.example.com/admin-audio.mp3',
      })

    const musicOnDatabase = await prisma.music.findUnique({
      where: { slug },
    })

    expect(response.statusCode).toBe(201)
    expect(musicOnDatabase).toBeTruthy()
  })
})
