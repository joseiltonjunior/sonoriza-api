import { UserAlreadyExistsError } from '../errors/user-already-exists.error'
import { UserNotFoundError } from '../errors/user-not-found.error'
import { InMemoryAccountVerificationRepository } from '../repositories/in-memory-account-verification.repository'
import { InMemoryUserRepository } from '../repositories/in-memory-user.repository'
import { CreateUserUseCase } from './create-user.use-case'
import { IssueAccountVerificationUseCase } from './issue-account-verification.use-case'
import { UpdateUserUseCase } from './update-user.use-case'

class FakeTransactionalEmailService {
  async sendAccountVerification() {}
}

describe('UpdateUserUseCase', () => {
  it('should update user profile', async () => {
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
    const useCase = new UpdateUserUseCase(repo)

    const created = await createUser.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    const result = await useCase.execute(created.id, {
      name: 'John Updated',
      email: 'john.updated@example.com',
      photoUrl: 'https://cdn.example.com/john.jpg',
    })

    expect(result).toEqual(
      expect.objectContaining({
        id: created.id,
        name: 'John Updated',
        email: 'john.updated@example.com',
        photoUrl: 'https://cdn.example.com/john.jpg',
      }),
    )
  })

  it('should throw when user does not exist', async () => {
    const repo = new InMemoryUserRepository()
    const useCase = new UpdateUserUseCase(repo)

    await expect(
      useCase.execute('missing-id', {
        name: 'Will Fail',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should throw when email already exists for another user', async () => {
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
    const useCase = new UpdateUserUseCase(repo)

    const first = await createUser.execute({
      name: 'First',
      email: 'first@example.com',
      password: '123456',
    })

    await createUser.execute({
      name: 'Second',
      email: 'second@example.com',
      password: '123456',
    })

    await expect(
      useCase.execute(first.id, {
        email: 'second@example.com',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
