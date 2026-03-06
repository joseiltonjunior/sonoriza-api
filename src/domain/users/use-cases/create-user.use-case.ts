import { UserRepository } from '../repositories/user-repository'

import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from '../errors/user-already-exists.error'
import { ResponseCreateUserDTO } from '../dtos/response-create-user.dto'
import { CreateUserDTO } from '../dtos/create-user-dto'

export class CreateUserUseCase {
  constructor(private userRepo: UserRepository) {}

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

    return {
      id: created.id,
      name: created.name,
      email: created.email,
      role: created.role,
      photoUrl: created.photoUrl,
      createdAt: created.createdAt,
    }
  }
}
