import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'

import { Music } from '@/domain/musics/entities/music'
import { PrismaMusicMapper } from './mappers/prisma-music.mapper'
import { MusicRepository } from '@/domain/musics/repositories/music-repository'

@Injectable()
export class PrismaMusicRepository implements MusicRepository {
  constructor(private prisma: PrismaService) {}

  async create(music: Music): Promise<void> {
    await this.prisma.music.create({
      data: PrismaMusicMapper.toPrisma(music),
    })
  }

  async update(music: Music): Promise<void> {
    await this.prisma.music.update({
      where: { id: music.id },
      data: PrismaMusicMapper.toPrisma(music),
    })
  }

  async findMany({ page, limit }: { page: number; limit: number }) {
    const skip = (page - 1) * limit

    const [data, total] = await this.prisma.$transaction([
      this.prisma.music.findMany({
        where: { deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.music.count({
        where: { deletedAt: null },
      }),
    ])

    return {
      data: data.map(PrismaMusicMapper.toDomain),
      total,
    }
  }

  async findById(id: string): Promise<Music | null> {
    const music = await this.prisma.music.findUnique({
      where: { id },
    })

    if (!music) return null

    return PrismaMusicMapper.toDomain(music)
  }

  async findBySlug(slug: string): Promise<Music | null> {
    const music = await this.prisma.music.findUnique({
      where: { slug },
    })

    if (!music) return null

    return PrismaMusicMapper.toDomain(music)
  }

  async save(music: Music): Promise<void> {
    await this.prisma.music.update({
      where: { id: music.id },
      data: PrismaMusicMapper.toPrisma(music),
    })
  }
}
