import { InMemoryAccountVerificationRepository } from '../repositories/in-memory-account-verification.repository'
import { InMemoryUserRepository } from '../repositories/in-memory-user.repository'
import { UserNotFoundError } from '../errors/user-not-found.error'
import { CreateUserUseCase } from './create-user.use-case'
import { IssueAccountVerificationUseCase } from './issue-account-verification.use-case'
import { SoftDeleteUserUseCase } from './soft-delete-user.use-case'

class FakeTransactionalEmailService {
  async sendAccountVerification() {}
}

describe('SoftDeleteUserUseCase', () => {
  it('should soft delete a user', async () => {
    const repo = new InMemoryUserRepository()
    const createUser = new CreateUserUseCase(
      repo,
      new IssueAccountVerificationUseCase(
        new InMemoryAccountVerificationRepository(),
        new FakeTransactionalEmailService(),
        10,
        60,
        5,
      ),
    )
    const useCase = new SoftDeleteUserUseCase(repo)

    const created = await createUser.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    await useCase.execute(created.id)

    const deleted = await repo.findById(created.id)

    expect(deleted).toBeTruthy()
    expect(deleted?.accountStatus).toBe('SUSPENDED')
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
