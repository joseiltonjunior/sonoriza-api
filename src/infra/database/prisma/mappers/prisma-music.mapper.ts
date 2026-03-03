import { Music } from '@/domain/musics/entities/music'
import { Music as PrismaMusic } from '@prisma/client'

export class PrismaMusicMapper {
  static toDomain(raw: PrismaMusic): Music {
    return new Music(
      raw.id,
      raw.title,
      raw.slug,
      raw.audioPath,
      raw.album,
      raw.coverPath,
      raw.color,
      raw.durationSec,
      raw.releaseDate,
      raw.genreId,
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
      durationSec: music.durationSec,
      releaseDate: music.releaseDate,
      genreId: music.genreId,
      deletedAt: music.deletedAt,
    }
  }
}
