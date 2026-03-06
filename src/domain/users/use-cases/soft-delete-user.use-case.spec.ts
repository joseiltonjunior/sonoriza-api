import { InMemoryUserRepository } from '../repositories/in-memory-user.repository'
import { CreateUserUseCase } from './create-user.use-case'
import { SoftDeleteUserUseCase } from './soft-delete-user.use-case'
import { UserNotFoundError } from '../errors/user-not-found.error'

describe('SoftDeleteUserUseCase', () => {
  it('should soft delete a user', async () => {
    const repo = new InMemoryUserRepository()
    const createUser = new CreateUserUseCase(repo)
    const useCase = new SoftDeleteUserUseCase(repo)

    const created = await createUser.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    await useCase.execute(created.id)

    const deleted = await repo.findById(created.id)

    expect(deleted).toBeTruthy()
    expect(deleted?.isActive).toBe(false)
    expect(deleted?.deletedAt).toBeInstanceOf(Date)
  })

  it('should throw when user does not exist', async () => {
    const repo = new InMemoryUserRepository()
    const useCase = new SoftDeleteUserUseCase(repo)

    await expect(useCase.execute('missing-id')).rejects.toBeInstanceOf(
      UserNotFoundError,
    )
  })
})
