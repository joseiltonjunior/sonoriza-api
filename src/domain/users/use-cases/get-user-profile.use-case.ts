import { ResponseUserProfileDTO } from '../dtos/response-user-profile.dto'
import { UserNotFoundError } from '../errors/user-not-found.error'
import { UserRepository } from '../repositories/user-repository'

export class GetUserProfileUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(userId: string): Promise<ResponseUserProfileDTO> {
    const user = await this.userRepo.findById(userId)

    if (!user || user.deletedAt) {
      throw new UserNotFoundError()
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      photoUrl: user.photoUrl,
    }
  }
}
