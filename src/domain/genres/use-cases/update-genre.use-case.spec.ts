import { randomUUID } from 'node:crypto'
import { Genre } from '../entities/genre'
import { GenreNameAlreadyExistsError } from '../errors/genre-name-already-exists.error'
import { GenreNotFoundError } from '../errors/genre-not-found.error'
import { InMemoryGenresRepository } from '../repositories/in-memory-genres.repository'
import { UpdateGenreUseCase } from './update-genre.use-case'

function makeGenre(name: string) {
  return new Genre(randomUUID(), name)
}

describe('UpdateGenreUseCase', () => {
  it('should update a genre', async () => {
    const repo = new InMemoryGenresRepository()
    const useCase = new UpdateGenreUseCase(repo)

    const genre = makeGenre('Rap')
    await repo.create(genre)

    const updated = await useCase.execute(genre.id, {
      name: 'Hip Hop',
    })

    expect(updated).toEqual(
      expect.objectContaining({
        id: genre.id,
        name: 'Hip Hop',
      }),
    )
  })

  it('should throw when genre does not exist', async () => {
    const repo = new InMemoryGenresRepository()
    const useCase = new UpdateGenreUseCase(repo)

    await expect(
      useCase.execute(randomUUID(), {
        name: 'Will Fail',
      }),
    ).rejects.toBeInstanceOf(GenreNotFoundError)
  })

  it('should throw when name already exists in another genre', async () => {
    const repo = new InMemoryGenresRepository()
    const useCase = new UpdateGenreUseCase(repo)

    const rap = makeGenre('Rap')
    const funk = makeGenre('Funk')

    await repo.create(rap)
    await repo.create(funk)

    await expect(
      useCase.execute(funk.id, {
        name: 'Rap',
      }),
    ).rejects.toBeInstanceOf(GenreNameAlreadyExistsError)
  })
})
