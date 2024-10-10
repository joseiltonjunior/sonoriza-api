import { describe, it, expect, beforeEach } from 'vitest'

import { InMemoryArtistsRepository } from '@/repositories/in-memory/in-memory-artists-repository'

import { FetchManyArtistsUseCase } from './fetch-many-artists'

let artistsRepository: InMemoryArtistsRepository
let fetchManyArtistProfileUseCase: FetchManyArtistsUseCase

describe('Fetch Many artists Use Case', () => {
  beforeEach(() => {
    artistsRepository = new InMemoryArtistsRepository()
    fetchManyArtistProfileUseCase = new FetchManyArtistsUseCase(
      artistsRepository,
    )
  })

  it('should be able to get a artist list paginated', async () => {
    await artistsRepository.create({
      name: 'Pettra',
      photoURL: 'pettra.jpeg',
      likes: 0,
    })

    await artistsRepository.create({
      name: 'Vegas',
      photoURL: 'vegas.jpeg',
      likes: 0,
    })

    await artistsRepository.create({
      name: 'Ritmo',
      photoURL: 'ritmo.jpeg',
      likes: 0,
    })

    const { artists } = await fetchManyArtistProfileUseCase.execute({ page: 1 })

    expect(artists).toHaveLength(3)
    expect(artists).toEqual([
      expect.objectContaining({ name: 'Pettra' }),
      expect.objectContaining({ name: 'Vegas' }),
      expect.objectContaining({ name: 'Ritmo' }),
    ])
  })
})
