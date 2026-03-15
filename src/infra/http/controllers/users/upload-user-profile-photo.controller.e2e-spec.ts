import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { authenticateTestUser } from '@/utils/authenticate'

describe('Upload user profile photo (E2E)', () => {
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

  test('[POST]/me/photo should upload profile photo for authenticated user', async () => {
    const { token, user } = await authenticateTestUser(app, prisma)

    const response = await request(app.getHttpServer())
      .post('/me/photo')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from('fake-image-content'), {
        filename: 'avatar.png',
        contentType: 'image/png',
      })

    const userOnDatabase = await prisma.user.findUnique({
      where: { id: user.id },
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      accountStatus: user.accountStatus,
      photoUrl: expect.stringMatching(
        new RegExp(`users/${user.id}-\\d+\\.webp`),
      ),
    })
    expect(userOnDatabase?.photoUrl).toEqual(
      expect.stringMatching(new RegExp(`users/${user.id}-\\d+\\.webp`)),
    )
  })

  test('[POST]/me/photo should reject invalid file type', async () => {
    const { token } = await authenticateTestUser(app, prisma)

    const response = await request(app.getHttpServer())
      .post('/me/photo')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from('fake-pdf-content'), {
        filename: 'avatar.pdf',
        contentType: 'application/pdf',
      })

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({
      message: 'Unsupported profile photo type',
      code: 'INVALID_PROFILE_PHOTO',
    })
  })
})
