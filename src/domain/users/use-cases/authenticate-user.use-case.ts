import { UserRepository } from '../repositories/user-repository'
import { AuthenticateDTO } from '../dtos/authenticate.dto'
import { compare } from 'bcryptjs'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error'

export class AuthenticateUserUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(
    input: AuthenticateDTO,
  ): Promise<{ id: string; role: string; email: string }> {
    const { email, password } = input

    const user = await this.userRepo.findByEmail(email)
    if (!user) throw new InvalidCredentialsError()

    const isValid = await compare(password, user.password)
    if (!isValid) throw new InvalidCredentialsError()

    return { id: user.id, role: user.role, email: user.email }
  }
}
