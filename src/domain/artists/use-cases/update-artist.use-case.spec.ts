import { randomUUID } from 'node:crypto'
import { Artist } from '../entities/artist'
import { ArtistNotFoundError } from '../errors/artist-not-found.error'
import { InMemoryArtistsRepository } from '../repositories/in-memory-artists.repository'
import { UpdateArtistUseCase } from './update-artist.use-case'

function makeArtist() {
  return new Artist(
    randomUUID(),
    'Djonga',
    'https://cdn.sonoriza.com/artists/djonga.jpg',
    10,
  )
}

describe('UpdateArtistUseCase', () => {
  it('should update an artist', async () => {
    const repo = new InMemoryArtistsRepository()
    const useCase = new UpdateArtistUseCase(repo)

    const artist = makeArtist()
    await repo.create(artist)

    const updated = await useCase.execute(artist.id, {
      name: 'BK',
      photoURL: 'https://cdn.sonoriza.com/artists/bk.jpg',
      like: 25,
    })

    expect(updated).toEqual(
      expect.objectContaining({
        id: artist.id,
        name: 'BK',
        photoURL: 'https://cdn.sonoriza.com/artists/bk.jpg',
        like: 25,
      }),
    )
  })

  it('should throw when artist does not exist', async () => {
    const repo = new InMemoryArtistsRepository()
    const useCase = new UpdateArtistUseCase(repo)

    await expect(
      useCase.execute(randomUUID(), {
        name: 'Will Fail',
      }),
    ).rejects.toBeInstanceOf(ArtistNotFoundError)
  })
})
