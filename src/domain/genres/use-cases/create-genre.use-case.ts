import { randomUUID } from 'node:crypto'
import { CreateGenreDTO } from '../dtos/create-genre.dto'
import { Genre } from '../entities/genre'
import { GenreNameAlreadyExistsError } from '../errors/genre-name-already-exists.error'
import { GenresRepository } from '../repositories/genres-repository'

export class CreateGenreUseCase {
  constructor(private genresRepository: GenresRepository) {}

  async execute(data: CreateGenreDTO): Promise<Genre> {
    const existing = await this.genresRepository.findByName(data.name)

    if (existing) {
      throw new GenreNameAlreadyExistsError(data.name)
    }

    const genre = new Genre(randomUUID(), data.name)

    await this.genresRepository.create(genre)

    const persisted = await this.genresRepository.findById(genre.id)

    return persisted ?? genre
  }
}
