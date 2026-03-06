import { CreateGenreUseCase } from './create-genre.use-case'
import { GenreNameAlreadyExistsError } from '../errors/genre-name-already-exists.error'
import { InMemoryGenresRepository } from '../repositories/in-memory-genres.repository'

describe('CreateGenreUseCase', () => {
  it('should create a new genre', async () => {
    const repo = new InMemoryGenresRepository()
    const useCase = new CreateGenreUseCase(repo)

    const result = await useCase.execute({
      name: 'Rap',
    })

    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Rap',
      }),
    )

    expect(repo.items.length).toBe(1)
  })

  it('should not allow creating a genre with duplicated name', async () => {
    const repo = new InMemoryGenresRepository()
    const useCase = new CreateGenreUseCase(repo)

    await useCase.execute({
      name: 'Rap',
    })

    await expect(
      useCase.execute({
        name: 'Rap',
      }),
    ).rejects.toBeInstanceOf(GenreNameAlreadyExistsError)
  })
})
