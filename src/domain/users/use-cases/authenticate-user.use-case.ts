import { compare } from 'bcryptjs'

import { AuthenticateDTO } from '../dtos/authenticate.dto'
import { AccountPendingVerificationError } from '../errors/account-pending-verification.error'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error'
import { UnauthorizedError } from '../errors/unauthorized.error'
import { UserRepository } from '../repositories/user-repository'

export class AuthenticateUserUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(input: AuthenticateDTO): Promise<{
    id: string
    role: 'ADMIN' | 'USER'
    email: string
    name: string
    accountStatus: 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED'
    photoUrl: string | null
  }> {
    const { email, password } = input

    const user = await this.userRepo.findByEmail(email)
    if (!user) throw new InvalidCredentialsError()

    const isValid = await compare(password, user.password)
    if (!isValid) throw new InvalidCredentialsError()

    if (user.deletedAt) {
      throw new UnauthorizedError()
    }

    if (user.accountStatus === 'PENDING_VERIFICATION') {
      throw new AccountPendingVerificationError()
    }

    if (user.accountStatus !== 'ACTIVE') {
      throw new UnauthorizedError()
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl,
      role: user.role,
      accountStatus: user.accountStatus,
    }
  }
}
