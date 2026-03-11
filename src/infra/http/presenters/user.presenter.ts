import { User } from '@/domain/users/entities/user'

export class UserPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      photoUrl: user.photoUrl,
      createdAt: user.createdAt,
    }
  }
}
