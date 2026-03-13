import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Env } from '@/infra/env'
import { UnauthorizedException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import z from 'zod'

const tokenPayloadSchema = z.object({
  sub: z.uuid(),
  role: z.enum(['USER', 'ADMIN']),
})

export type UserPayload = z.infer<typeof tokenPayloadSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService<Env, true>,
    private prisma: PrismaService,
  ) {
    const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    })
  }

  async validate(payload: UserPayload) {
    const parsed = tokenPayloadSchema.parse(payload)

    const user = await this.prisma.user.findUnique({
      where: { id: parsed.sub },
      select: {
        id: true,
        role: true,
        accountStatus: true,
        deletedAt: true,
      },
    })

    if (
      !user ||
      user.accountStatus !== 'ACTIVE' ||
      !!user.deletedAt ||
      user.role !== parsed.role
    ) {
      throw new UnauthorizedException('Invalid token user')
    }

    return { sub: user.id, role: user.role }
  }
}
