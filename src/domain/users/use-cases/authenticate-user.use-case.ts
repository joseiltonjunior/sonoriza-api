import { UserRepository } from '../repositories/user-repository'
import { AuthenticateDTO } from '../dtos/authenticate.dto'
import { compare } from 'bcryptjs'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error'
import { UnauthorizedError } from '../errors/unauthorized.error'

export class AuthenticateUserUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(input: AuthenticateDTO): Promise<{
    id: string
    role: 'ADMIN' | 'USER'
    email: string
    name: string
    isActive: boolean
    photoUrl: string | null
  }> {
    const { email, password } = input

    const user = await this.userRepo.findByEmail(email)
    if (!user) throw new InvalidCredentialsError()

    if (!user.isActive || user.deletedAt) {
      throw new UnauthorizedError()
    }

    const isValid = await compare(password, user.password)
    if (!isValid) throw new InvalidCredentialsError()

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl,
      role: user.role,
      isActive: user.isActive,
    }
  }
}
