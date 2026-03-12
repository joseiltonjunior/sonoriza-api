import { Session } from '../entities/session'
import { InMemorySessionRepository } from '../repositories/in-memory-session.repository'
import { CreateSessionUseCase } from './create-session.use-case'
import { SessionTokenService } from './session-token.service'

class FakeSessionTokenService implements SessionTokenService {
  generateAccessToken(payload: { sub: string; role: 'ADMIN' | 'USER' }) {
    return `access-${payload.sub}-${payload.role}`
  }

  generateRefreshToken(payload: { sub: string; jti: string }) {
    return {
      token: `refresh-${payload.sub}-${payload.jti}`,
      expiresAt: new Date('2030-01-01T00:00:00.000Z'),
    }
  }

  verifyRefreshToken(_token: string) {
    throw new Error('not implemented')
  }
}

describe('CreateSessionUseCase', () => {
  it('should create a session and return access and refresh tokens', async () => {
    const repo = new InMemorySessionRepository()
    const tokenService = new FakeSessionTokenService()
    const useCase = new CreateSessionUseCase(repo, tokenService)

    const result = await useCase.execute({
      userId: 'user-1',
      role: 'USER',
    })

    expect(result.accessToken).toBe('access-user-1-USER')
    expect(result.refreshToken).toContain('refresh-user-1-')
    expect(repo.items).toHaveLength(1)
    expect(repo.items[0]).toBeInstanceOf(Session)
    expect(repo.items[0].userId).toBe('user-1')
    expect(repo.items[0].refreshTokenHash).not.toBe(result.refreshToken)
  })
})
