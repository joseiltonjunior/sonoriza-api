import { hash } from 'bcryptjs'

import { CreateUserDTO } from '../dtos/create-user-dto'
import { ResponseCreateUserDTO } from '../dtos/response-create-user.dto'
import { UserAlreadyExistsError } from '../errors/user-already-exists.error'
import { UserRepository } from '../repositories/user-repository'
import { IssueAccountVerificationUseCase } from './issue-account-verification.use-case'

export class CreateUserUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly issueAccountVerificationUseCase: IssueAccountVerificationUseCase,
  ) {}

  async execute(input: CreateUserDTO): Promise<ResponseCreateUserDTO> {
    const { name, email, password } = input

    const existing = await this.userRepo.findByEmail(email)
    if (existing) {
      throw new UserAlreadyExistsError(email)
    }

    const passwordHash = await hash(password, 8)

    const created = await this.userRepo.create({
      name,
      email,
      password: passwordHash,
    })

    await this.issueAccountVerificationUseCase.execute(created)

    return {
      id: created.id,
      name: created.name,
      email: created.email,
      role: created.role,
      accountStatus: created.accountStatus,
      photoUrl: created.photoUrl,
      createdAt: created.createdAt,
    }
  }
}
