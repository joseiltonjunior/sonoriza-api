import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { z } from 'zod'

import { Env } from '@/infra/env'
import { SessionTokenService } from '@/domain/sessions/use-cases/session-token.service'

const refreshTokenPayloadSchema = z.object({
  sub: z.uuid(),
  jti: z.uuid(),
  type: z.literal('refresh'),
})

@Injectable()
export class JwtSessionTokenService implements SessionTokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  generateAccessToken(payload: { sub: string; role: 'ADMIN' | 'USER' }) {
    const expiresIn = String(
      this.config.get('JWT_ACCESS_TOKEN_EXPIRES_IN', {
        infer: true,
      }),
    )

    return this.jwt.sign(payload, {
      expiresIn: this.parseDurationToSeconds(expiresIn),
    })
  }

  generateRefreshToken(payload: { sub: string; jti: string }) {
    const expiresIn = String(
      this.config.get('JWT_REFRESH_TOKEN_EXPIRES_IN', {
        infer: true,
      }),
    )

    const token = this.jwt.sign(
      {
        sub: payload.sub,
        jti: payload.jti,
        type: 'refresh' as const,
      },
      {
        expiresIn: this.parseDurationToSeconds(expiresIn),
      },
    )

    return {
      token,
      expiresAt: new Date(Date.now() + this.parseDurationToMs(expiresIn)),
    }
  }

  verifyRefreshToken(token: string) {
    const payload = this.jwt.verify(token)

    return refreshTokenPayloadSchema.parse(payload)
  }

  private parseDurationToSeconds(value: string) {
    return Math.floor(this.parseDurationToMs(value) / 1000)
  }

  private parseDurationToMs(value: string) {
    const match = /^(\d+)([smhd])$/.exec(value)

    if (!match) {
      throw new Error(`Invalid token duration: ${value}`)
    }

    const amount = Number(match[1])
    const unit = match[2] as 's' | 'm' | 'h' | 'd'

    const multiplierByUnit = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    } as const

    return amount * multiplierByUnit[unit]
  }
}
