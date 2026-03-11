import { ResponseUpdateUserStatusDTO } from '../dtos/response-update-user-status.dto'
import { UpdateUserStatusDTO } from '../dtos/update-user-status.dto'
import { UserNotFoundError } from '../errors/user-not-found.error'
import { UserRepository } from '../repositories/user-repository'

export class UpdateUserStatusUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(
    userId: string,
    data: UpdateUserStatusDTO,
  ): Promise<ResponseUpdateUserStatusDTO> {
    const user = await this.userRepo.findById(userId)

    if (!user || user.deletedAt) {
      throw new UserNotFoundError()
    }

    user.setActiveStatus(data.isActive)

    await this.userRepo.update(user)

    return {
      id: user.id,
      isActive: user.isActive,
      updatedAt: user.updatedAt,
    }
  }
}
