import { Artist } from '../entities/artist'
import { ArtistNotFoundError } from '../errors/artist-not-found.error'
import { InMemoryArtistsRepository } from '../repositories/in-memory-artists.repository'
import { GetArtistByIdUseCase } from './get-artist-by-id.use-case'

function makeArtist() {
  return new Artist(
    'artist-1',
    'Artist 1',
    'https://cdn.sonoriza.com/artists/1.jpg',
    0,
  )
}

describe('GetArtistByIdUseCase', () => {
  it('should return an artist by id', async () => {
    const repo = new InMemoryArtistsRepository()
    const useCase = new GetArtistByIdUseCase(repo)

    await repo.create(makeArtist())

    const result = await useCase.execute('artist-1')

    expect(result).toEqual(
      expect.objectContaining({
        id: 'artist-1',
        name: 'Artist 1',
      }),
    )
  })

  it('should throw when artist does not exist', async () => {
    const repo = new InMemoryArtistsRepository()
    const useCase = new GetArtistByIdUseCase(repo)

    await expect(useCase.execute('missing-id')).rejects.toBeInstanceOf(
      ArtistNotFoundError,
    )
  })
})
