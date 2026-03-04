import { Music, MusicArtist } from '@/domain/musics/entities/music'

interface PrismaGenreRef {
  id: string
  name: string
}

interface PrismaMusicArtistGenre {
  genre: PrismaGenreRef
}

interface PrismaMusicArtistLink {
  musicId: string
}

interface PrismaArtistWithRelations {
  id: string
  name: string
  photoURL: string
  like: number
  musics: PrismaMusicArtistLink[]
  musicalGenres: PrismaMusicArtistGenre[]
}

interface PrismaMusicArtistJoin {
  artist: PrismaArtistWithRelations
}

export interface PrismaMusicWithRelations {
  id: string
  title: string
  slug: string
  audioPath: string
  album: string | null
  coverPath: string | null
  color: string | null
  like: number
  view: number
  durationSec: number | null
  releaseDate: Date | null
  genreId: string | null
  genre?: PrismaGenreRef | null
  artists?: PrismaMusicArtistJoin[]
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export class PrismaMusicMapper {
  static toDomain(raw: PrismaMusicWithRelations): Music {
    const artists: MusicArtist[] = (raw.artists ?? [])
      .filter((entry) => Boolean(entry.artist))
      .map((entry) => ({
        id: entry.artist.id,
        name: entry.artist.name,
        photoURL: entry.artist.photoURL,
        like: entry.artist.like,
        musics: (entry.artist.musics ?? []).map((music) => music.musicId),
        musicalGenres: (entry.artist.musicalGenres ?? []).map((item) => ({
          id: item.genre.id,
          name: item.genre.name,
        })),
      }))

    return new Music(
      raw.id,
      raw.title,
      raw.slug,
      raw.audioPath,
      raw.album,
      raw.coverPath,
      raw.color,
      raw.like,
      raw.view,
      raw.durationSec,
      raw.releaseDate,
      raw.genreId,
      raw.genre?.name ?? null,
      artists.map((artist) => artist.id),
      artists,
      raw.createdAt,
      raw.updatedAt,
      raw.deletedAt,
    )
  }

  static toPrisma(music: Music) {
    return {
      id: music.id,
      title: music.title,
      slug: music.slug,
      album: music.album,
      coverPath: music.coverPath,
      audioPath: music.audioPath,
      color: music.color,
      like: music.like,
      view: music.view,
      durationSec: music.durationSec,
      releaseDate: music.releaseDate,
      genreId: music.genreId,
      deletedAt: music.deletedAt,
    }
  }
}
