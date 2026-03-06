import { CreateUserUseCase } from './create-user.use-case'
import { UserAlreadyExistsError } from '../errors/user-already-exists.error'
import { InMemoryUserRepository } from '../repositories/in-memory-user.repository'

describe('CreateUserUseCase', () => {
  it('should create a new user', async () => {
    const repo = new InMemoryUserRepository()
    const useCase = new CreateUserUseCase(repo)

    const result = await useCase.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'John Doe',
        email: 'john@example.com',
      }),
    )

    expect(repo.items.length).toBe(1)
  })

  it('should not allow creating a user with duplicated email', async () => {
    const repo = new InMemoryUserRepository()
    const useCase = new CreateUserUseCase(repo)

    await useCase.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    await expect(
      useCase.execute({
        name: 'Another',
        email: 'john@example.com',
        password: 'abcdef',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
