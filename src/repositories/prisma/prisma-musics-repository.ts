import { Music, Prisma } from '@prisma/client'
import { MusicsPaginated, MusicsRepository } from '../musics-repository'
import { prisma } from '@/lib/prisma'

export class PrismaMusicsRepository implements MusicsRepository {
  async findManyByPaginated(page: number): Promise<MusicsPaginated | null> {
    const musics = await prisma.music.findMany({
      take: 20,
      skip: (page - 1) * 20,
    })

    const totalOrders = await prisma.music.findMany()

    return {
      musics,
      currentPage: page,
      totalItems: totalOrders.length,
      totalPages: Math.ceil(totalOrders.length / 10),
    }
  }

  async edit(data: Prisma.MusicUpdateInput): Promise<Music> {
    const music = await prisma.music.update({
      where: { id: data.id as string },
      data,
    })

    return music
  }

  async findById(id: string) {
    const music = await prisma.music.findFirst({
      where: {
        id,
      },
    })

    return music
  }

  async create(
    data: Prisma.MusicCreateInput & { artists: string[]; musicalGenre: string },
  ): Promise<Music> {
    const music = await prisma.music.create({
      data: {
        ...data,
        artists: {
          connect: data.artists.map((artistId) => ({ id: artistId })),
        },
        musicalGenre: {
          connect: { id: data.musicalGenre },
        },
      },
      include: {
        musicalGenre: true,
        artists: true,
      },
    })

    return music
  }
}
