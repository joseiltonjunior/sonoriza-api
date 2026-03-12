export interface SessionTokenService {
  generateAccessToken(payload: { sub: string; role: 'ADMIN' | 'USER' }): string
  generateRefreshToken(payload: { sub: string; jti: string }): {
    token: string
    expiresAt: Date
  }
  verifyRefreshToken(token: string): { sub: string; jti: string; type: 'refresh' }
}

export const SessionTokenServiceToken = Symbol('SessionTokenService')
