import { CreateArtistUseCase } from './create-artist.use-case'
import { InMemoryArtistsRepository } from '../repositories/in-memory-artists.repository'

describe('CreateArtistUseCase', () => {
  it('should create a new artist', async () => {
    const repo = new InMemoryArtistsRepository()
    const useCase = new CreateArtistUseCase(repo)

    const result = await useCase.execute({
      name: 'Djonga',
      photoURL: 'https://cdn.sonoriza.com/artists/djonga.jpg',
      like: 10,
    })

    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Djonga',
        photoURL: 'https://cdn.sonoriza.com/artists/djonga.jpg',
        like: 10,
      }),
    )

    expect(repo.items.length).toBe(1)
  })

  it('should default like to 0 when not provided', async () => {
    const repo = new InMemoryArtistsRepository()
    const useCase = new CreateArtistUseCase(repo)

    const result = await useCase.execute({
      name: 'BK',
      photoURL: 'https://cdn.sonoriza.com/artists/bk.jpg',
      like: null,
    })

    expect(result.like).toBe(0)
  })
})
