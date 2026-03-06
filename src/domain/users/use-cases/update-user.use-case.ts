import { UpdateUserDTO } from '../dtos/update-user.dto'
import { ResponseUpdateUserDTO } from '../dtos/response-update-user.dto'
import { UserAlreadyExistsError } from '../errors/user-already-exists.error'
import { UserNotFoundError } from '../errors/user-not-found.error'
import { UserRepository } from '../repositories/user-repository'

export class UpdateUserUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(
    userId: string,
    data: UpdateUserDTO,
  ): Promise<ResponseUpdateUserDTO> {
    const user = await this.userRepo.findById(userId)

    if (!user || user.deletedAt) {
      throw new UserNotFoundError()
    }

    if (data.email && data.email !== user.email) {
      const existing = await this.userRepo.findByEmail(data.email)

      if (existing && existing.id !== user.id) {
        throw new UserAlreadyExistsError(data.email)
      }
    }

    user.updateProfile({
      name: data.name,
      email: data.email,
      photoUrl: data.photoUrl,
    })

    await this.userRepo.update(user)

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      photoUrl: user.photoUrl,
      updatedAt: user.updatedAt,
    }
  }
}
