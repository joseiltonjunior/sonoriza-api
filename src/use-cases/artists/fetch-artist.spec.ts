import { describe, it, expect, beforeEach } from 'vitest'

import { InMemoryArtistsRepository } from '@/repositories/in-memory/in-memory-artists-repository'

import { FetchArtistUseCase } from './fetch-artist'
import { UserNotExistsError } from '../errors/user-not-exists'
import { randomUUID } from 'node:crypto'

let artistRepository: InMemoryArtistsRepository
let fetchArtistProfileUseCase: FetchArtistUseCase

describe('Fetch Artist Profile Use Case', () => {
  beforeEach(() => {
    artistRepository = new InMemoryArtistsRepository()
    fetchArtistProfileUseCase = new FetchArtistUseCase(artistRepository)
  })

  it('should be able to artist profile', async () => {
    const aritstResponse = await artistRepository.create({
      name: 'Ritmo',
      photoURL: 'ritmo.jpeg',
      likes: 0,
    })

    const { artist } = await fetchArtistProfileUseCase.execute({
      id: aritstResponse.id,
    })

    expect(artist.id).toEqual(expect.any(String))
    expect(artist.name).toEqual('Ritmo')
  })

  it('should not be able to get artist with wrong id', async () => {
    expect(() =>
      fetchArtistProfileUseCase.execute({
        id: randomUUID(),
      }),
    ).rejects.toBeInstanceOf(UserNotExistsError)
  })
})
