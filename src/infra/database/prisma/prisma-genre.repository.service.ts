import { Injectable } from '@nestjs/common'
import { GenreRepository } from '@/domain/musics/repositories/genre-repository'
import { PrismaService } from './prisma.service'

@Injectable()
export class PrismaGenreRepository implements GenreRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<{ id: string } | null> {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      select: {
        id: true,
        deletedAt: true,
      },
    })

    if (!genre || genre.deletedAt) {
      return null
    }

    return { id: genre.id }
  }
}
