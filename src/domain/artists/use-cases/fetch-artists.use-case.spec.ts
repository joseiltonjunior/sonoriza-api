import { Artist } from '../entities/artist'
import { InMemoryArtistsRepository } from '../repositories/in-memory-artists.repository'
import { FetchArtistsUseCase } from './fetch-artists.use-case'

function makeArtist(index: number, name?: string, genreIds: string[] = []) {
  return new Artist(
    `artist-${index}`,
    name ?? `Artist ${index}`,
    `https://cdn.sonoriza.com/artists/${index}.jpg`,
    0,
    genreIds,
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

  it('should filter artists by name when provided', async () => {
    const repo = new InMemoryArtistsRepository()
    const useCase = new FetchArtistsUseCase(repo)

    await repo.create(makeArtist(1, 'Natanzinho'))
    await repo.create(makeArtist(2, 'Nathan'))
    await repo.create(makeArtist(3, 'Joao'))

    const result = await useCase.execute({ page: 1, name: 'nat' })

    expect(result.data).toHaveLength(2)
    expect(result.data.map((artist) => artist.name)).toEqual([
      'Natanzinho',
      'Nathan',
    ])
    expect(result.meta).toEqual({
      total: 2,
      page: 1,
      lastPage: 1,
    })
  })

  it('should filter artists by genre id when provided', async () => {
    const repo = new InMemoryArtistsRepository()
    const useCase = new FetchArtistsUseCase(repo)

    await repo.create(makeArtist(1, 'Artist 1', ['genre-a']))
    await repo.create(makeArtist(2, 'Artist 2', ['genre-b']))
    await repo.create(makeArtist(3, 'Artist 3', ['genre-a', 'genre-b']))

    const result = await useCase.execute({ page: 1, genreId: 'genre-a' })

    expect(result.data).toHaveLength(2)
    expect(result.data.map((artist) => artist.id)).toEqual([
      'artist-1',
      'artist-3',
    ])
    expect(result.meta).toEqual({
      total: 2,
      page: 1,
      lastPage: 1,
    })
  })
})
