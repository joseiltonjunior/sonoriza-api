import { InMemoryAccountVerificationRepository } from '../repositories/in-memory-account-verification.repository'
import { InMemoryUserRepository } from '../repositories/in-memory-user.repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists.error'
import { CreateUserUseCase } from './create-user.use-case'
import { IssueAccountVerificationUseCase } from './issue-account-verification.use-case'

class FakeTransactionalEmailService {
  public sent: Array<{
    to: string
    name: string
    code: string
    expiresInMinutes: number
  }> = []

  async sendAccountVerification(input: {
    to: string
    name: string
    code: string
    expiresInMinutes: number
  }) {
    this.sent.push(input)
  }
}

describe('CreateUserUseCase', () => {
  it('should create a new user as pending verification and send email', async () => {
    const repo = new InMemoryUserRepository()
    const verificationRepo = new InMemoryAccountVerificationRepository()
    const emailService = new FakeTransactionalEmailService()
    const issueAccountVerificationUseCase = new IssueAccountVerificationUseCase(
      verificationRepo,
      emailService,
      10,
      60,
      5,
    )
    const useCase = new CreateUserUseCase(repo, issueAccountVerificationUseCase)

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
        accountStatus: 'PENDING_VERIFICATION',
      }),
    )

    expect(repo.items.length).toBe(1)
    expect(repo.items[0].accountStatus).toBe('PENDING_VERIFICATION')
    expect(verificationRepo.items).toHaveLength(1)
    expect(emailService.sent).toHaveLength(1)
    expect(emailService.sent[0].to).toBe('john@example.com')
  })

  it('should not allow creating a user with duplicated email', async () => {
    const repo = new InMemoryUserRepository()
    const verificationRepo = new InMemoryAccountVerificationRepository()
    const emailService = new FakeTransactionalEmailService()
    const issueAccountVerificationUseCase = new IssueAccountVerificationUseCase(
      verificationRepo,
      emailService,
      10,
      60,
      5,
    )
    const useCase = new CreateUserUseCase(repo, issueAccountVerificationUseCase)

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
