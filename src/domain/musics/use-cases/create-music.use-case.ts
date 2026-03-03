import { randomUUID } from 'node:crypto'
import { Music } from '../entities/music'
import { MusicRepository } from '../repositories/music-repository'
import { CreateMusicDTO } from '../dtos/create-music.dto'
import { MusicSlugAlreadyExistsError } from '../errors/music-slug-already-exists.error'

export class CreateMusicUseCase {
  constructor(private musicRepository: MusicRepository) {}

  async execute(data: CreateMusicDTO): Promise<Music> {
    const existing = await this.musicRepository.findBySlug(data.slug)

    if (existing) {
      throw new MusicSlugAlreadyExistsError(data.slug)
    }

    const music = new Music(
      randomUUID(),
      data.title,
      data.slug,
      data.audioPath,
      data.album,
      data.coverPath,
      data.color,
      data.durationSec,
      data.releaseDate,
      data.genreId,
    )

    await this.musicRepository.create(music)
    return music
  }
}
