import { Artist } from '@/domain/artists/entities/artist'
import { Artist as PrismaArtist } from '@prisma/client'

export class PrismaArtistMapper {
  static toDomain(raw: PrismaArtist): Artist {
    return new Artist(
      raw.id,
      raw.name,
      raw.photoURL,
      raw.likesCount,
      raw.createdAt,
      raw.updatedAt,
      raw.deletedAt,
    )
  }

  static toPrisma(artist: Artist) {
    return {
      id: artist.id,
      name: artist.name,
      photoURL: artist.photoURL,
      likesCount: artist.like,
      deletedAt: artist.deletedAt,
    }
  }
}
