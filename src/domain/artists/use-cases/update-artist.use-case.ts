import { UpdateArtistDTO } from '../dtos/update-artist.dto'
import { ArtistNotFoundError } from '../errors/artist-not-found.error'
import { ArtistsRepository } from '../repositories/artists-repository'
import { GenresRepository } from '@/domain/genres/repositories/genres-repository'
import { GenreNotFoundError } from '@/domain/genres/errors/genre-not-found.error'

export class UpdateArtistUseCase {
  constructor(
    private artistsRepository: ArtistsRepository,
    private genresRepository: GenresRepository,
  ) {}

  async execute(id: string, data: UpdateArtistDTO) {
    const artist = await this.artistsRepository.findById(id)

    if (!artist) {
      throw new ArtistNotFoundError()
    }

    if (data.genreIds !== undefined) {
      const genreIds = [...new Set(data.genreIds)]

      for (const genreId of genreIds) {
        const genre = await this.genresRepository.findById(genreId)

        if (!genre) {
          throw new GenreNotFoundError()
        }
      }

      data.genreIds = genreIds
    }

    artist.update(data)

    await this.artistsRepository.update(artist)

    const persisted = await this.artistsRepository.findById(id)

    return persisted ?? artist
  }
}
