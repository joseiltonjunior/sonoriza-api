import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Fetch genres (E2E)', () => {
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

  test('[GET]/genres should fetch paginated genres', async () => {
    const prefix = `fetch-${Date.now()}-${Math.random()}`

    for (let i = 1; i <= 25; i++) {
      await prisma.genre.create({
        data: {
          name: `${prefix}-Genre-${i}`,
        },
      })
    }

    const deletedName = `${prefix}-Genre-25`
    const toDelete = await prisma.genre.findFirst({
      where: { name: deletedName },
    })

    if (toDelete) {
      await prisma.genre.update({
        where: { id: toDelete.id },
        data: { deletedAt: new Date() },
      })
    }

    const response = await request(app.getHttpServer()).get('/genres?page=1')

    expect(response.statusCode).toBe(200)
    expect(response.body.data.length).toBeLessThanOrEqual(20)
    expect(response.body.meta.page).toBe(1)
    expect(
      response.body.data.some(
        (item: { name: string }) =>
          typeof item.name === 'string' && item.name.startsWith(prefix),
      ),
    ).toBe(true)
    expect(
      response.body.data.some(
        (item: { name: string }) => item.name === deletedName,
      ),
    ).toBe(false)
  })
})
