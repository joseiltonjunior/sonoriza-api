import { randomUUID } from 'node:crypto'

import { LogoutSessionUseCase } from './logout-session.use-case'
import { SessionTokenService } from './session-token.service'
import { InMemorySessionRepository } from '../repositories/in-memory-session.repository'
import { Session } from '../entities/session'
import { hashRefreshToken } from './hash-refresh-token'
import { InvalidSessionError } from '../errors/invalid-session.error'

class FakeSessionTokenService implements SessionTokenService {
  generateAccessToken() {
    return 'access-token'
  }

  generateRefreshToken() {
    return {
      token: 'refresh-token',
      expiresAt: new Date(),
    }
  }

  verifyRefreshToken(token: string) {
    const [, sub, jti] = token.split(':')

    if (!sub || !jti) {
      throw new Error('invalid token')
    }

    return {
      sub,
      jti,
      type: 'refresh' as const,
    }
  }
}

describe('LogoutSessionUseCase', () => {
  it('should revoke an existing session', async () => {
    const sessionRepo = new InMemorySessionRepository()
    const tokenService = new FakeSessionTokenService()
    const useCase = new LogoutSessionUseCase(sessionRepo, tokenService)

    const jti = randomUUID()
    const refreshToken = `refresh:user-1:${jti}`
    const session = new Session(
      randomUUID(),
      'user-1',
      jti,
      hashRefreshToken(refreshToken),
      new Date(Date.now() + 24 * 60 * 60 * 1000),
    )

    await sessionRepo.create(session)

    await useCase.execute({ refreshToken })

    expect(sessionRepo.items[0].revokedAt).toBeInstanceOf(Date)
    expect(sessionRepo.items[0].lastUsedAt).toBeInstanceOf(Date)
  })

  it('should throw when refresh token is invalid', async () => {
    const sessionRepo = new InMemorySessionRepository()
    const tokenService = new FakeSessionTokenService()
    const useCase = new LogoutSessionUseCase(sessionRepo, tokenService)

    await expect(
      useCase.execute({
        refreshToken: 'invalid',
      }),
    ).rejects.toBeInstanceOf(InvalidSessionError)
  })
})
