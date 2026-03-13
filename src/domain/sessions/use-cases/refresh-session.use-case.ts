import { randomUUID } from 'node:crypto'

import { UserRepository } from '@/domain/users/repositories/user-repository'

import { RefreshSessionDTO } from '../dtos/refresh-session.dto'
import { InvalidSessionError } from '../errors/invalid-session.error'
import { Session } from '../entities/session'
import { SessionRepository } from '../repositories/session-repository'
import { hashRefreshToken } from './hash-refresh-token'
import { SessionTokenService } from './session-token.service'

export class RefreshSessionUseCase {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly userRepository: UserRepository,
    private readonly sessionTokenService: SessionTokenService,
  ) {}

  async execute({ refreshToken }: RefreshSessionDTO) {
    let payload: { sub: string; jti: string; type: 'refresh' }

    try {
      payload = this.sessionTokenService.verifyRefreshToken(refreshToken)
    } catch {
      throw new InvalidSessionError()
    }

    const session = await this.sessionRepository.findByRefreshTokenJti(
      payload.jti,
    )

    if (!session) {
      throw new InvalidSessionError()
    }

    if (session.revokedAt || session.isExpired()) {
      throw new InvalidSessionError()
    }

    if (session.refreshTokenHash !== hashRefreshToken(refreshToken)) {
      throw new InvalidSessionError()
    }

    const user = await this.userRepository.findById(payload.sub)

    if (!user || user.deletedAt || user.accountStatus !== 'ACTIVE') {
      throw new InvalidSessionError()
    }

    const nextSession = this.createRotatedSession(user.id, user.role)

    await this.sessionRepository.create(nextSession.session)

    session.markUsed()
    session.revoke(nextSession.session.id)

    await this.sessionRepository.update(session)

    return {
      accessToken: nextSession.accessToken,
      refreshToken: nextSession.refreshToken,
    }
  }

  private createRotatedSession(userId: string, role: 'ADMIN' | 'USER') {
    const refreshTokenJti = randomUUID()
    const accessToken = this.sessionTokenService.generateAccessToken({
      sub: userId,
      role,
    })
    const refreshToken = this.sessionTokenService.generateRefreshToken({
      sub: userId,
      jti: refreshTokenJti,
    })

    return {
      accessToken,
      refreshToken: refreshToken.token,
      session: new Session(
        randomUUID(),
        userId,
        refreshTokenJti,
        hashRefreshToken(refreshToken.token),
        refreshToken.expiresAt,
      ),
    }
  }
}
