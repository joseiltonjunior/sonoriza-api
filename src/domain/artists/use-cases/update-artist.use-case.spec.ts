import { randomUUID } from 'node:crypto'
import { Artist } from '../entities/artist'
import { ArtistNotFoundError } from '../errors/artist-not-found.error'
import { InMemoryArtistsRepository } from '../repositories/in-memory-artists.repository'
import { UpdateArtistUseCase } from './update-artist.use-case'
import { InMemoryGenresRepository } from '@/domain/genres/repositories/in-memory-genres.repository'
import { Genre } from '@/domain/genres/entities/genre'
import { GenreNotFoundError } from '@/domain/genres/errors/genre-not-found.error'

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
    const genresRepo = new InMemoryGenresRepository()
    const useCase = new UpdateArtistUseCase(repo, genresRepo)

    const genreId = randomUUID()
    await genresRepo.create(new Genre(genreId, 'Rap'))

    const artist = makeArtist()
    await repo.create(artist)

    const updated = await useCase.execute(artist.id, {
      name: 'BK',
      photoURL: 'https://cdn.sonoriza.com/artists/bk.jpg',
      genreIds: [genreId],
    })

    expect(updated).toEqual(
      expect.objectContaining({
        id: artist.id,
        name: 'BK',
        photoURL: 'https://cdn.sonoriza.com/artists/bk.jpg',
        like: 10,
        genreIds: [genreId],
      }),
    )
  })

  it('should throw when artist does not exist', async () => {
    const repo = new InMemoryArtistsRepository()
    const genresRepo = new InMemoryGenresRepository()
    const useCase = new UpdateArtistUseCase(repo, genresRepo)

    await expect(
      useCase.execute(randomUUID(), {
        name: 'Will Fail',
      }),
    ).rejects.toBeInstanceOf(ArtistNotFoundError)
  })

  it('should throw when one of genreIds does not exist', async () => {
    const repo = new InMemoryArtistsRepository()
    const genresRepo = new InMemoryGenresRepository()
    const useCase = new UpdateArtistUseCase(repo, genresRepo)

    const artist = makeArtist()
    await repo.create(artist)

    await expect(
      useCase.execute(artist.id, {
        genreIds: [randomUUID()],
      }),
    ).rejects.toBeInstanceOf(GenreNotFoundError)
  })
})
