import { AccountVerification } from '@/domain/users/entities/account-verification'
import { AccountVerification as PrismaAccountVerification } from '@prisma/client'

export class PrismaAccountVerificationMapper {
  static toDomain(raw: PrismaAccountVerification): AccountVerification {
    return new AccountVerification(
      raw.id,
      raw.userId,
      raw.codeHash,
      raw.expiresAt,
      raw.resendAvailableAt,
      raw.attempts,
      raw.maxAttempts,
      raw.verifiedAt,
      raw.revokedAt,
      raw.createdAt,
      raw.updatedAt,
    )
  }

  static toPrisma(entity: AccountVerification) {
    return {
      id: entity.id,
      userId: entity.userId,
      codeHash: entity.codeHash,
      expiresAt: entity.expiresAt,
      resendAvailableAt: entity.resendAvailableAt,
      attempts: entity.attempts,
      maxAttempts: entity.maxAttempts,
      verifiedAt: entity.verifiedAt,
      revokedAt: entity.revokedAt,
    }
  }
}
