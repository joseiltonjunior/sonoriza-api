import { InMemoryAccountVerificationRepository } from '../repositories/in-memory-account-verification.repository'
import { InMemoryUserRepository } from '../repositories/in-memory-user.repository'
import { AccountPendingVerificationError } from '../errors/account-pending-verification.error'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error'
import { UnauthorizedError } from '../errors/unauthorized.error'
import { AuthenticateUserUseCase } from './authenticate-user.use-case'
import { CreateUserUseCase } from './create-user.use-case'
import { IssueAccountVerificationUseCase } from './issue-account-verification.use-case'

class FakeTransactionalEmailService {
  async sendAccountVerification() {}
}

describe('AuthenticateUserUseCase', () => {
  it('should authenticate a valid user', async () => {
    const repo = new InMemoryUserRepository()
    const verificationRepo = new InMemoryAccountVerificationRepository()
    const createUser = new CreateUserUseCase(
      repo,
      new IssueAccountVerificationUseCase(
        verificationRepo,
        new FakeTransactionalEmailService(),
        10,
        60,
        5,
      ),
    )
    const authUseCase = new AuthenticateUserUseCase(repo)

    const created = await createUser.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    const user = await repo.findById(created.id)
    if (user) {
      user.markEmailVerified()
      await repo.update(user)
    }

    const result = await authUseCase.execute({
      email: 'john@example.com',
      password: '123456',
    })

    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: 'john@example.com',
        accountStatus: 'ACTIVE',
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

  it('should throw unauthorized when user is suspended', async () => {
    const repo = new InMemoryUserRepository()
    const verificationRepo = new InMemoryAccountVerificationRepository()
    const createUser = new CreateUserUseCase(
      repo,
      new IssueAccountVerificationUseCase(
        verificationRepo,
        new FakeTransactionalEmailService(),
        10,
        60,
        5,
      ),
    )
    const authUseCase = new AuthenticateUserUseCase(repo)

    const created = await createUser.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    const user = await repo.findById(created.id)
    if (user) {
      user.markEmailVerified()
      user.setAccountStatus('SUSPENDED')
      await repo.update(user)
    }

    await expect(
      authUseCase.execute({
        email: 'john@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('should block login when account is pending verification', async () => {
    const repo = new InMemoryUserRepository()
    const verificationRepo = new InMemoryAccountVerificationRepository()
    const createUser = new CreateUserUseCase(
      repo,
      new IssueAccountVerificationUseCase(
        verificationRepo,
        new FakeTransactionalEmailService(),
        10,
        60,
        5,
      ),
    )
    const authUseCase = new AuthenticateUserUseCase(repo)

    await createUser.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    await expect(
      authUseCase.execute({
        email: 'john@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AccountPendingVerificationError)
  })
})
