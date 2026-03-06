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
      raw.isActive,
      raw.photoUrl,
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
      isActive: entity.isActive,
      photoUrl: entity.photoUrl,
      deletedAt: entity.deletedAt,
    }
  }
}
