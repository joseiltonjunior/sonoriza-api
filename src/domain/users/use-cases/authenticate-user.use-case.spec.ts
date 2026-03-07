import { AuthenticateUserUseCase } from './authenticate-user.use-case'
import { CreateUserUseCase } from './create-user.use-case'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error'
import { InMemoryUserRepository } from '../repositories/in-memory-user.repository'
import { UnauthorizedError } from '../errors/unauthorized.error'

describe('AuthenticateUserUseCase', () => {
  it('should authenticate a valid user', async () => {
    const repo = new InMemoryUserRepository()
    const createUser = new CreateUserUseCase(repo)
    const authUseCase = new AuthenticateUserUseCase(repo)

    await createUser.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    const result = await authUseCase.execute({
      email: 'john@example.com',
      password: '123456',
    })

    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: 'john@example.com',
      }),
    )
  })

  it('should throw when credentials are invalid', async () => {
    const repo = new InMemoryUserRepository()
    const authUseCase = new AuthenticateUserUseCase(repo)

    await expect(
      authUseCase.execute({
        email: 'notfound@example.com',
        password: 'anything',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should throw unauthorized when user is inactive', async () => {
    const repo = new InMemoryUserRepository()
    const createUser = new CreateUserUseCase(repo)
    const authUseCase = new AuthenticateUserUseCase(repo)

    const created = await createUser.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    const user = await repo.findById(created.id)
    if (user) {
      user.softDelete()
      await repo.update(user)
    }

    await expect(
      authUseCase.execute({
        email: 'john@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
