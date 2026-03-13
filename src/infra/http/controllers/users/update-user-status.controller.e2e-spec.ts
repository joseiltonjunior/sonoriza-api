import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Role } from '@prisma/client'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { authenticateTestUser } from '@/utils/authenticate'

describe('Update user status (E2E)', () => {
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

  test('[PATCH]/users/:id/status should require auth token', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/some-id/status')
      .send({ accountStatus: 'SUSPENDED' })

    expect(response.statusCode).toBe(401)
  })

  test('[PATCH]/users/:id/status should reject non-admin users', async () => {
    const { token } = await authenticateTestUser(app, prisma, Role.USER)

    const target = await prisma.user.create({
      data: {
        name: 'Target User',
        email: `target-${Math.random()}@example.com`,
        password: '123456',
        role: Role.USER,
      },
    })

    const response = await request(app.getHttpServer())
      .patch(`/users/${target.id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ accountStatus: 'SUSPENDED' })

    expect(response.statusCode).toBe(403)
  })

  test('[PATCH]/users/:id/status should update user status for admin', async () => {
    const { token } = await authenticateTestUser(app, prisma, Role.ADMIN)

    const target = await prisma.user.create({
      data: {
        name: 'Target User Admin',
        email: `target-admin-${Math.random()}@example.com`,
        password: '123456',
        role: Role.USER,
      },
    })

    const response = await request(app.getHttpServer())
      .patch(`/users/${target.id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ accountStatus: 'SUSPENDED' })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        id: target.id,
        accountStatus: 'SUSPENDED',
      }),
    )

    const updated = await prisma.user.findUnique({ where: { id: target.id } })

    expect(updated?.accountStatus).toBe('SUSPENDED')
    expect(updated?.deletedAt).toBeNull()
  })
})
