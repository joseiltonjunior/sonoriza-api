import { randomUUID } from 'node:crypto'
import { Genre } from '../entities/genre'
import { GenreNotFoundError } from '../errors/genre-not-found.error'
import { InMemoryGenresRepository } from '../repositories/in-memory-genres.repository'
import { DeleteGenreUseCase } from './delete-genre.use-case'

function makeGenre() {
  return new Genre(randomUUID(), 'Rap')
}

describe('DeleteGenreUseCase', () => {
  it('should soft delete a genre', async () => {
    const repo = new InMemoryGenresRepository()
    const useCase = new DeleteGenreUseCase(repo)

    const genre = makeGenre()
    await repo.create(genre)

    await useCase.execute(genre.id)

    const deleted = repo.items.find((item) => item.id === genre.id)

    expect(deleted).toBeTruthy()
    expect(deleted?.deletedAt).toBeInstanceOf(Date)
  })

  it('should throw when genre does not exist', async () => {
    const repo = new InMemoryGenresRepository()
    const useCase = new DeleteGenreUseCase(repo)

    await expect(useCase.execute(randomUUID())).rejects.toBeInstanceOf(
      GenreNotFoundError,
    )
  })
})
