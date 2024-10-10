import { MusicalGenre, Prisma } from '@prisma/client'
import { MusicalGenresRepository } from '../musical-genres-repository'
import { prisma } from '@/lib/prisma'

export class PrismaMusicalGenresRepository implements MusicalGenresRepository {
  async edit(data: Prisma.MusicalGenreUpdateInput): Promise<MusicalGenre> {
    const musicalGenre = await prisma.musicalGenre.update({
      where: { id: data.id as string },
      data,
    })

    return musicalGenre
  }

  async findById(id: string): Promise<MusicalGenre | null> {
    const musicalGenre = await prisma.musicalGenre.findUnique({
      where: {
        id,
      },
    })

    return musicalGenre
  }

  async findByName(name: string): Promise<MusicalGenre | null> {
    const artist = await prisma.musicalGenre.findFirst({
      where: {
        name,
      },
    })

    return artist
  }

  async create(data: Prisma.MusicalGenreCreateInput): Promise<MusicalGenre> {
    const musicalGenre = prisma.musicalGenre.create({
      data,
    })

    return musicalGenre
  }
}
