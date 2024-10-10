import { Prisma, Artist } from '@prisma/client'
import { prisma } from '@/lib/prisma'

import { ArtistsRepository, ArtistsPaginated } from '../artists-repository'

export class PrismaArtistsRepository implements ArtistsRepository {
  async edit(data: Prisma.ArtistUpdateInput): Promise<Artist> {
    const artist = await prisma.artist.update({
      where: { id: data.id as string },
      data,
    })

    return artist
  }

  async findManyByPaginated(page: number): Promise<ArtistsPaginated | null> {
    const artists = await prisma.artist.findMany({
      take: 20,
      skip: (page - 1) * 20,
    })

    const totalOrders = await prisma.artist.findMany()

    return {
      artists,
      currentPage: page,
      totalItems: totalOrders.length,
      totalPages: Math.ceil(totalOrders.length / 20),
    }
  }

  async findById(id: string): Promise<Artist | null> {
    const artist = await prisma.artist.findUnique({
      where: {
        id,
      },
    })

    return artist
  }

  async create(data: Prisma.ArtistCreateInput) {
    const address = prisma.artist.create({
      data,
    })

    return address
  }
}
