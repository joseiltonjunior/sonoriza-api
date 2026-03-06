import { Genre } from '@/domain/genres/entities/genre'
import { Genre as PrismaGenre } from '@prisma/client'

export class PrismaGenreMapper {
  static toDomain(raw: PrismaGenre): Genre {
    return new Genre(
      raw.id,
      raw.name,
      raw.createdAt,
      raw.updatedAt,
      raw.deletedAt,
    )
  }

  static toPrisma(genre: Genre) {
    return {
      id: genre.id,
      name: genre.name,
      deletedAt: genre.deletedAt,
    }
  }
}
