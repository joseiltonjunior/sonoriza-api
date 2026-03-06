import { CreateUserDTO } from '../dtos/create-user-dto'
import { User } from '../entities/user'

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  create(data: CreateUserDTO): Promise<User>
  update(user: User): Promise<void>
}

export const UserRepositoryToken = Symbol('UserRepository')
