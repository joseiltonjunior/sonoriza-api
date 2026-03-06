import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

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

  test('[GET]/artists should fetch paginated artists', async () => {
    const prefix = `fetch-artist-${Date.now()}-${Math.random()}`

    for (let i = 1; i <= 25; i++) {
      await prisma.artist.create({
        data: {
          name: `${prefix}-${i}`,
          photoURL: `https://cdn.sonoriza.com/artists/${prefix}-${i}.jpg`,
        },
      })
    }

    const toDelete = await prisma.artist.findFirst({
      where: { name: `${prefix}-25` },
    })

    if (toDelete) {
      await prisma.artist.update({
        where: { id: toDelete.id },
        data: { deletedAt: new Date() },
      })
    }

    const response = await request(app.getHttpServer()).get('/artists?page=1')

    expect(response.statusCode).toBe(200)
    expect(response.body.data.length).toBeLessThanOrEqual(20)
    expect(response.body.meta.page).toBe(1)
    expect(
      response.body.data.some(
        (item: { name: string }) =>
          typeof item.name === 'string' && item.name.startsWith(prefix),
      ),
    ).toBe(true)
  })
})
