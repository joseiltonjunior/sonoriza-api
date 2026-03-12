import { Injectable } from '@nestjs/common'

import { Session } from '@/domain/sessions/entities/session'
import { SessionRepository } from '@/domain/sessions/repositories/session-repository'
import { PrismaSessionMapper } from './mappers/prisma-session.mapper'
import { PrismaService } from './prisma.service'

@Injectable()
export class PrismaSessionRepository implements SessionRepository {
  constructor(private prisma: PrismaService) {}

  async create(session: Session): Promise<void> {
    await this.prisma.session.create({
      data: PrismaSessionMapper.toPrisma(session),
    })
  }

  async findByRefreshTokenJti(
    refreshTokenJti: string,
  ): Promise<Session | null> {
    const session = await this.prisma.session.findUnique({
      where: { refreshTokenJti },
    })

    if (!session) {
      return null
    }

    return PrismaSessionMapper.toDomain(session)
  }

  async update(session: Session): Promise<void> {
    await this.prisma.session.update({
      where: { id: session.id },
      data: PrismaSessionMapper.toPrisma(session),
    })
  }
}
