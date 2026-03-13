import { randomUUID } from 'node:crypto'

import { User } from '@/domain/users/entities/user'
import { InMemoryUserRepository } from '@/domain/users/repositories/in-memory-user.repository'

import { Session } from '../entities/session'
import { InvalidSessionError } from '../errors/invalid-session.error'
import { InMemorySessionRepository } from '../repositories/in-memory-session.repository'
import { hashRefreshToken } from './hash-refresh-token'
import { RefreshSessionUseCase } from './refresh-session.use-case'
import { SessionTokenService } from './session-token.service'

class FakeSessionTokenService implements SessionTokenService {
  generateAccessToken(payload: { sub: string; role: 'ADMIN' | 'USER' }) {
    return `access-${payload.sub}-${payload.role}-${randomUUID()}`
  }

  generateRefreshToken(payload: { sub: string; jti: string }) {
    return {
      token: `refresh:${payload.sub}:${payload.jti}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
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

describe('RefreshSessionUseCase', () => {
  it('should rotate the refresh token and issue a new access token', async () => {
    const sessionRepo = new InMemorySessionRepository()
    const userRepo = new InMemoryUserRepository()
    const tokenService = new FakeSessionTokenService()
    const useCase = new RefreshSessionUseCase(
      sessionRepo,
      userRepo,
      tokenService,
    )

    const user = new User(
      randomUUID(),
      'John Doe',
      'john@example.com',
      'hashed-password',
      'USER',
      'ACTIVE',
    )
    userRepo.items.push(user)

    const initialJti = randomUUID()
    const initialRefreshToken = `refresh:${user.id}:${initialJti}`
    const session = new Session(
      randomUUID(),
      user.id,
      initialJti,
      hashRefreshToken(initialRefreshToken),
      new Date(Date.now() + 24 * 60 * 60 * 1000),
    )

    await sessionRepo.create(session)

    const result = await useCase.execute({
      refreshToken: initialRefreshToken,
    })

    expect(result.accessToken).toContain(`access-${user.id}-USER-`)
    expect(result.refreshToken).not.toBe(initialRefreshToken)
    expect(sessionRepo.items).toHaveLength(2)
    expect(sessionRepo.items[0].revokedAt).toBeInstanceOf(Date)
    expect(sessionRepo.items[0].replacedById).toBe(sessionRepo.items[1].id)
  })

  it('should throw when refresh token is invalid', async () => {
    const sessionRepo = new InMemorySessionRepository()
    const userRepo = new InMemoryUserRepository()
    const tokenService = new FakeSessionTokenService()
    const useCase = new RefreshSessionUseCase(
      sessionRepo,
      userRepo,
      tokenService,
    )

    await expect(
      useCase.execute({
        refreshToken: 'invalid',
      }),
    ).rejects.toBeInstanceOf(InvalidSessionError)
  })
})
