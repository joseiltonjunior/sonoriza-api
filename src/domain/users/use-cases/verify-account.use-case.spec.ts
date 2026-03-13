import { InMemorySessionRepository } from '@/domain/sessions/repositories/in-memory-session.repository'
import { CreateSessionUseCase } from '@/domain/sessions/use-cases/create-session.use-case'
import { SessionTokenService } from '@/domain/sessions/use-cases/session-token.service'

import { InMemoryAccountVerificationRepository } from '../repositories/in-memory-account-verification.repository'
import { InMemoryUserRepository } from '../repositories/in-memory-user.repository'
import { AccountAlreadyVerifiedError } from '../errors/account-already-verified.error'
import { InvalidVerificationCodeError } from '../errors/invalid-verification-code.error'
import { VerificationCodeExpiredError } from '../errors/verification-code-expired.error'
import { CreateUserUseCase } from './create-user.use-case'
import { IssueAccountVerificationUseCase } from './issue-account-verification.use-case'
import { VerifyAccountUseCase } from './verify-account.use-case'

class FakeTransactionalEmailService {
  public sent: Array<{ code: string }> = []

  async sendAccountVerification(input: {
    to: string
    name: string
    code: string
    expiresInMinutes: number
  }) {
    this.sent.push({ code: input.code })
  }
}

class FakeSessionTokenService implements SessionTokenService {
  generateAccessToken(): string {
    return 'access-token'
  }

  generateRefreshToken(): { token: string; expiresAt: Date } {
    return {
      token: 'refresh-token',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    }
  }

  verifyRefreshToken(): { sub: string; jti: string; type: 'refresh' } {
    return {
      sub: 'user-id',
      jti: 'session-id',
      type: 'refresh',
    }
  }
}

describe('VerifyAccountUseCase', () => {
  it('should verify account and create session', async () => {
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
    const createSession = new CreateSessionUseCase(
      new InMemorySessionRepository(),
      new FakeSessionTokenService(),
    )
    const useCase = new VerifyAccountUseCase(
      userRepo,
      verificationRepo,
      createSession,
    )

    await createUser.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    const result = await useCase.execute({
      email: 'john@example.com',
      code: emailService.sent[0].code,
    })

    expect(result.accessToken).toBe('access-token')
    expect(result.refreshToken).toBe('refresh-token')
    expect(result.user.accountStatus).toBe('ACTIVE')

    const user = await userRepo.findByEmail('john@example.com')
    expect(user?.accountStatus).toBe('ACTIVE')
    expect(user?.emailVerifiedAt).toBeInstanceOf(Date)
  })

  it('should throw when verification code is invalid', async () => {
    const userRepo = new InMemoryUserRepository()
    const verificationRepo = new InMemoryAccountVerificationRepository()
    const issueVerification = new IssueAccountVerificationUseCase(
      verificationRepo,
      new FakeTransactionalEmailService(),
      10,
      60,
      5,
    )
    const createUser = new CreateUserUseCase(userRepo, issueVerification)
    const createSession = new CreateSessionUseCase(
      new InMemorySessionRepository(),
      new FakeSessionTokenService(),
    )
    const useCase = new VerifyAccountUseCase(
      userRepo,
      verificationRepo,
      createSession,
    )

    await createUser.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    await expect(
      useCase.execute({
        email: 'john@example.com',
        code: '999999',
      }),
    ).rejects.toBeInstanceOf(InvalidVerificationCodeError)
  })

  it('should throw when verification code is expired', async () => {
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
    const createSession = new CreateSessionUseCase(
      new InMemorySessionRepository(),
      new FakeSessionTokenService(),
    )
    const useCase = new VerifyAccountUseCase(
      userRepo,
      verificationRepo,
      createSession,
    )

    await createUser.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    verificationRepo.items[0].expiresAt = new Date(Date.now() - 1000)

    await expect(
      useCase.execute({
        email: 'john@example.com',
        code: emailService.sent[0].code,
      }),
    ).rejects.toBeInstanceOf(VerificationCodeExpiredError)
  })

  it('should throw when account is already verified', async () => {
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
    const createSession = new CreateSessionUseCase(
      new InMemorySessionRepository(),
      new FakeSessionTokenService(),
    )
    const useCase = new VerifyAccountUseCase(
      userRepo,
      verificationRepo,
      createSession,
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
      useCase.execute({
        email: 'john@example.com',
        code: emailService.sent[0].code,
      }),
    ).rejects.toBeInstanceOf(AccountAlreadyVerifiedError)
  })
})
