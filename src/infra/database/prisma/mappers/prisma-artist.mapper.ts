import { Artist } from '@/domain/artists/entities/artist'
import { Artist as PrismaArtist } from '@prisma/client'

interface PrismaGenreRef {
  id: string
  name: string
}

interface PrismaArtistGenreJoin {
  genreId: string
  genre: PrismaGenreRef
}

export interface PrismaArtistWithRelations extends PrismaArtist {
  musicalGenres?: PrismaArtistGenreJoin[]
}

export class PrismaArtistMapper {
  static toDomain(raw: PrismaArtistWithRelations): Artist {
    const musicalGenres = (raw.musicalGenres ?? []).map((item) => ({
      id: item.genre.id,
      name: item.genre.name,
    }))

    return new Artist(
      raw.id,
      raw.name,
      raw.photoURL,
      raw.likesCount,
      (raw.musicalGenres ?? []).map((item) => item.genreId),
      musicalGenres,
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
