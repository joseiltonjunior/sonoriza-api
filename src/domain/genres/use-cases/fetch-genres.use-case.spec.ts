import { Genre } from '../entities/genre'
import { InMemoryGenresRepository } from '../repositories/in-memory-genres.repository'
import { FetchGenresUseCase } from './fetch-genres.use-case'

function makeGenre(index: number) {
  return new Genre(`genre-${index}`, `Genre ${index}`)
}

describe('FetchGenresUseCase', () => {
  it('should fetch paginated genres', async () => {
    const repo = new InMemoryGenresRepository()
    const useCase = new FetchGenresUseCase(repo)

    for (let i = 1; i <= 25; i++) {
      await repo.create(makeGenre(i))
    }

    const toDelete = await repo.findById('genre-25')
    if (toDelete) {
      toDelete.softDelete()
      await repo.update(toDelete)
    }

    const result = await useCase.execute({ page: 1 })

    expect(result.data).toHaveLength(20)
    expect(result.meta).toEqual({
      total: 24,
      page: 1,
      lastPage: 2,
    })
  })

  it('should fetch second page with remaining items', async () => {
    const repo = new InMemoryGenresRepository()
    const useCase = new FetchGenresUseCase(repo)

    for (let i = 1; i <= 25; i++) {
      await repo.create(makeGenre(i))
    }

    const toDelete = await repo.findById('genre-25')
    if (toDelete) {
      toDelete.softDelete()
      await repo.update(toDelete)
    }

    const result = await useCase.execute({ page: 2 })

    expect(result.data).toHaveLength(4)
    expect(result.meta).toEqual({
      total: 24,
      page: 2,
      lastPage: 2,
    })
  })
})
