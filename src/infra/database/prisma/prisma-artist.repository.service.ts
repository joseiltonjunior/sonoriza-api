import { Injectable } from '@nestjs/common'
import { ArtistsRepository } from '@/domain/artists/repositories/artists-repository'
import { Artist } from '@/domain/artists/entities/artist'
import { PrismaService } from './prisma.service'
import {
  PrismaArtistMapper,
  PrismaArtistWithRelations,
} from './mappers/prisma-artist.mapper'

const artistIncludeWithGenresAndMusics = {
  musicalGenres: {
    include: {
      genre: true,
    },
  },
  musics: {
    include: {
      music: true,
    },
  },
}

@Injectable()
export class PrismaArtistRepository implements ArtistsRepository {
  constructor(private prisma: PrismaService) {}

  async create(artist: Artist): Promise<void> {
    await this.prisma.artist.create({
      data: {
        ...PrismaArtistMapper.toPrisma(artist),
        musicalGenres:
          artist.genreIds.length > 0
            ? {
                create: artist.genreIds.map((genreId) => ({ genreId })),
              }
            : undefined,
      },
    })
  }

  async findById(id: string): Promise<Artist | null> {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
      include: artistIncludeWithGenresAndMusics,
    })

    if (!artist || artist.deletedAt) {
      return null
    }

    return PrismaArtistMapper.toDomain(artist as PrismaArtistWithRelations)
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
        include: artistIncludeWithGenresAndMusics,
      }),
      this.prisma.artist.count({
        where: { deletedAt: null },
      }),
    ])

    return {
      data: (data as PrismaArtistWithRelations[]).map(
        PrismaArtistMapper.toDomain,
      ),
      total,
    }
  }

  async update(artist: Artist): Promise<void> {
    await this.prisma.artist.update({
      where: { id: artist.id },
      data: {
        ...PrismaArtistMapper.toPrisma(artist),
        musicalGenres: {
          deleteMany: {},
          create: artist.genreIds.map((genreId) => ({ genreId })),
        },
      },
    })
  }
}
