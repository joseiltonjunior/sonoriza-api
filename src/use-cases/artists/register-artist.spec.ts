import { RegisterArtistUseCase } from './register-artist'
import { describe, it, expect, beforeEach } from 'vitest'

import { InMemoryArtistsRepository } from '@/repositories/in-memory/in-memory-artists-repository'

let artistRepository: InMemoryArtistsRepository
let registerArtistUseCase: RegisterArtistUseCase

describe('Artist Register Use Case', () => {
  beforeEach(() => {
    artistRepository = new InMemoryArtistsRepository()
    registerArtistUseCase = new RegisterArtistUseCase(artistRepository)
  })

  it('should be able to register', async () => {
    const { artist } = await registerArtistUseCase.execute({
      name: 'Ritmo',
      photoURL: 'ritmo.jpeg',
    })

    expect(artist.id).toEqual(expect.any(String))
  })
})
