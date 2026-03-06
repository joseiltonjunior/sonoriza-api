import { UserNotFoundError } from '../errors/user-not-found.error'
import { UserRepository } from '../repositories/user-repository'

export class SoftDeleteUserUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(userId: string): Promise<void> {
    const user = await this.userRepo.findById(userId)

    if (!user || user.deletedAt) {
      throw new UserNotFoundError()
    }

    user.softDelete()

    await this.userRepo.update(user)
  }
}
