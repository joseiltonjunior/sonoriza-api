import { User } from '@/domain/users/entities/user'
import { User as PrismaUser } from '@prisma/client'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return new User(
      raw.id,
      raw.name,
      raw.email,
      raw.password,
      raw.role,
      raw.accountStatus,
      raw.photoUrl,
      raw.emailVerifiedAt,
      raw.createdAt,
      raw.updatedAt,
      raw.deletedAt,
    )
  }

  static toPrisma(entity: User) {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      password: entity.password,
      role: entity.role,
      accountStatus: entity.accountStatus,
      photoUrl: entity.photoUrl,
      emailVerifiedAt: entity.emailVerifiedAt,
      deletedAt: entity.deletedAt,
    }
  }
}
