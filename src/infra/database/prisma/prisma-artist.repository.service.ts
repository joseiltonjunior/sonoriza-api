import { Injectable } from '@nestjs/common'
import { ArtistRepository } from '@/domain/musics/repositories/artist-repository'
import { PrismaService } from './prisma.service'

@Injectable()
export class PrismaArtistRepository implements ArtistRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<{ id: string } | null> {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
      select: {
        id: true,
        deletedAt: true,
      },
    })

    if (!artist || artist.deletedAt) {
      return null
    }

    return { id: artist.id }
  }
}
