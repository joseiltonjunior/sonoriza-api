import { UpdateGenreDTO } from '../dtos/update-genre.dto'
import { GenreNameAlreadyExistsError } from '../errors/genre-name-already-exists.error'
import { GenreNotFoundError } from '../errors/genre-not-found.error'
import { GenresRepository } from '../repositories/genres-repository'

export class UpdateGenreUseCase {
  constructor(private genresRepository: GenresRepository) {}

  async execute(id: string, data: UpdateGenreDTO) {
    const genre = await this.genresRepository.findById(id)

    if (!genre) {
      throw new GenreNotFoundError()
    }

    if (data.name && data.name !== genre.name) {
      const existing = await this.genresRepository.findByName(data.name)

      if (existing && existing.id !== id) {
        throw new GenreNameAlreadyExistsError(data.name)
      }
    }

    genre.update(data)

    await this.genresRepository.update(genre)

    const persisted = await this.genresRepository.findById(id)

    return persisted ?? genre
  }
}
