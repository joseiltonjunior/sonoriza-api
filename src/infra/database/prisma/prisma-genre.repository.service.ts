import { Injectable } from '@nestjs/common'
import { GenreRepository as MusicGenreRepository } from '@/domain/musics/repositories/genre-repository'
import { GenresRepository } from '@/domain/genres/repositories/genres-repository'
import { Genre } from '@/domain/genres/entities/genre'
import { PrismaService } from './prisma.service'
import { PrismaGenreMapper } from './mappers/prisma-genre.mapper'

@Injectable()
export class PrismaGenreRepository
  implements MusicGenreRepository, GenresRepository
{
  constructor(private prisma: PrismaService) {}

  async create(genre: Genre): Promise<void> {
    await this.prisma.genre.create({
      data: PrismaGenreMapper.toPrisma(genre),
    })
  }

  async findById(id: string): Promise<Genre | null> {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
    })

    if (!genre || genre.deletedAt) {
      return null
    }

    return PrismaGenreMapper.toDomain(genre)
  }

  async findByName(name: string): Promise<Genre | null> {
    const genre = await this.prisma.genre.findUnique({
      where: { name },
    })

    if (!genre) {
      return null
    }

    return PrismaGenreMapper.toDomain(genre)
  }

  async findMany({
    page,
    limit,
  }: {
    page: number
    limit: number
  }): Promise<{ data: Genre[]; total: number }> {
    const skip = (page - 1) * limit

    const [data, total] = await this.prisma.$transaction([
      this.prisma.genre.findMany({
        where: { deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.genre.count({
        where: { deletedAt: null },
      }),
    ])

    return {
      data: data.map(PrismaGenreMapper.toDomain),
      total,
    }
  }

  async update(genre: Genre): Promise<void> {
    await this.prisma.genre.update({
      where: { id: genre.id },
      data: PrismaGenreMapper.toPrisma(genre),
    })
  }
}
