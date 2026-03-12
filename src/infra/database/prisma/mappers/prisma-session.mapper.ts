import { Session } from '@/domain/sessions/entities/session'
import { Session as PrismaSession } from '@prisma/client'

export class PrismaSessionMapper {
  static toDomain(raw: PrismaSession) {
    return new Session(
      raw.id,
      raw.userId,
      raw.refreshTokenJti,
      raw.refreshTokenHash,
      raw.expiresAt,
      raw.revokedAt,
      raw.lastUsedAt,
      raw.replacedById,
      raw.createdAt,
      raw.updatedAt,
    )
  }

  static toPrisma(session: Session) {
    return {
      id: session.id,
      userId: session.userId,
      refreshTokenJti: session.refreshTokenJti,
      refreshTokenHash: session.refreshTokenHash,
      expiresAt: session.expiresAt,
      revokedAt: session.revokedAt,
      lastUsedAt: session.lastUsedAt,
      replacedById: session.replacedById,
    }
  }
}
