import { Injectable } from '@nestjs/common'
import { ArtistsRepository } from '@/domain/artists/repositories/artists-repository'
import { Artist } from '@/domain/artists/entities/artist'
import { PrismaService } from './prisma.service'
import { PrismaArtistMapper } from './mappers/prisma-artist.mapper'

@Injectable()
export class PrismaArtistRepository implements ArtistsRepository {
  constructor(private prisma: PrismaService) {}

  async create(artist: Artist): Promise<void> {
    await this.prisma.artist.create({
      data: PrismaArtistMapper.toPrisma(artist),
    })
  }

  async findById(id: string): Promise<Artist | null> {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    })

    if (!artist || artist.deletedAt) {
      return null
    }

    return PrismaArtistMapper.toDomain(artist)
  }

  async findMany({
    page,
    limit,
  }: {
    page: number
    limit: number
  }): Promise<{ data: Artist[]; total: number }> {
    const skip = (page - 1) * limit

    const [data, total] = await this.prisma.$transaction([
      this.prisma.artist.findMany({
        where: { deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.artist.count({
        where: { deletedAt: null },
      }),
    ])

    return {
      data: data.map(PrismaArtistMapper.toDomain),
      total,
    }
  }

  async update(artist: Artist): Promise<void> {
    await this.prisma.artist.update({
      where: { id: artist.id },
      data: PrismaArtistMapper.toPrisma(artist),
    })
  }
}
