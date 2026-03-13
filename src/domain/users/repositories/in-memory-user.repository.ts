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

  async findMany({
    page,
    limit,
  }: {
    page: number
    limit: number
  }): Promise<{ data: User[]; total: number }> {
    const activeUsers = this.items
      .filter((user) => user.deletedAt === null)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const total = activeUsers.length
    const skip = (page - 1) * limit
    const data = activeUsers.slice(skip, skip + limit)

    return { data, total }
  }

  async create(data: CreateUserDTO): Promise<User> {
    const user = new User(
      randomUUID(),
      data.name,
      data.email,
      data.password,
      data.role ?? 'USER',
      'PENDING_VERIFICATION',
      null,
      null,
      new Date(),
      new Date(),
      null,
    )

    this.items.push(user)

    return user
  }

  async update(user: User): Promise<void> {
    const index = this.items.findIndex((item) => item.id === user.id)

    if (index >= 0) {
      this.items[index] = user
    }
  }
}
