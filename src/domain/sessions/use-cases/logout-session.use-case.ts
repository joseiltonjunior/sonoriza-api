import { LogoutSessionDTO } from '../dtos/logout-session.dto'
import { InvalidSessionError } from '../errors/invalid-session.error'
import { SessionRepository } from '../repositories/session-repository'
import { hashRefreshToken } from './hash-refresh-token'
import { SessionTokenService } from './session-token.service'

export class LogoutSessionUseCase {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly sessionTokenService: SessionTokenService,
  ) {}

  async execute({ refreshToken }: LogoutSessionDTO): Promise<void> {
    let payload: { sub: string; jti: string; type: 'refresh' }

    try {
      payload = this.sessionTokenService.verifyRefreshToken(refreshToken)
    } catch {
      throw new InvalidSessionError()
    }

    const session = await this.sessionRepository.findByRefreshTokenJti(payload.jti)

    if (!session || session.revokedAt) {
      throw new InvalidSessionError()
    }

    if (session.refreshTokenHash !== hashRefreshToken(refreshToken)) {
      throw new InvalidSessionError()
    }

    session.markUsed()
    session.revoke()

    await this.sessionRepository.update(session)
  }
}
