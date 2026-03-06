import { InMemoryUserRepository } from '../repositories/in-memory-user.repository'
import { CreateUserUseCase } from './create-user.use-case'
import { GetUserProfileUseCase } from './get-user-profile.use-case'
import { UserNotFoundError } from '../errors/user-not-found.error'

describe('GetUserProfileUseCase', () => {
  it('should return authenticated user profile', async () => {
    const repo = new InMemoryUserRepository()
    const createUser = new CreateUserUseCase(repo)
    const useCase = new GetUserProfileUseCase(repo)

    const created = await createUser.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    const profile = await useCase.execute(created.id)

    expect(profile).toEqual(
      expect.objectContaining({
        id: created.id,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'USER',
        photoUrl: null,
      }),
    )
  })

  it('should throw when user does not exist', async () => {
    const repo = new InMemoryUserRepository()
    const useCase = new GetUserProfileUseCase(repo)

    await expect(useCase.execute('missing-id')).rejects.toBeInstanceOf(
      UserNotFoundError,
    )
  })
})
