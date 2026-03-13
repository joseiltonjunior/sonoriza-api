import { randomUUID } from 'node:crypto'
import { Artist } from '../entities/artist'
import { ArtistNotFoundError } from '../errors/artist-not-found.error'
import { InMemoryArtistsRepository } from '../repositories/in-memory-artists.repository'
import { DeleteArtistUseCase } from './delete-artist.use-case'

function makeArtist() {
  return new Artist(
    randomUUID(),
    'Djonga',
    'https://cdn.sonoriza.com/artists/djonga.jpg',
    10,
  )
}

describe('DeleteArtistUseCase', () => {
  it('should soft delete an artist', async () => {
    const repo = new InMemoryArtistsRepository()
    const useCase = new DeleteArtistUseCase(repo)

    const artist = makeArtist()
    await repo.create(artist)

    await useCase.execute(artist.id)

    const deleted = repo.items.find((item) => item.id === artist.id)

    expect(deleted).toBeTruthy()
    expect(deleted?.deletedAt).toBeInstanceOf(Date)
  })

  it('should throw when artist does not exist', async () => {
    const repo = new InMemoryArtistsRepository()
    const useCase = new DeleteArtistUseCase(repo)

    await expect(useCase.execute(randomUUID())).rejects.toBeInstanceOf(
      ArtistNotFoundError,
    )
  })
})
