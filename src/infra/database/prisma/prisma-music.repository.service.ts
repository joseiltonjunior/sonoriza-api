import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from './prisma.service'

import { Music } from '@/domain/musics/entities/music'
import {
  PrismaMusicMapper,
  PrismaMusicWithRelations,
} from './mappers/prisma-music.mapper'
import { MusicRepository } from '@/domain/musics/repositories/music-repository'

const artistIncludeWithGenres = {
  musics: true,
  musicalGenres: {
    include: {
      genre: true,
    },
  },
} as unknown as Prisma.ArtistInclude

@Injectable()
export class PrismaMusicRepository implements MusicRepository {
  constructor(private prisma: PrismaService) {}

  async create(music: Music): Promise<void> {
    await this.prisma.music.create({
      data: {
        ...PrismaMusicMapper.toPrisma(music),
        artists:
          music.artistIds.length > 0
            ? {
                create: music.artistIds.map((artistId) => ({ artistId })),
              }
            : undefined,
      },
    })
  }

  async update(music: Music): Promise<void> {
    await this.prisma.music.update({
      where: { id: music.id },
      data: {
        ...PrismaMusicMapper.toPrisma(music),
        artists: {
          deleteMany: {},
          create: music.artistIds.map((artistId) => ({ artistId })),
        },
      },
    })
  }

  async findMany({
    page,
    limit,
    artistId,
  }: {
    page: number
    limit: number
    artistId?: string
  }) {
    const skip = (page - 1) * limit
    const where: Prisma.MusicWhereInput = {
      deletedAt: null,
      ...(artistId
        ? {
            artists: {
              some: {
                artistId,
              },
            },
          }
        : {}),
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.music.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          genre: true,
          artists: {
            include: {
              artist: {
                include: artistIncludeWithGenres,
              },
            },
          },
        },
      }),
      this.prisma.music.count({
        where,
      }),
    ])

    return {
      data: (data as unknown as PrismaMusicWithRelations[]).map(
        PrismaMusicMapper.toDomain,
      ),
      total,
    }
  }

  async findById(id: string): Promise<Music | null> {
    const music = await this.prisma.music.findUnique({
      where: { id },
      include: {
        genre: true,
        artists: {
          include: {
            artist: {
              include: artistIncludeWithGenres,
            },
          },
        },
      },
    })

    if (!music || music.deletedAt !== null) return null

    return PrismaMusicMapper.toDomain(
      music as unknown as PrismaMusicWithRelations,
    )
  }

  async findBySlug(slug: string): Promise<Music | null> {
    const music = await this.prisma.music.findUnique({
      where: { slug },
      include: {
        genre: true,
        artists: {
          include: {
            artist: {
              include: artistIncludeWithGenres,
            },
          },
        },
      },
    })

    if (!music || music.deletedAt !== null) return null

    return PrismaMusicMapper.toDomain(
      music as unknown as PrismaMusicWithRelations,
    )
  }

  async save(music: Music): Promise<void> {
    await this.prisma.music.update({
      where: { id: music.id },
      data: PrismaMusicMapper.toPrisma(music),
    })
  }
}
