import { randomUUID } from 'node:crypto'

import { Session } from '../entities/session'
import { SessionRepository } from '../repositories/session-repository'
import { hashRefreshToken } from './hash-refresh-token'
import { SessionTokenService } from './session-token.service'

export class CreateSessionUseCase {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly sessionTokenService: SessionTokenService,
  ) {}

  async execute(input: { userId: string; role: 'ADMIN' | 'USER' }) {
    const refreshTokenJti = randomUUID()
    const accessToken = this.sessionTokenService.generateAccessToken({
      sub: input.userId,
      role: input.role,
    })
    const refreshToken = this.sessionTokenService.generateRefreshToken({
      sub: input.userId,
      jti: refreshTokenJti,
    })

    const session = new Session(
      randomUUID(),
      input.userId,
      refreshTokenJti,
      hashRefreshToken(refreshToken.token),
      refreshToken.expiresAt,
    )

    await this.sessionRepository.create(session)

    return {
      accessToken,
      refreshToken: refreshToken.token,
    }
  }
}
