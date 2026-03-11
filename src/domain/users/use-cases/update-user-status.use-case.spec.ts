import { UserNotFoundError } from '../errors/user-not-found.error'
import { InMemoryUserRepository } from '../repositories/in-memory-user.repository'
import { CreateUserUseCase } from './create-user.use-case'
import { UpdateUserStatusUseCase } from './update-user-status.use-case'

describe('UpdateUserStatusUseCase', () => {
  it('should update user active status', async () => {
    const repo = new InMemoryUserRepository()
    const createUser = new CreateUserUseCase(repo)
    const useCase = new UpdateUserStatusUseCase(repo)

    const created = await createUser.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    const result = await useCase.execute(created.id, {
      isActive: false,
    })

    expect(result).toEqual(
      expect.objectContaining({
        id: created.id,
        isActive: false,
      }),
    )
  })

  it('should throw when user does not exist', async () => {
    const repo = new InMemoryUserRepository()
    const useCase = new UpdateUserStatusUseCase(repo)

    await expect(
      useCase.execute('missing-id', {
        isActive: true,
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should throw when user is soft deleted', async () => {
    const repo = new InMemoryUserRepository()
    const createUser = new CreateUserUseCase(repo)
    const useCase = new UpdateUserStatusUseCase(repo)

    const created = await createUser.execute({
      name: 'John Doe',
      email: 'john2@example.com',
      password: '123456',
    })

    const user = await repo.findById(created.id)
    user?.softDelete()
    if (user) {
      await repo.update(user)
    }

    await expect(
      useCase.execute(created.id, {
        isActive: true,
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
