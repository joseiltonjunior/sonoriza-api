import { Artist } from '@/domain/artists/entities/artist'
import { Artist as PrismaArtist, Music as PrismaMusic } from '@prisma/client'

interface PrismaGenreRef {
  id: string
  name: string
}

interface PrismaArtistGenreJoin {
  genreId: string
  genre: PrismaGenreRef
}

interface PrismaArtistMusicJoin {
  music: PrismaMusic
}

export interface PrismaArtistWithRelations extends PrismaArtist {
  musicalGenres?: PrismaArtistGenreJoin[]
  musics?: PrismaArtistMusicJoin[]
}

export class PrismaArtistMapper {
  static toDomain(raw: PrismaArtistWithRelations): Artist {
    const musicalGenres = (raw.musicalGenres ?? []).map((item) => ({
      id: item.genre.id,
      name: item.genre.name,
    }))

    const musics = (raw.musics ?? [])
      .map((item) => item.music)
      .filter((music) => music.deletedAt === null)
      .map((music) => ({
        id: music.id,
        title: music.title,
        slug: music.slug,
        audioPath: music.audioPath,
        coverPath: music.coverPath,
      }))

    return new Artist(
      raw.id,
      raw.name,
      raw.photoURL,
      raw.likesCount,
      (raw.musicalGenres ?? []).map((item) => item.genreId),
      musicalGenres,
      musics,
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
