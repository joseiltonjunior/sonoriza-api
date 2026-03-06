import { GenreNotFoundError } from '../errors/genre-not-found.error'
import { GenresRepository } from '../repositories/genres-repository'

export class DeleteGenreUseCase {
  constructor(private genresRepository: GenresRepository) {}

  async execute(id: string) {
    const genre = await this.genresRepository.findById(id)

    if (!genre) {
      throw new GenreNotFoundError()
    }

    genre.softDelete()

    await this.genresRepository.update(genre)
  }
}
