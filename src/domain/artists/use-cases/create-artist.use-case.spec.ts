import { CreateArtistUseCase } from './create-artist.use-case'
import { InMemoryArtistsRepository } from '../repositories/in-memory-artists.repository'
import { InMemoryGenresRepository } from '@/domain/genres/repositories/in-memory-genres.repository'
import { Genre } from '@/domain/genres/entities/genre'
import { GenreNotFoundError } from '@/domain/genres/errors/genre-not-found.error'
import { randomUUID } from 'node:crypto'

describe('CreateArtistUseCase', () => {
  it('should create a new artist with default like', async () => {
    const repo = new InMemoryArtistsRepository()
    const genresRepo = new InMemoryGenresRepository()
    const genreId = randomUUID()

    await genresRepo.create(new Genre(genreId, 'Forro'))

    const useCase = new CreateArtistUseCase(repo, genresRepo)

    const result = await useCase.execute({
      name: 'Djonga',
      photoURL: 'https://cdn.sonoriza.com/artists/djonga.jpg',
      genreIds: [genreId],
    })

    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Djonga',
        photoURL: 'https://cdn.sonoriza.com/artists/djonga.jpg',
        like: 0,
        genreIds: [genreId],
      }),
    )

    expect(repo.items.length).toBe(1)
  })

  it('should throw when one of genreIds does not exist', async () => {
    const repo = new InMemoryArtistsRepository()
    const genresRepo = new InMemoryGenresRepository()
    const useCase = new CreateArtistUseCase(repo, genresRepo)

    await expect(
      useCase.execute({
        name: 'Djonga',
        photoURL: 'https://cdn.sonoriza.com/artists/djonga.jpg',
        genreIds: [randomUUID()],
      }),
    ).rejects.toBeInstanceOf(GenreNotFoundError)
  })
})
