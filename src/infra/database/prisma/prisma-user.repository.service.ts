import { Injectable } from '@nestjs/common'

import { PrismaService } from './prisma.service'
import { UserRepository } from '@/domain/users/repositories/user-repository'
import { CreateUserDTO } from '@/domain/users/dtos/create-user-dto'
import { PrismaUserMapper } from './mappers/prisma-user.mapper'
import { User } from '@/domain/users/entities/user'

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) return null
    return PrismaUserMapper.toDomain(user)
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) return null
    return PrismaUserMapper.toDomain(user)
  }

  async findMany({
    page,
    limit,
  }: {
    page: number
    limit: number
  }): Promise<{ data: User[]; total: number }> {
    const skip = (page - 1) * limit

    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where: { deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where: { deletedAt: null } }),
    ])

    return {
      data: data.map(PrismaUserMapper.toDomain),
      total,
    }
  }

  async create(data: CreateUserDTO) {
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: 'USER',
        isActive: false,
      },
    })

    return PrismaUserMapper.toDomain(user)
  }

  async update(user: User): Promise<void> {
    await this.prisma.user.update({
      where: { id: user.id },
      data: PrismaUserMapper.toPrisma(user),
    })
  }
}
