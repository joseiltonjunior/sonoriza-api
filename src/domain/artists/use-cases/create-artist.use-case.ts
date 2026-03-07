import { randomUUID } from 'node:crypto'
import { CreateArtistDTO } from '../dtos/create-artist.dto'
import { Artist } from '../entities/artist'
import { ArtistsRepository } from '../repositories/artists-repository'
import { GenresRepository } from '@/domain/genres/repositories/genres-repository'
import { GenreNotFoundError } from '@/domain/genres/errors/genre-not-found.error'

export class CreateArtistUseCase {
  constructor(
    private artistsRepository: ArtistsRepository,
    private genresRepository: GenresRepository,
  ) {}

  async execute(data: CreateArtistDTO): Promise<Artist> {
    const genreIds = [...new Set(data.genreIds ?? [])]

    for (const genreId of genreIds) {
      const genre = await this.genresRepository.findById(genreId)

      if (!genre) {
        throw new GenreNotFoundError()
      }
    }

    const artist = new Artist(
      randomUUID(),
      data.name,
      data.photoURL,
      0,
      genreIds,
    )

    await this.artistsRepository.create(artist)

    const persisted = await this.artistsRepository.findById(artist.id)

    return persisted ?? artist
  }
}
