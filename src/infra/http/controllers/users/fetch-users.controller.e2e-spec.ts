import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { authenticateTestUser } from '@/utils/authenticate'
import { Role } from '@prisma/client'

describe('Fetch users (E2E)', () => {
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

  test('[GET]/users should require auth token', async () => {
    const response = await request(app.getHttpServer()).get('/users?page=1')

    expect(response.statusCode).toBe(401)
  })

  test('[GET]/users should reject non-admin users', async () => {
    const { token } = await authenticateTestUser(app, prisma, Role.USER)

    const response = await request(app.getHttpServer())
      .get('/users?page=1')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(403)
  })

  test('[GET]/users should fetch paginated users for admin', async () => {
    const { token } = await authenticateTestUser(app, prisma, Role.ADMIN)
    const prefix = `fetch-user-${Date.now()}-${Math.random()}`

    for (let i = 1; i <= 25; i++) {
      await prisma.user.create({
        data: {
          name: `${prefix}-${i}`,
          email: `${prefix}-${i}@example.com`,
          password: 'hashed-password',
          role: Role.USER,
        },
      })
    }

    const toDelete = await prisma.user.findFirst({
      where: { email: `${prefix}-25@example.com` },
    })

    if (toDelete) {
      await prisma.user.update({
        where: { id: toDelete.id },
        data: {
          isActive: false,
          deletedAt: new Date(),
        },
      })
    }

    const response = await request(app.getHttpServer())
      .get('/users?page=1')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.data.length).toBeLessThanOrEqual(20)
    expect(response.body.meta.page).toBe(1)
    expect(
      response.body.data.some(
        (item: { email: string }) =>
          typeof item.email === 'string' && item.email.startsWith(prefix),
      ),
    ).toBe(true)
  })
})
