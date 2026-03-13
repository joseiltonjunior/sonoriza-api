import { PrismaService } from '@/infra/database/prisma/prisma.service'
import request from 'supertest'
import { Role } from '@prisma/client'
import { hash } from 'bcryptjs'
import { INestApplication } from '@nestjs/common'

export async function authenticateTestUser(
  app: INestApplication,
  prisma: PrismaService,
  role: Role = Role.USER,
  accountStatus: 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED' = 'ACTIVE',
) {
  const email = `test-${role}-${Math.random()}@example.com`
  const password = '123456'

  const user = await prisma.user.create({
    data: {
      name: `Test User (${role})`,
      email,
      password: await hash(password, 8),
      role,
      accountStatus,
    },
  })

  const auth = await request(app.getHttpServer())
    .post('/sessions')
    .send({ email, password })

  return {
    token: auth.body.access_token,
    refreshToken: auth.body.refresh_token,
    user,
  }
}
