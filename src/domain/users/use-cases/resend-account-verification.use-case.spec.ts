import { InMemoryAccountVerificationRepository } from '../repositories/in-memory-account-verification.repository'
import { InMemoryUserRepository } from '../repositories/in-memory-user.repository'
import { AccountAlreadyVerifiedError } from '../errors/account-already-verified.error'
import { VerificationResendCooldownError } from '../errors/verification-resend-cooldown.error'
import { CreateUserUseCase } from './create-user.use-case'
import { IssueAccountVerificationUseCase } from './issue-account-verification.use-case'
import { ResendAccountVerificationUseCase } from './resend-account-verification.use-case'

class FakeTransactionalEmailService {
  public sent: Array<{ to: string; code: string }> = []

  async sendAccountVerification(input: {
    to: string
    name: string
    code: string
    expiresInMinutes: number
  }) {
    this.sent.push(input)
  }
}

describe('ResendAccountVerificationUseCase', () => {
  it('should resend verification code after cooldown', async () => {
    const userRepo = new InMemoryUserRepository()
    const verificationRepo = new InMemoryAccountVerificationRepository()
    const emailService = new FakeTransactionalEmailService()
    const issueVerification = new IssueAccountVerificationUseCase(
      verificationRepo,
      emailService,
      10,
      60,
      5,
    )
    const createUser = new CreateUserUseCase(userRepo, issueVerification)
    const useCase = new ResendAccountVerificationUseCase(
      userRepo,
      verificationRepo,
      issueVerification,
    )

    await createUser.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    verificationRepo.items[0].resendAvailableAt = new Date(Date.now() - 1000)

    const result = await useCase.execute({ email: 'john@example.com' })

    expect(result.message).toBe('Verification code sent successfully.')
    expect(emailService.sent).toHaveLength(2)
    expect(verificationRepo.items).toHaveLength(2)
    expect(verificationRepo.items[0].revokedAt).toBeInstanceOf(Date)
  })

  it('should block resend during cooldown', async () => {
    const userRepo = new InMemoryUserRepository()
    const verificationRepo = new InMemoryAccountVerificationRepository()
    const emailService = new FakeTransactionalEmailService()
    const issueVerification = new IssueAccountVerificationUseCase(
      verificationRepo,
      emailService,
      10,
      60,
      5,
    )
    const createUser = new CreateUserUseCase(userRepo, issueVerification)
    const useCase = new ResendAccountVerificationUseCase(
      userRepo,
      verificationRepo,
      issueVerification,
    )

    await createUser.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    await expect(
      useCase.execute({ email: 'john@example.com' }),
    ).rejects.toBeInstanceOf(VerificationResendCooldownError)
  })

  it('should reject resend for already verified account', async () => {
    const userRepo = new InMemoryUserRepository()
    const verificationRepo = new InMemoryAccountVerificationRepository()
    const emailService = new FakeTransactionalEmailService()
    const issueVerification = new IssueAccountVerificationUseCase(
      verificationRepo,
      emailService,
      10,
      60,
      5,
    )
    const createUser = new CreateUserUseCase(userRepo, issueVerification)
    const useCase = new ResendAccountVerificationUseCase(
      userRepo,
      verificationRepo,
      issueVerification,
    )

    const created = await createUser.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    const user = await userRepo.findById(created.id)
    if (user) {
      user.markEmailVerified()
      await userRepo.update(user)
    }

    await expect(
      useCase.execute({ email: 'john@example.com' }),
    ).rejects.toBeInstanceOf(AccountAlreadyVerifiedError)
  })
})
