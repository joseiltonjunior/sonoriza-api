import { EditArtistUseCase } from './edit-artist'
import { describe, it, expect, beforeEach } from 'vitest'

import { InMemoryArtistsRepository } from '@/repositories/in-memory/in-memory-artists-repository'

let artistRepository: InMemoryArtistsRepository
let editArtistUseCase: EditArtistUseCase

describe('Edit Artist Use Case', () => {
  beforeEach(() => {
    artistRepository = new InMemoryArtistsRepository()
    editArtistUseCase = new EditArtistUseCase(artistRepository)
  })

  it('should be able to edit to artist', async () => {
    const newArtist = await artistRepository.create({
      name: 'Junior Ferreira',
      photoURL: 'junior.jpeg',
      likes: 0,
    })

    const { artist } = await editArtistUseCase.execute({
      ...newArtist,
      name: 'Junior',
    })

    expect(artist.id).toEqual(expect.any(String))
    expect(artist.name).toEqual('Junior')
  })
})
