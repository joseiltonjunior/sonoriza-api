import { randomUUID } from 'node:crypto'
import { Music } from '../entities/music'
import { MusicRepository } from '../repositories/music-repository'
import { CreateMusicDTO } from '../dtos/create-music.dto'
import { MusicSlugAlreadyExistsError } from '../errors/music-slug-already-exists.error'
import { ArtistRepository } from '../repositories/artist-repository'
import { GenreRepository } from '../repositories/genre-repository'
import { GenreNotFoundError } from '../errors/genre-not-found.error'
import { ArtistNotFoundError } from '../errors/artist-not-found.error'

export class CreateMusicUseCase {
  constructor(
    private musicRepository: MusicRepository,
    private artistRepository: ArtistRepository,
    private genreRepository: GenreRepository,
  ) {}

  async execute(data: CreateMusicDTO): Promise<Music> {
    const existing = await this.musicRepository.findBySlug(data.slug)

    if (existing) {
      throw new MusicSlugAlreadyExistsError(data.slug)
    }

    if (data.genreId) {
      const genre = await this.genreRepository.findById(data.genreId)

      if (!genre) {
        throw new GenreNotFoundError(data.genreId)
      }
    }

    if (data.artistIds.length > 0) {
      const uniqueArtistIds = [...new Set(data.artistIds)]

      for (const artistId of uniqueArtistIds) {
        const artist = await this.artistRepository.findById(artistId)

        if (!artist) {
          throw new ArtistNotFoundError(artistId)
        }
      }
    }

    const music = new Music(
      randomUUID(),
      data.title,
      data.slug,
      data.audioPath,
      data.album,
      data.coverPath,
      data.color,
      data.like ?? 0,
      data.view ?? 0,
      data.durationSec,
      data.releaseDate,
      data.genreId,
      null,
      data.artistIds,
    )

    await this.musicRepository.create(music)

    const persisted = await this.musicRepository.findById(music.id)
    return persisted ?? music
  }
}
