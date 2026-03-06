import { Artist } from '../entities/artist'
import { InMemoryArtistsRepository } from '../repositories/in-memory-artists.repository'
import { FetchArtistsUseCase } from './fetch-artists.use-case'

function makeArtist(index: number) {
  return new Artist(
    `artist-${index}`,
    `Artist ${index}`,
    `https://cdn.sonoriza.com/artists/${index}.jpg`,
    0,
  )
}

describe('FetchArtistsUseCase', () => {
  it('should fetch paginated artists', async () => {
    const repo = new InMemoryArtistsRepository()
    const useCase = new FetchArtistsUseCase(repo)

    for (let i = 1; i <= 25; i++) {
      await repo.create(makeArtist(i))
    }

    const toDelete = await repo.findById('artist-25')
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
    const repo = new InMemoryArtistsRepository()
    const useCase = new FetchArtistsUseCase(repo)

    for (let i = 1; i <= 25; i++) {
      await repo.create(makeArtist(i))
    }

    const toDelete = await repo.findById('artist-25')
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
