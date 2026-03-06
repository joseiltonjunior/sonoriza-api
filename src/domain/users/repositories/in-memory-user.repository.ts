import { UserRepository } from './user-repository'
import { User } from '../entities/user'
import { randomUUID } from 'node:crypto'
import { CreateUserDTO } from '../dtos/create-user-dto'

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = []

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((u) => u.email === email)
    return user ?? null
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((u) => u.id === id)
    return user ?? null
  }

  async create(data: CreateUserDTO): Promise<User> {
    const user = new User(
      randomUUID(),
      data.name,
      data.email,
      data.password,
      data.role ?? 'USER',
      new Date(),
    )

    this.items.push(user)

    return user
  }
}
